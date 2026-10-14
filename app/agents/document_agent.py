from app.services.retrieval_service import retrieve_chunks


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

        # Let QdrantUnavailableError / QdrantConfigError propagate so the
        # API layer can return 503/500 instead of a fabricated grounded answer.
        # Empty context ("") means no matching documents, which is handled
        # separately from a connectivity failure (exception).
        chunks = retrieve_chunks(
            organization_id,
            question
        )
        context = "\n\n".join(c["content"] for c in chunks if c["content"])

        # Import here to keep module import light for unit tests that mock it.
        from app.services.groq_service import ask_llm

        answer = ask_llm(
            question,
            context
        )

        grounded = bool(context.strip())
        return {
            "query_type": query_type,
            "answer": answer,
            "grounded": grounded,
            "context_chunks": len(chunks),
            "has_context": grounded,
        }