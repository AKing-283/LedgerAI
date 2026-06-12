from wsgiref import headers

import requests

BASE_URL = "http://127.0.0.1:8000"


def get_documents(token):

    headers = {
        "Authorization":
        f"Bearer {token}"
    }

    response = requests.get(
        f"{BASE_URL}/documents",
        headers=headers
    )

    return response.json()

def upload_document(file, token):
    headers = {
        "Authorization": f"Bearer {token}"
    }

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
        timeout=120,
        headers=headers
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

def register(organization_name, email, password):

    return requests.post(
        f"{BASE_URL}/auth/register",
        json={
            "organization_name": organization_name,
            "email": email,
            "password": password
        }
    ).json()

def login(
    email,
    password
):

    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={
            "email": email,
            "password": password
        }
    )

    return response.json()

def ask_question(
    question,
    token
):

    headers = {
        "Authorization":
        f"Bearer {token}"
    }

    response = requests.post(
        f"{BASE_URL}/chat",
        json={
            "question": question
        },
        headers=headers
    )

    return response.json()
