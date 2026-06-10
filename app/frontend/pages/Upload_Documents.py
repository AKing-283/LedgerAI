import streamlit as st

from utils.api import upload_document

st.title("Upload Documents")

uploaded_file = st.file_uploader(
    "Upload Invoice PDF",
    type=["pdf"]
)

if uploaded_file:

    if st.button("Upload"):

        with st.spinner("Uploading..."):

            result = upload_document(
                uploaded_file
            )

        st.success("Uploaded")

        st.json(result)