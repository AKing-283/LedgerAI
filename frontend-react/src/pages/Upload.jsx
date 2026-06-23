import { useState } from "react";
import Navbar from "../components/Navbar";
import { uploadDocument } from "../services/api";

function Upload() {

  const [file, setFile] =
    useState(null);

  const upload = async () => {

    const token =
      localStorage.getItem("token");

    const result =
      await uploadDocument(
        file,
        token
      );

    // ✅ Trigger navbar refresh immediately
    window.dispatchEvent(
      new Event("notification-update")
    );

    alert(
      result.message ||
      "Uploaded"
    );
  };

  return (
    <div className="page-container">
      <div
        className="glass"
        style={{
          maxWidth: "700px",
          margin: "auto",
          padding: "40px",
          borderRadius: "20px"
        }}
      >
        <h2>
          Upload Invoice
        </h2>

        <input
          type="file"
          onChange={(e) =>
            setFile(
              e.target.files[0]
            )
          }
          style={{
            marginTop: "20px"
          }}
        />

        <button
          onClick={upload}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "none",
            background:
              "#6366f1",
            color: "white"
          }}
        >
          Upload
        </button>
      </div>

    </div>
  );
}

export default Upload;