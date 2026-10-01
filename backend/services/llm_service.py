"""AI interior-design consultant: builds the prompt, calls the LLM, validates the answer."""
import json
import time

import httpx
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from backend.core.config import settings
from backend.schemas.consultant import ConsultantRequest, ConsultantResponse
from backend.services.logger import logger
from backend.services.product_retrieval import estimate_total, format_product_line, get_catalog

MAX_RECOMMENDATIONS = 6
HISTORY_TURNS = 8
MAX_RETRY_WAIT_SECONDS = 6

SYSTEM_PROMPT = """You are the AI interior design consultant for "Interior Design Studio", a home interior studio in Bangalore.
You help visitors plan rooms and choose paint colors, materials, furniture and decor from the studio's catalog.

Rules:
- Recommend ONLY products from the catalog below, referring to them by their exact name. Never invent products, brands or prices.
- Quote prices exactly as listed; they are in Indian Rupees and match the website. Paint is priced per litre and materials per sq.ft; say so when you mention them.
- Only state facts given in the catalog. Never make up dimensions, sizes, materials, warranties or delivery details; suggest a consultation for those.
- Never mention catalog ids in display_text or spoken_summary. In display_text write prices like ₹45,000 or ₹320 per litre.
- When the visitor gives a budget, keep the combined price of per-item recommendations within it and say roughly what the selection costs.
- If the room, budget or style is unclear, still give a useful suggestion, then ask one short follow-up question.
- If asked about something unrelated to interiors or the studio, politely steer back to interior design.
- For a full project quote, site visit or custom work, suggest booking a free consultation with the studio's designers.
- Keep display_text under 120 words, warm and practical. Use plain text, no markdown headings or tables.
- spoken_summary is read aloud by a video avatar: 1-3 short conversational sentences, no lists, no symbols, prices written like "45,000 rupees".

Respond with a JSON object only:
{"display_text": string, "spoken_summary": string, "product_ids": [catalog ids you recommend, most relevant first, max 6, empty if none]}

Catalog (id | name | category | room | price | styles | description):
{catalog}"""


def _context_block(req: ConsultantRequest, catalog: dict) -> str:
    ctx = req.context
    lines = []
    if ctx.current_view:
        lines.append(f"Visitor is on the '{ctx.current_view}' page.")
    focused = catalog.get(ctx.focused_product_id) if ctx.focused_product_id else None
    if focused:
        lines.append(f"Visitor is asking about this product: {focused.id} {focused.name}.")
    saved = [catalog[i].name for i in ctx.saved_product_ids if i in catalog]
    if saved:
        lines.append(f"Visitor has saved: {', '.join(saved)}.")
    return "\n".join(lines)


def _post_completion(messages: list[dict]) -> httpx.Response:
    return httpx.post(
        f"{settings.llm_base_url}/chat/completions",
        headers={"Authorization": f"Bearer {settings.llm_key}"},
        json={
            "model": settings.llm_model,
            "messages": messages,
            "temperature": 0.5,
            "max_completion_tokens": 800,
            "reasoning_effort": "low",
            "response_format": {"type": "json_object"},
        },
        timeout=30,
    )


def _call_llm(messages: list[dict]) -> str:
    try:
        response = _post_completion(messages)
        if response.status_code == 429:
            # Provider rate limit (tokens per minute). Retry once if the wait is short.
            wait = float(response.headers.get("retry-after", "0") or 0)
            if 0 < wait <= MAX_RETRY_WAIT_SECONDS:
                time.sleep(wait)
                response = _post_completion(messages)
            if response.status_code == 429:
                logger.warning(f"LLM rate limited: {response.text[:300]}")
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="The AI consultant is busy right now. Please try again in a minute.",
                )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"] or ""
    except (httpx.HTTPError, KeyError, IndexError, ValueError) as exc:
        detail = exc.response.text[:300] if isinstance(exc, httpx.HTTPStatusError) else str(exc)
        logger.error(f"LLM request failed: {detail}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="The AI consultant is unavailable right now. Please try again shortly.",
        )


def consult(db: Session, req: ConsultantRequest) -> ConsultantResponse:
    if not settings.llm_key:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="AI consultant is not configured")

    catalog = get_catalog(db)
    system = SYSTEM_PROMPT.replace("{catalog}", "\n".join(format_product_line(p) for p in catalog.values()))
    context = _context_block(req, catalog)
    if context:
        system += f"\n\nCurrent visitor context:\n{context}"

    messages = [{"role": "system", "content": system}]
    messages += [{"role": t.role, "content": t.content} for t in req.history[-HISTORY_TURNS:]]
    messages.append({"role": "user", "content": req.message})

    raw = _call_llm(messages)
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        logger.warning("LLM returned non-JSON content; showing it as plain text")
        data = {"display_text": raw}

    display_text = str(data.get("display_text") or "").strip() or "Sorry, I couldn't put together an answer. Could you rephrase?"
    spoken_summary = str(data.get("spoken_summary") or "").strip() or display_text

    # Drop ids the model invented, keep order, remove duplicates.
    product_ids: list[int] = []
    for value in data.get("product_ids") or []:
        try:
            pid = int(value)
        except (TypeError, ValueError):
            continue
        if pid in catalog and pid not in product_ids:
            product_ids.append(pid)
    product_ids = product_ids[:MAX_RECOMMENDATIONS]

    return ConsultantResponse(
        display_text=display_text,
        spoken_summary=spoken_summary,
        product_ids=product_ids,
        estimated_total=estimate_total([catalog[i] for i in product_ids]),
    )
