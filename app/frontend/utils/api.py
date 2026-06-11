import requests

BASE_URL = "https://ai-accountant-copilot-102553128784.europe-west1.run.app"


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

    response = requests.post(
        f"{BASE_URL}/upload",
        files=files,
        timeout=120
    )

    print("STATUS:", response.status_code)
    print("TEXT:", response.text)

    if response.status_code != 200:
        return {
            "error": response.text
        }

    return response.json()


def ask_question(question):

    return requests.post(
        f"{BASE_URL}/chat",
        json={
            "question": question
        }
    ).json()