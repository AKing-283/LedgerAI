import { useState } from "react";
import { uploadDocument } from "../services/api";

function Upload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const result = await uploadDocument(file);
      setMessage(`✅ Uploaded successfully: ${result.filename || file.name}`);
      setFile(null);
    } catch (error) {
      setMessage("❌ Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

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
        <h1
          className="gradient-text"
          style={{
            fontSize: "24px",
            fontWeight: 700,
            marginBottom: "12px",
          }}
        >
          Upload Documents
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "14px",
            marginBottom: "28px",
            lineHeight: 1.6,
          }}
        >
          Upload invoices, receipts, or any financial documents for AI-powered processing and extraction.
        </p>

        <div
          style={{
            border: "2px dashed rgba(255,255,255,0.15)",
            borderRadius: "18px",
            padding: "48px 24px",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
            background: "rgba(255,255,255,0.02)",
            marginBottom: "20px",
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.style.borderColor = "#6366f1";
            e.currentTarget.style.background = "rgba(99,102,241,0.08)";
          }}
          onDragLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
            e.currentTarget.style.background = "rgba(255,255,255,0.02)";
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
            e.currentTarget.style.background = "rgba(255,255,255,0.02)";
            if (e.dataTransfer.files.length > 0) {
              setFile(e.dataTransfer.files[0]);
            }
          }}
        >
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png,.xlsx,.csv"
          />
          <label
            htmlFor="fileInput"
            style={{ cursor: "pointer", display: "block" }}
          >
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>📄</div>
            <p style={{ color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>
              {file ? file.name : "Click or drag file to upload"}
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "13px",
                marginTop: "8px",
              }}
            >
              Supports PDF, JPG, PNG, XLSX, CSV
            </p>
          </label>
        </div>

        {file && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              borderRadius: "12px",
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.3)",
              marginBottom: "20px",
            }}
          >
            <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>
              {file.name}
            </span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
              {(file.size / 1024).toFixed(1)} KB
            </span>
          </div>
        )}

        <button
          className="btn-primary"
          onClick={handleUpload}
          disabled={uploading || !file}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "15px",
            fontWeight: 600,
            opacity: uploading || !file ? 0.6 : 1,
            cursor: uploading || !file ? "not-allowed" : "pointer",
          }}
        >
          {uploading ? "Uploading..." : "Upload Document"}
        </button>

        {message && (
          <div
            style={{
              marginTop: "16px",
              padding: "12px",
              borderRadius: "12px",
              background: message.startsWith("✅")
                ? "rgba(34,197,94,0.1)"
                : "rgba(239,68,68,0.1)",
              border: `1px solid ${message.startsWith("✅") ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
              color: message.startsWith("✅")
                ? "rgba(255,255,255,0.8)"
                : "rgba(255,255,255,0.8)",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default Upload;