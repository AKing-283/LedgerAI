import { NavLink, useNavigate } from "react-router-dom";
import { FiHome, FiUpload, FiFileText, FiMessageSquare, FiSettings, FiLogOut, FiMenu } from "react-icons/fi";

export default function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("organization_id");
    navigate("/");
  };

  const linkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "14px",
    background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
    color: isActive ? "#ffffff" : "rgba(255,255,255,0.7)",
    transition: "all 0.2s ease",
    fontWeight: 500
  });

  return (
    <div
      style={{
        width: collapsed ? "80px" : "260px",
        transition: "all 0.3s ease",
        background: "rgba(255,255,255,0.03)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            marginBottom: "40px"
          }}
        >
          {!collapsed && (
            <h2
              style={{
                fontWeight: 600,
                fontSize: "18px",
                letterSpacing: "0.5px"
              }}
            >
              LedgerAI
            </h2>
          )}

          <FiMenu
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => setCollapsed(!collapsed)}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}
        >
          <NavLink to="/dashboard" style={linkStyle}>
            <FiHome />
            {!collapsed && "Dashboard"}
          </NavLink>

          <NavLink to="/upload" style={linkStyle}>
            <FiUpload />
            {!collapsed && "Upload Documents"}
          </NavLink>

          <NavLink to="/documents" style={linkStyle}>
            <FiFileText />
            {!collapsed && "Documents"}
          </NavLink>

          <NavLink to="/chat" style={linkStyle}>
            <FiMessageSquare />
            {!collapsed && "AI Assistant"}
          </NavLink>

          <NavLink to="/settings" style={linkStyle}>
            <FiSettings />
            {!collapsed && "Settings"}
          </NavLink>
        </div>
      </div>

      <div>
        <button
          onClick={logout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            borderRadius: "14px",
            background: "rgba(239,68,68,0.15)",
            border: "1px solid rgba(239,68,68,0.4)",
            color: "#f87171",
            cursor: "pointer",
            fontWeight: 500
          }}
        >
          <FiLogOut />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );
}