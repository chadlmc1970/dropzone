# backend/tests/test_main.py
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "service": "dropzone-api"}

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert "DropZone API" in response.json()["message"]
