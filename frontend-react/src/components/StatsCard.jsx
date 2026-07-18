function StatCard({
  title,
  value,
  icon
}) {
  return (
    <div
      className="glass-card"
      style={{
        padding: "25px",
        minHeight: "140px"
      }}
    >
      <h3
        style={{
          color: "rgba(255,255,255,0.6)",
          fontSize: "14px",
          fontWeight: 500,
          marginBottom: "12px"
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          fontSize: "28px",
          fontWeight: 700,
          color: "#ffffff"
        }}
      >
        {value}
      </h1>

      <div
        style={{
          fontSize: "32px",
          marginTop: "12px",
          opacity: 0.5
        }}
      >
        {icon}
      </div>
    </div>
  );
}

export default StatCard;