function Settings() {
  return (
    <div className="glass-card" style={{ padding: "32px" }}>
      <h2 className="page-title">Settings</h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          maxWidth: "600px"
        }}
      >
        <div>
          <h4 style={{ marginBottom: "8px" }}>
            Organization Settings
          </h4>
          <p style={{ opacity: 0.6, fontSize: "14px" }}>
            Manage your organization details and preferences.
          </p>
        </div>

        <div>
          <h4 style={{ marginBottom: "8px" }}>
            User Preferences
          </h4>
          <p style={{ opacity: 0.6, fontSize: "14px" }}>
            Customize your experience.
          </p>
        </div>

        <div>
          <h4 style={{ marginBottom: "8px" }}>
            Security
          </h4>
          <p style={{ opacity: 0.6, fontSize: "14px" }}>
            Manage authentication and account security.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Settings;