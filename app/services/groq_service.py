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
You are an accounting assistant.

Answer ONLY using the supplied context.

If the answer is not available,
say:

"I could not find this information in the documents."

Context:

{context}

Question:

{question}
"""

    response = llm.invoke(
        prompt
    )

    return response.content