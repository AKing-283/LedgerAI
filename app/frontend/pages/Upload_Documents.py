import streamlit as st

from utils.api import upload_document

st.title("Upload Invoice")

file = st.file_uploader(
    "Choose PDF",
    type=["pdf"]
)

if file:

    if st.button("Upload"):

        result = upload_document(file)
        if "error" in result:

            st.error(result["error"])

        else:

            st.success("Uploaded Successfully")

            st.json(result)