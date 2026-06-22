import {
  useEffect,
  useState
} from "react";

import Navbar from "../components/Navbar";

import {
  getDocuments
} from "../services/api";

function Documents() {

  const [docs, setDocs] =
    useState([]);

  useEffect(() => {

    const load = async () => {

      const token =
        localStorage.getItem(
          "token"
        );

      const data =
        await getDocuments(
          token
        );

      setDocs(data);
    };

    load();

  }, []);

  return (
    <div className="page-container">

      <h1
        className="gradient-text"
      >
        Documents
      </h1>

      <div
        style={{
          display: "grid",
          gap: "20px",
          marginTop: "25px"
        }}
      >
        {docs.map((doc) => (

          <div
          style={{
            marginTop: "12px"
          }}
        >

          <p>
            <strong>
              Vendor:
            </strong>
            {" "}
            {doc.vendor || "-"}
          </p>

          <p>
            <strong>
              Invoice No:
            </strong>
            {" "}
            {doc.invoice_number || "-"}
          </p>

          <p>
            <strong>
              GST Number:
            </strong>
            {doc.gst_number || "Not Available"}
          </p>

          <p>
            <strong>
              Invoice Date:
            </strong>
            {" "}
            {doc.invoice_date || "-"}
          </p>

          <p
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#22c55e"
            }}
          >
            Total Amount:
            {" "}
            ₹{
              Number(
                doc.amount || 0
              ).toLocaleString()
            }
          </p>

        </div>

        ))}
      </div>

    </div>
  );
}

export default Documents;