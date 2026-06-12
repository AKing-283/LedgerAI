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
            key={doc.id}
            className="glass"
            style={{
              padding: "20px",
              borderRadius: "16px"
            }}
          >
            <h3>
              {doc.filename}
            </h3>

            <p>
              Vendor:
              {doc.vendor}
            </p>

            <p>
              Invoice:
              {doc.invoice_number}
            </p>

            <p>
              Amount:
              ₹{doc.amount}
            </p>
          </div>

        ))}
      </div>

    </div>
  );
}

export default Documents;