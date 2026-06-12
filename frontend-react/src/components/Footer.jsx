function Footer() {
  return (
    <div
      style={{
        marginTop: "40px",
        padding: "20px 30px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "13px",
        opacity: 0.7
      }}
    >
      <div>
        © {new Date().getFullYear()} LedgerAI
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <span>Secure • Compliant • Accountant Friendly</span>
      </div>
    </div>
  );
}

export default Footer;