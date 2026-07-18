import { FiShield, FiTrendingUp, FiFileText } from "react-icons/fi";

function About() {
  return (
    <div>
      <div
        className="glass-card"
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "40px",
        }}
      >
        <h1
          className="gradient-text"
          style={{
            fontSize: "24px",
            fontWeight: 700,
            marginBottom: "12px",
          }}
        >
          About LedgerAI
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "14px",
            marginBottom: "32px",
            lineHeight: 1.6,
          }}
        >
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
          <div className="glass-card" style={{ padding: "24px", borderRadius: "18px" }}>
            <FiFileText size={24} style={{ marginBottom: "12px", color: "#818cf8" }} />
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#ffffff",
                marginBottom: "8px",
              }}
            >
              Smart Document Processing
            </h3>
            <p
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: "14px",
                lineHeight: 1.6,
              }}
            >
              Automatically extract vendor, invoice number, GST data and amounts
              from uploaded financial documents.
            </p>
          </div>

          <div className="glass-card" style={{ padding: "24px", borderRadius: "18px" }}>
            <FiTrendingUp size={24} style={{ marginBottom: "12px", color: "#818cf8" }} />
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#ffffff",
                marginBottom: "8px",
              }}
            >
              Real-Time Insights
            </h3>
            <p
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: "14px",
                lineHeight: 1.6,
              }}
            >
              Get live dashboard metrics, expense summaries and financial
              performance indicators.
            </p>
          </div>

          <div className="glass-card" style={{ padding: "24px", borderRadius: "18px" }}>
            <FiShield size={24} style={{ marginBottom: "12px", color: "#818cf8" }} />
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#ffffff",
                marginBottom: "8px",
              }}
            >
              Secure & Isolated
            </h3>
            <p
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: "14px",
                lineHeight: 1.6,
              }}
            >
              Organization-level data isolation with JWT-based authentication
              and secure storage.
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: "36px",
            color: "rgba(255,255,255,0.4)",
            fontSize: "14px",
          }}
        >
          <p>
            Built for accountants who value clarity, compliance, and control.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
