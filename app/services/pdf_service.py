import pdfplumber


def extract_text(pdf_path: str):

    pages_text = []

    with pdfplumber.open(pdf_path) as pdf:

        print(
            f"TOTAL PAGES: {len(pdf.pages)}"
        )

        for page_number, page in enumerate(pdf.pages):

            page_text = page.extract_text() or ""

            print(
                f"PAGE {page_number + 1}: "
                f"{len(page_text)} chars"
            )

            pages_text.append(
                f"\n\n===== PAGE {page_number + 1} =====\n\n"
            )

            pages_text.append(page_text)

    full_text = "".join(pages_text)

    print(
        "TOTAL TEXT LENGTH:",
        len(full_text)
    )

    return full_text