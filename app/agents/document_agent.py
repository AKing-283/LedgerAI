from app.services.retrieval_service import retrieve_context
from app.services.groq_service import ask_llm


class DocumentAgent:

    def classify_query(self, question: str):

        q = question.lower()

        if "invoice" in q:
            return "invoice"

        if "gst" in q:
            return "gst"

        if "expense" in q:
            return "expense"

        if "vendor" in q:
            return "vendor"

        if "amount" in q:
            return "amount"

        return "general"

    def run(self, question: str):

        query_type = self.classify_query(question)

        context = retrieve_context(question)

        answer = ask_llm(
            question=question,
            context=context
        )

        return {
            "query_type": query_type,
            "answer": answer
        }