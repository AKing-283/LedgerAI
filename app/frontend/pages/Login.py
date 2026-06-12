import streamlit as st

from utils.api import login

st.title("AI Accountant Copilot")

st.subheader("Login")

email = st.text_input(
    "Email"
)

password = st.text_input(
    "Password",
    type="password"
)

if st.button("Login"):

    result = login(
        email,
        password
    )

    if "access_token" in result:

        st.session_state["token"] = result[
            "access_token"
        ]

        st.session_state["organization_id"] = result[
            "organization_id"
        ]

        st.success("Login Successful")

        st.rerun()

    else:

        st.error(
            result.get(
                "detail",
                "Login Failed"
            )
        )