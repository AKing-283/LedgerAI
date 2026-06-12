import Navbar from "../components/Navbar";

function Billing() {
  return (
    <div className="page-container">
      <Navbar/>  
      <div
        className="glass"
        style={{
          padding: "30px",
          borderRadius: "20px"
        }}
      >
        <h1>
          Pricing Plans
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(280px,1fr))",
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
            <h2>Free</h2>

            <h1>₹0</h1>

            <ul>
              <li>100 Documents</li>
              <li>Basic AI Chat</li>
            </ul>
          </div>

          <div
            className="glass"
            style={{
              padding: "25px",
              borderRadius: "20px",
              border:
                "2px solid #6366f1"
            }}
          >
            <h2>Pro</h2>

            <h1>₹999/mo</h1>

            <ul>
              <li>Unlimited Docs</li>
              <li>Advanced AI</li>
              <li>GST Analytics</li>
              <li>Vendor Reports</li>
            </ul>

            <button
              style={{
                marginTop: "15px",
                width: "100%",
                padding: "12px",
                background:
                  "#6366f1",
                border: "none",
                color: "white"
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