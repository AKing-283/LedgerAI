import token

import streamlit as st
import pandas as pd

from utils.api import get_documents
if "token" not in st.session_state:

    st.error(
        "Please login first"
    )

    st.stop()
st.title("AI Accountant Copilot")

token = st.session_state.get("token")
docs = get_documents(token=token)

if not docs:
    st.warning("No documents uploaded")
    st.stop()

df = pd.DataFrame(docs)

# --------------------
# KPIs
# --------------------

col1, col2, col3 = st.columns(3)

col1.metric(
    "Documents",
    len(df)
)

col2.metric(
    "Invoice Value",
    f"₹{df['amount'].sum():,.2f}"
)

col3.metric(
    "Vendors",
    df["vendor"].nunique()
)

st.divider()

# --------------------
# Vendor Summary
# --------------------

st.subheader("Vendor Summary")

vendor_df = (
    df.groupby("vendor")["amount"]
    .sum()
    .reset_index()
)

st.bar_chart(
    vendor_df.set_index("vendor")
)

# --------------------
# Invoice Trend
# --------------------

st.subheader("Invoice Trend")

df["invoice_date"] = pd.to_datetime(
    df["invoice_date"],
    errors="coerce"
)

trend = (
    df.groupby(
        df["invoice_date"].dt.year
    )["amount"]
    .sum()
)

st.line_chart(trend)

# --------------------
# Recent Documents
# --------------------

st.subheader("Recent Documents")

st.dataframe(
    df,
    width="stretch"
)