import { useEffect, useState } from "react";
import StatCard from "../components/StatsCard";
import ExpenseChart from "../components/ExpenseChart";
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

  // Latest Upload removed as requested

  return (
    <div className="page-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px"
        }}
      >
        <div>
          <h1 className="gradient-text">
            Welcome Back 👋
          </h1>

          <p
            style={{
              opacity: 0.7,
              marginTop: "8px"
            }}
          >
            {organizationName || "Your Organization"} • Real-time Accounting Overview
          </p>
        </div>

        <button
          style={{
            padding: "12px 20px",
            borderRadius: "12px",
            border: "none",
            background: "#6366f1",
            color: "white",
            cursor: "pointer"
          }}
        >
          Upgrade Pro 🚀
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px"
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "2fr 1fr",
          gap: "20px",
          marginTop: "25px"
        }}
      >

        <div
          className="glass"
          style={{
            padding: "25px",
            borderRadius: "20px"
          }}
        >
          <h2>
            Monthly Expense Trend
          </h2>

          <div
            style={{
              height: "250px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.6
            }}
          >
            <ExpenseChart />
          </div>
        </div>

        <div
          className="glass"
          style={{
            padding: "25px",
            borderRadius: "20px"
          }}
        >
          <h2>
            AI Insights
          </h2>

          <ul
            style={{
              marginTop: "20px",
              lineHeight: "2"
            }}
          >
            <li>
              Total Spend: ₹{totalAmount.toLocaleString()}
            </li>

            <li>
              Top Vendor: {uniqueVendors > 0 
                ? [...new Set(documents.map(d => d.vendor).filter(Boolean))][0] 
                : "-"}
            </li>

            <li>
              Documents Processed: {totalDocuments}
            </li>

            <li>
              Average Invoice Value: ₹{totalDocuments > 0 
                ? Math.round(totalAmount / totalDocuments).toLocaleString() 
                : 0}
            </li>
          </ul>
        </div>

      </div>

      <div
        className="glass"
        style={{
          marginTop: "25px",
          padding: "25px",
          borderRadius: "20px"
        }}
      >
        <h2>
          Recent Activity
        </h2>

        <div className="table-container" style={{ marginTop: "20px" }}>
          <table>
            <thead>
              <tr>
                <th>Filename</th>
                <th>Vendor</th>
                <th>Invoice</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5">Loading...</td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan="5">No documents found</td>
                </tr>
              ) : (
                documents
                  .sort((a, b) =>
                    new Date(b.created_at) - new Date(a.created_at)
                  )
                  .slice(0, 5)
                  .map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.filename || "-"}</td>
                    <td>{doc.vendor || "-"}</td>
                    <td>{doc.invoice_number || "-"}</td>
                    <td>
                      ₹{Number(doc.amount || 0).toLocaleString()}
                    </td>
                    <td>
                      {doc.created_at
                        ? new Date(doc.created_at).toLocaleDateString()
                        : "-"}
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