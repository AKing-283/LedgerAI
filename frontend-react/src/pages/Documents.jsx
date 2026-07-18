import { useEffect, useState } from "react";
import { getDocuments } from "../services/api";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docs = await getDocuments();
        setDocuments(docs || []);
      } catch (error) {
        console.error("Failed to fetch documents");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div
        className="glass-card"
        style={{
          padding: "32px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h1
            className="gradient-text"
            style={{
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            Documents
          </h1>
          <span
            style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.5)",
              padding: "6px 14px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {documents.length} total
          </span>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Filename</th>
                <th>Vendor</th>
                <th>Invoice #</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ padding: "24px", textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
                    Loading documents...
                  </td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: "24px", textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
                    No documents uploaded yet. Go to Upload to add documents.
                  </td>
                </tr>
              ) : (
                documents
                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                  .map((doc) => (
                    <tr key={doc.id}>
                      <td style={{ color: "rgba(255,255,255,0.8)" }}>{doc.filename || "-"}</td>
                      <td style={{ color: "rgba(255,255,255,0.8)" }}>{doc.vendor || "-"}</td>
                      <td style={{ color: "rgba(255,255,255,0.8)" }}>{doc.invoice_number || "-"}</td>
                      <td style={{ color: "rgba(255,255,255,0.8)" }}>₹{Number(doc.amount || 0).toLocaleString()}</td>
                      <td style={{ color: "rgba(255,255,255,0.5)" }}>
                        {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : "-"}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Documents;