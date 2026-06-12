import { FiBell, FiUser } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "../services/api";

function Navbar({ collapsed }) {

  const navigate = useNavigate();
  const [email, setEmail] = useState("User");
  const [organization, setOrganization] = useState("Organization");
  const [notifications, setNotifications] = useState(0);

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
    const storedNotifications = localStorage.getItem("notifications_count");
    if (storedNotifications) {
      setNotifications(Number(storedNotifications));
    }

    const handleStorage = () => {
      const updated = localStorage.getItem("notifications_count");
      setNotifications(Number(updated) || 0);
    };

    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <div
      style={{
        height: "70px",
        borderRadius: "20px",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
      }}
    >
      <div>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 600
          }}
        >
          {organization}
        </h3>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px"
        }}
      >
        <div
          onClick={() => navigate("/about")}
          style={{
            cursor: "pointer",
            fontSize: "14px",
            opacity: 0.8,
            padding: "6px 12px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.08)"
          }}
        >
          About
        </div>
        <div
          onClick={() => {
            localStorage.setItem("notifications_count", "0");
            setNotifications(0);
          }}
          style={{
            position: "relative",
            cursor: "pointer"
          }}
        >
          <FiBell size={20} />
          {notifications > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-6px",
                right: "-6px",
                minWidth: "18px",
                height: "18px",
                borderRadius: "50%",
                background: "#22c55e",
                color: "#000",
                fontSize: "11px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600
              }}
            >
              {notifications}
            </span>
          )}
        </div>

        <div
          onClick={() => navigate("/profile")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "rgba(255,255,255,0.05)",
            padding: "8px 14px",
            borderRadius: "14px",
            border: "1px solid rgba(255,255,255,0.08)",
            cursor: "pointer"
          }}
        >
          <FiUser />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: 1.2
            }}
          >
            <span
              style={{
                fontSize: "13px",
                opacity: 0.7
              }}
            >
              {email}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;