from app.services.retrieval_service import (retrieve_context)

from app.services.groq_service import (ask_llm)


class DocumentAgent:

    def run(self,question: str):

        context = retrieve_context(question)

        answer = ask_llm(question,context)

        return answer
    
    def classify_query(self,question):

        q = question.lower()

        if "invoice" in q:
            return "invoice"

        if "gst" in q:
            return "gst"

        if "expense" in q:
            return "expense"

        return "general"

    def run(self,question):

        query_type = self.classify_query(question)

        context = retrieve_context(question)

        answer = ask_llm(question,context)

        return {
            "query_type": query_type,
            "answer": answer
        }