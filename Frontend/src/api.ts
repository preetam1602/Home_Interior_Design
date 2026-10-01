export const API_BASE_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface ConsultantContext {
  current_view?: string;
  focused_product_id?: number | null;
  saved_product_ids?: number[];
}

export interface ConsultantResponse {
  display_text: string;
  spoken_summary: string;
  product_ids: number[];
  estimated_total: number | null;
}

export async function askConsultant(
  message: string,
  history: ChatTurn[],
  context: ConsultantContext,
): Promise<ConsultantResponse> {
  const res = await fetch(`${API_BASE_URL}/ai/consult`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, context }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail = typeof body?.detail === 'string' ? body.detail : null;
    throw new Error(detail ?? 'The AI consultant is unavailable right now. Please try again shortly.');
  }
  return res.json();
}
