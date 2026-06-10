import json

from app.services.groq_service import llm


def extract_metadata(
    text: str
):

    prompt = f"""
Extract invoice information.

Return ONLY valid JSON.

{{
    "vendor":"",
    "invoice_number":"",
    "gst_number":"",
    "amount":0,
    "date":""
}}

Document:

{text[:4000]}
"""

    response = llm.invoke(
        prompt
    )

    try:
        return json.loads(
            response.content
        )

    except:

        return {
            "vendor": "",
            "invoice_number": "",
            "gst_number": "",
            "amount": 0,
            "date": ""
        }