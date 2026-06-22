import re
import json

from app.services.groq_service import ask_llm


def extract_gst(text: str):

    gst_pattern = (
        r"\d{2}[A-Z]{5}\d{4}[A-Z]"
        r"[A-Z0-9][Z][A-Z0-9]"
    )

    matches = re.findall(
        gst_pattern,
        text.upper()
    )

    print("\nGST REGEX MATCHES:")
    print(matches)

    if matches:
        return matches[0]

    return ""

def extract_metadata(text: str):

    extracted_gst = extract_gst(text)

    prompt = f"""
You are an expert invoice data extraction engine.

Extract metadata from the invoice.

IMPORTANT RULES:

1. Vendor = Supplier / Seller / Company issuing invoice.
2. Invoice Number = Invoice No / Tax Invoice No / Invoice #.
3. GST Number may appear as:

   - GSTIN
   - GST No
   - GST Registration No
   - GST Registration Number
   - Supplier GSTIN
   - Seller GSTIN
   - Vendor GSTIN

4. If ANY GST number exists in the document,
   NEVER return:
   - "Not Available"
   - "N/A"
   - ""
   - null

5. Extract the GST number exactly.

6. GST format is usually:

   29AAGCR4375J1ZS
   27ABCDE1234F1Z5

7. Amount must be TOTAL invoice amount.

8. Date must be invoice date.

9. Return JSON ONLY.

Document:

{text[:15000]}

Return exactly:

{{
    "vendor": "",
    "invoice_number": "",
    "gst_number": "",
    "amount": 0,
    "date": ""
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

        metadata = json.loads(response)

        # Override GST if regex found one
        if extracted_gst:

            metadata["gst_number"] = extracted_gst

        return metadata

    except Exception as e:

        print(
            "METADATA ERROR:",
            str(e)
        )

        return {
            "vendor": "",
            "invoice_number": "",
            "gst_number": extracted_gst,
            "amount": 0,
            "date": ""
        }