function StatCard({
  title,
  value,
  icon
}) {
  return (
    <div
      className="glass"
      style={{
        padding: "25px",
        borderRadius: "20px",
        minHeight: "140px"
      }}
    >
      <h3
        style={{
          opacity: 0.7,
          marginBottom: "15px"
        }}
      >
        {title}
      </h3>

      <h1>{value}</h1>

      <div
        style={{
          fontSize: "40px",
          marginTop: "10px"
        }}
      >
        {icon}
      </div>
    </div>
  );
}

export default StatCard;