import requests

BASE_URL = "http://127.0.0.1:8000"


def upload_document(file):

    files = {
        "file": (
            file.name,
            file,
            "application/pdf"
        )
    }

    response = requests.post(
        f"{BASE_URL}/upload",
        files=files
    )

    return response.json()


def ask_question(question):

    response = requests.post(
        f"{BASE_URL}/chat",
        json={
            "question": question
        }
    )

    return response.json()