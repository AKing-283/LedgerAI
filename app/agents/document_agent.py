from app.services.retrieval_service import retrieve_context
from app.services.groq_service import ask_llm


class DocumentAgent:

    def classify_query(
        self,
        question
    ):

        q = question.lower()

        if "invoice" in q:
            return "invoice"

        if "gst" in q:
            return "gst"

        if "expense" in q:
            return "expense"

        if "vendor" in q:
            return "vendor"

        return "general"

    def run(
        self,
        organization_id,
        question
    ):
        print("=" * 50)
        print("DOCUMENT AGENT")
        print("ORG:", organization_id)
        print("QUESTION:", question)
        print("=" * 50)
        query_type = self.classify_query(
            question
        )

        context = retrieve_context(
            organization_id,
            question
        )

        answer = ask_llm(
            question,
            context
        )

        return {
            "query_type": query_type,
            "answer": answer
        }