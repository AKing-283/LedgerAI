import json
import re

from app.services.groq_service import ask_llm


def extract_metadata(text: str):

    prompt = f"""
Extract invoice metadata.

Return ONLY valid JSON.

Document:

{text[:3000]}

Example:

{{
    "vendor":"ABC Pvt Ltd",
    "invoice_number":"INV001",
    "gst_number":"27ABCDE1234F1Z5",
    "amount":25000,
    "date":"2025-01-10"
}}
"""

    try:

        response = ask_llm(
            question=prompt,
            context=""
        )

        response = response.strip()

        response = re.sub(
            r"```json|```",
            "",
            response
        ).strip()

        return json.loads(response)

    except Exception as e:

        print("METADATA ERROR:", e)

        return {
            "vendor":"",
            "invoice_number":"",
            "gst_number":"",
            "amount":0,
            "date":""
        }