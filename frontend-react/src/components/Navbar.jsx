import { FiBell, FiUser } from "react-icons/fi";

function Navbar({ collapsed }) {
  const email = localStorage.getItem("user_email") || "User";
  const organization = localStorage.getItem("organization_name") || "Organization";

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
          style={{
            position: "relative",
            cursor: "pointer"
          }}
        >
          <FiBell size={20} />
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#22c55e"
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "rgba(255,255,255,0.05)",
            padding: "8px 14px",
            borderRadius: "14px",
            border: "1px solid rgba(255,255,255,0.08)"
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