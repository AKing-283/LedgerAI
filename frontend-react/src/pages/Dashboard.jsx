import { useEffect, useState } from "react";
import StatCard from "../components/StatsCard";
import { getDocuments } from "../services/api";

function Dashboard() {

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [organizationName, setOrganizationName] = useState("");

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

    const org = localStorage.getItem("organization_name");
    if (org) {
      setOrganizationName(org);
    }
  }, []);

  const totalDocuments = documents.length;

  const uniqueVendors = [
    ...new Set(documents.map((doc) => doc.vendor).filter(Boolean))
  ].length;

  const totalAmount = documents.reduce((sum, doc) => {
    return sum + (Number(doc.amount) || 0);
  }, 0);

  return (
    <div style={{ padding: "24px", background: "#ffffff", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px"
        }}
      >
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#111827", margin: 0 }}>
            Welcome Back 👋
          </h1>
          <p style={{ color: "#6b7280", marginTop: "6px", fontSize: "14px" }}>
            {organizationName || "Your Organization"} &bull; Real-time Accounting Overview
          </p>
        </div>

        <button
          style={{
            padding: "10px 20px",
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
            background: "#ffffff",
            color: "#374151",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
          }}
        >
          Upgrade Pro
        </button>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
          marginBottom: "24px"
        }}
      >
        <StatCard
          title="Total Documents"
          value={loading ? "..." : totalDocuments}
          icon="📄"
        />

        <StatCard
          title="Vendors"
          value={loading ? "..." : uniqueVendors}
          icon="🏢"
        />

        <StatCard
          title="Total Invoice Amount"
          value={loading ? "..." : `₹${totalAmount.toLocaleString()}`}
          icon="💰"
        />
      </div>

      {/* AI Insights */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "14px",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          marginBottom: "24px"
        }}
      >
        <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#111827", margin: 0 }}>
          AI Insights
        </h2>
        <ul style={{ marginTop: "20px", lineHeight: "2.2", color: "#374151", fontSize: "14px", paddingLeft: "18px" }}>
          <li>Total Spend: ₹{totalAmount.toLocaleString()}</li>
          <li>
            Top Vendor: {uniqueVendors > 0
              ? [...new Set(documents.map(d => d.vendor).filter(Boolean))][0]
              : "-"}
          </li>
          <li>Documents Processed: {totalDocuments}</li>
          <li>
            Average Invoice Value: ₹{totalDocuments > 0
              ? Math.round(totalAmount / totalDocuments).toLocaleString()
              : 0}
          </li>
        </ul>
      </div>

      {/* Recent Activity */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "14px",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
        }}
      >
        <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#111827", margin: 0 }}>
          Recent Activity
        </h2>

        <div style={{ marginTop: "16px", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ padding: "12px 16px", textAlign: "left", color: "#6b7280", fontWeight: 500, fontSize: "13px" }}>Filename</th>
                <th style={{ padding: "12px 16px", textAlign: "left", color: "#6b7280", fontWeight: 500, fontSize: "13px" }}>Vendor</th>
                <th style={{ padding: "12px 16px", textAlign: "left", color: "#6b7280", fontWeight: 500, fontSize: "13px" }}>Invoice</th>
                <th style={{ padding: "12px 16px", textAlign: "left", color: "#6b7280", fontWeight: 500, fontSize: "13px" }}>Amount</th>
                <th style={{ padding: "12px 16px", textAlign: "left", color: "#6b7280", fontWeight: 500, fontSize: "13px" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ padding: "16px", textAlign: "center", color: "#9ca3af" }}>Loading...</td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: "16px", textAlign: "center", color: "#9ca3af" }}>No documents found</td>
                </tr>
              ) : (
                documents
                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                  .slice(0, 5)
                  .map((doc) => (
                    <tr key={doc.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "12px 16px", color: "#374151" }}>{doc.filename || "-"}</td>
                      <td style={{ padding: "12px 16px", color: "#374151" }}>{doc.vendor || "-"}</td>
                      <td style={{ padding: "12px 16px", color: "#374151" }}>{doc.invoice_number || "-"}</td>
                      <td style={{ padding: "12px 16px", color: "#374151" }}>₹{Number(doc.amount || 0).toLocaleString()}</td>
                      <td style={{ padding: "12px 16px", color: "#6b7280" }}>
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

export default Dashboard;