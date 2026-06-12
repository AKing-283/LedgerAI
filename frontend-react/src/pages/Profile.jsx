import { useEffect, useState } from "react";
import { decodeToken } from "../services/api";

function Profile() {

  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");

  useEffect(() => {
    const decoded = decodeToken();

    if (decoded) {
      if (decoded.email) {
        setEmail(decoded.email);
      }

      if (decoded.organization_name) {
        setOrganization(decoded.organization_name);
      }
    }
  }, []);

  return (
    <div className="page-container">
      <div
        className="glass"
        style={{
          maxWidth: "800px",
          margin: "auto",
          padding: "40px",
          borderRadius: "24px"
        }}
      >
        <h1 style={{ marginBottom: "10px" }}>
          Account Overview
        </h1>

        <p style={{ opacity: 0.6, marginBottom: "30px" }}>
          Manage your accountant profile and organization details.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px"
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              padding: "20px",
              borderRadius: "18px",
              border: "1px solid rgba(255,255,255,0.08)"
            }}
          >
            <h4 style={{ marginBottom: "8px", opacity: 0.7 }}>
              Email Address
            </h4>
            <p style={{ fontSize: "16px" }}>
              {email || "Not Available"}
            </p>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              padding: "20px",
              borderRadius: "18px",
              border: "1px solid rgba(255,255,255,0.08)"
            }}
          >
            <h4 style={{ marginBottom: "8px", opacity: 0.7 }}>
              Organization
            </h4>
            <p style={{ fontSize: "16px" }}>
              {organization || "Not Available"}
            </p>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              padding: "20px",
              borderRadius: "18px",
              border: "1px solid rgba(255,255,255,0.08)"
            }}
          >
            <h4 style={{ marginBottom: "8px", opacity: 0.7 }}>
              Subscription Plan
            </h4>
            <p style={{ fontSize: "16px" }}>
              Free Tier
            </p>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              padding: "20px",
              borderRadius: "18px",
              border: "1px solid rgba(255,255,255,0.08)"
            }}
          >
            <h4 style={{ marginBottom: "8px", opacity: 0.7 }}>
              Account Status
            </h4>
            <p style={{ fontSize: "16px", color: "#22c55e" }}>
              Active
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Profile;