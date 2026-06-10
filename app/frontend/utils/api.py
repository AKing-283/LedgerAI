import requests

BASE_URL = "http://127.0.0.1:8000"


def get_documents():
    return requests.get(
        f"{BASE_URL}/documents"
    ).json()


def upload_document(file):

    files = {
        "file": (
            file.name,
            file,
            "application/pdf"
        )
    }

    return requests.post(
        f"{BASE_URL}/upload",
        files=files
    ).json()


def ask_question(question):

    return requests.post(
        f"{BASE_URL}/chat",
        json={
            "question": question
        }
    ).json()