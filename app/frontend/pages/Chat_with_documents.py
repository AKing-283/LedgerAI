import streamlit as st

from utils.api import ask_question

st.title("Chat With Documents")

question = st.text_input(
    "Ask a question"
)

if st.button("Ask"):

    with st.spinner("Thinking..."):

        response = ask_question(
            question
        )

    st.success("Answer")

    st.write(
        response["answer"]
    )