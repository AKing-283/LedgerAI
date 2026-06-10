import streamlit as st

from utils.api import ask_question

st.title("Chat With Documents")

question = st.text_input(
    "Ask a question"
)

if st.button("Ask"):

    result = ask_question(
        question
    )

    st.write(
        f"Query Type: {result['query_type']}"
    )

    st.success(
        result["answer"]
    )