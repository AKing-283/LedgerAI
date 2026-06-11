from langchain_groq import ChatGroq

from app.config.settings import settings


llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=settings.GROQ_API_KEY,
    temperature=0
)


def ask_llm(
    question: str,
    context: str
):

    prompt = f"""
You are an AI accounting assistant.

Use the supplied context to answer.

If vendor details, GST details,
invoice details, payment details,
addresses, amounts or company
information appear anywhere in
the context, summarize them.

Only respond:

"I could not find this information in the documents."

when the requested information
is completely absent from the context.

Context:

{context}

Question:

{question}
"""

    response = llm.invoke(
        prompt
    )

    return response.content