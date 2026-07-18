function Billing() {
  return (
    <div>
      <div
        className="glass-card"
        style={{
          padding: "30px",
        }}
      >
        <h1
          className="gradient-text"
          style={{
            fontSize: "24px",
            fontWeight: 700,
            marginBottom: "24px",
          }}
        >
          Pricing Plans
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(280px,1fr))",
            gap: "20px",
          }}
        >

          <div
            className="glass-card"
            style={{
              padding: "30px",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#ffffff",
                marginBottom: "12px",
              }}
            >
              Free
            </h2>

            <h1
              style={{
                fontSize: "36px",
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: "20px",
              }}
            >
              ₹0
            </h1>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                color: "rgba(255,255,255,0.7)",
                fontSize: "14px",
                lineHeight: 2,
              }}
            >
              <li>✓ 100 Documents</li>
              <li>✓ Basic AI Chat</li>
            </ul>
          </div>

          <div
            className="glass-card"
            style={{
              padding: "30px",
              border: "2px solid #6366f1",
              position: "relative",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#ffffff",
                marginBottom: "12px",
              }}
            >
              Pro
            </h2>

            <h1
              style={{
                fontSize: "36px",
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: "20px",
              }}
            >
              ₹999/mo
            </h1>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                color: "rgba(255,255,255,0.7)",
                fontSize: "14px",
                lineHeight: 2,
              }}
            >
              <li>✓ Unlimited Docs</li>
              <li>✓ Advanced AI</li>
              <li>✓ GST Analytics</li>
              <li>✓ Vendor Reports</li>
            </ul>

            <button
              className="btn-primary"
              style={{
                marginTop: "20px",
                width: "100%",
                padding: "12px",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              Upgrade
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Billing;
