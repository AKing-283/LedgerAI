import { useEffect, useState } from "react";
import { decodeToken } from "../services/api";
import { FiUser, FiMail, FiBriefcase } from "react-icons/fi";

function Profile() {
  const [user, setUser] = useState({
    email: "N/A",
    organization_name: "N/A",
  });

  useEffect(() => {
    const decoded = decodeToken();
    if (decoded) {
      setUser({
        email: decoded.email || "N/A",
        organization_name: decoded.organization_name || "N/A",
      });
    }
  }, []);

  return (
    <div>
      <div
        className="glass-card"
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            {user.organization_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1
              className="gradient-text"
              style={{
                fontSize: "24px",
                fontWeight: 700,
              }}
            >
              Profile
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "14px",
                marginTop: "4px",
              }}
            >
              Your account details
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "16px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <FiBriefcase size={20} style={{ color: "#818cf8", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
                Organization
              </div>
              <div style={{ fontSize: "15px", fontWeight: 500, color: "#ffffff" }}>
                {user.organization_name}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "16px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <FiMail size={20} style={{ color: "#818cf8", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
                Email
              </div>
              <div style={{ fontSize: "15px", fontWeight: 500, color: "#ffffff" }}>
                {user.email}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "16px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <FiUser size={20} style={{ color: "#818cf8", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
                Role
              </div>
              <div style={{ fontSize: "15px", fontWeight: 500, color: "#ffffff" }}>
                Organization Member
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;