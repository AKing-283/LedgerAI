import streamlit as st
import pandas as pd

from utils.api import get_documents

st.title("Documents")

docs = get_documents()

if not docs:
    st.warning("No documents uploaded")
else:

    df = pd.DataFrame(docs)

    st.dataframe(
        df,
        width="stretch"
    )

    st.subheader("Uploaded Documents")

    for doc in docs:

        with st.expander(doc["filename"]):

            st.write(
                f"Vendor: {doc.get('vendor','')}"
            )

            st.write(
                f"Invoice Number: {doc.get('invoice_number','')}"
            )

            st.write(
                f"Amount: {doc.get('amount',0)}"
            )

            st.write(
                f"Date: {doc.get('invoice_date','')}"
            )