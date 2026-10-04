from fastapi.testclient import TestClient

from backend.main import app

client = TestClient(app)


def test_root_health_check():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "API is running"}


def test_openapi_schema_lists_routes():
    response = client.get("/openapi.json")

    assert response.status_code == 200
    paths = response.json()["paths"]
    assert "/" in paths
    assert any(path.startswith("/products") for path in paths)
