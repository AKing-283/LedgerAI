from typing import TypedDict


class AccountingState(TypedDict):
    query: str
    document_text: str
    response: str