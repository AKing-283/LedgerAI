import { useState } from "react";

import API from "../services/api";
import { register } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [organizationName,
         setOrganizationName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleRegister = async () => {
    try {
      await register(
        organizationName,
        email,
        password
      );    

      alert(
        "Registration Successful"
      );

      navigate("/");
    } catch {
      alert(
        "Registration Failed"
      );
    }
  };

  return (
    <div>
      <h1>Register</h1>

      <input
        placeholder="Organization"
        onChange={(e) =>
          setOrganizationName(
            e.target.value
          )
        }
      />

      <input
        placeholder="Email"
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button
        onClick={handleRegister}
      >
        Register
      </button>
    </div>
  );
}