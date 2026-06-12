import { useEffect, useState } from "react";
import { decodeToken } from "../services/api";

function Profile() {

  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");

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
  }, []);

  return (
    <div className="page-container">
      <div
        className="glass"
        style={{
          maxWidth: "700px",
          margin: "auto",
          padding: "30px",
          borderRadius: "20px"
        }}
      >
        <h1>
          Profile
        </h1>

        <br />

        <p>
          <strong>Email:</strong> {email || "Not Available"}
        </p>

        <p>
          <strong>Organization:</strong> {organization || "Not Available"}
        </p>

        <p>
          Plan:
          Free
        </p>

      </div>

    </div>
  );
}

export default Profile;