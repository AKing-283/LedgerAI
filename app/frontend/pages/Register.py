import streamlit as st

from utils.api import register

st.title("Register")

organization = st.text_input(
    "Organization Name"
)

email = st.text_input(
    "Email"
)

password = st.text_input(
    "Password",
    type="password"
)

if st.button("Register"):

    result = register(
        organization,
        email,
        password
    )

    if "token" in result:

        st.success(
            "Registration Successful"
        )

    else:

        st.error(
            result.get(
                "detail",
                "Registration Failed"
            )
        )