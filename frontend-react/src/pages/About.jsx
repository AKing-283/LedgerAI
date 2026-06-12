import { FiShield, FiTrendingUp, FiFileText } from "react-icons/fi";

function About() {
  return (
    <div className="page-container">
      <div
        className="glass"
        style={{
          maxWidth: "900px",
          margin: "auto",
          padding: "40px",
          borderRadius: "24px"
        }}
      >
        <h1 style={{ marginBottom: "10px" }}>
          About AI Accountant Copilot
        </h1>

        <p style={{ opacity: 0.7, marginBottom: "30px" }}>
          A modern accounting intelligence platform designed for finance teams,
          chartered accountants, and growing businesses.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px"
          }}
        >
          <div className="glass" style={{ padding: "20px", borderRadius: "18px" }}>
            <FiFileText size={28} style={{ marginBottom: "10px" }} />
            <h3>Smart Document Processing</h3>
            <p style={{ opacity: 0.7 }}>
              Automatically extract vendor, invoice number, GST data and amounts
              from uploaded financial documents.
            </p>
          </div>

          <div className="glass" style={{ padding: "20px", borderRadius: "18px" }}>
            <FiTrendingUp size={28} style={{ marginBottom: "10px" }} />
            <h3>Real-Time Insights</h3>
            <p style={{ opacity: 0.7 }}>
              Get live dashboard metrics, expense summaries and financial
              performance indicators.
            </p>
          </div>

          <div className="glass" style={{ padding: "20px", borderRadius: "18px" }}>
            <FiShield size={28} style={{ marginBottom: "10px" }} />
            <h3>Secure & Isolated</h3>
            <p style={{ opacity: 0.7 }}>
              Organization-level data isolation with JWT-based authentication
              and secure storage.
            </p>
          </div>
        </div>

        <div style={{ marginTop: "40px", opacity: 0.6 }}>
          <p>
            Built for accountants who value clarity, compliance, and control.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;