from uuid import uuid4


def generate_reference_code(prefix: str = "CONS") -> str:
    return f"{prefix}-{uuid4().hex[:10].upper()}"
