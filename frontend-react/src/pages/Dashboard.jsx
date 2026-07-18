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
    <div style={{ padding: "0" }}>
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
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#ffffff", margin: 0 }}>
            Welcome Back
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", marginTop: "6px", fontSize: "14px" }}>
            {organizationName || "Your Organization"} &bull; Real-time Accounting Overview
          </p>
        </div>

        <button
          style={{
            padding: "10px 20px",
            borderRadius: "14px",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.8)",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
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
        className="glass-card"
        style={{
          padding: "24px",
          marginBottom: "24px"
        }}
      >
        <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#ffffff", margin: 0 }}>
          AI Insights
        </h2>
        <ul style={{ marginTop: "20px", lineHeight: "2.2", color: "rgba(255,255,255,0.7)", fontSize: "14px", paddingLeft: "18px" }}>
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
        className="glass-card"
        style={{
          padding: "24px"
        }}
      >
        <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#ffffff", margin: 0 }}>
          Recent Activity
        </h2>

        <div style={{ marginTop: "16px", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <th style={{ padding: "12px 16px", textAlign: "left", color: "rgba(255,255,255,0.5)", fontWeight: 500, fontSize: "13px" }}>Filename</th>
                <th style={{ padding: "12px 16px", textAlign: "left", color: "rgba(255,255,255,0.5)", fontWeight: 500, fontSize: "13px" }}>Vendor</th>
                <th style={{ padding: "12px 16px", textAlign: "left", color: "rgba(255,255,255,0.5)", fontWeight: 500, fontSize: "13px" }}>Invoice</th>
                <th style={{ padding: "12px 16px", textAlign: "left", color: "rgba(255,255,255,0.5)", fontWeight: 500, fontSize: "13px" }}>Amount</th>
                <th style={{ padding: "12px 16px", textAlign: "left", color: "rgba(255,255,255,0.5)", fontWeight: 500, fontSize: "13px" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ padding: "16px", textAlign: "center", color: "rgba(255,255,255,0.4)" }}>Loading...</td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: "16px", textAlign: "center", color: "rgba(255,255,255,0.4)" }}>No documents found</td>
                </tr>
              ) : (
                documents
                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                  .slice(0, 5)
                  .map((doc) => (
                    <tr key={doc.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "12px 16px", color: "rgba(255,255,255,0.8)" }}>{doc.filename || "-"}</td>
                      <td style={{ padding: "12px 16px", color: "rgba(255,255,255,0.8)" }}>{doc.vendor || "-"}</td>
                      <td style={{ padding: "12px 16px", color: "rgba(255,255,255,0.8)" }}>{doc.invoice_number || "-"}</td>
                      <td style={{ padding: "12px 16px", color: "rgba(255,255,255,0.8)" }}>₹{Number(doc.amount || 0).toLocaleString()}</td>
                      <td style={{ padding: "12px 16px", color: "rgba(255,255,255,0.5)" }}>
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