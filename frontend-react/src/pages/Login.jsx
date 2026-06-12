import {
  useState
} from "react";

import {
  useNavigate,
  Link
} from "react-router-dom";

import {
  login
} from "../services/api";

function Login() {

  const navigate =
    useNavigate();

  const [email,
    setEmail] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const handleLogin =
    async () => {

      const result =
        await login(
          email,
          password
        );

      if (
        result.access_token
      ) {

        localStorage.setItem(
          "token",
          result.access_token
        );

        localStorage.setItem(
          "organization_id",
          result.organization_id
        );

        navigate(
          "/dashboard"
        );
      }
    };

  return (
    <div
      style={{
        display: "flex",
        justifyContent:
          "center",
        alignItems:
          "center",
        height: "100vh"
      }}
    >
      <div
        className="glass"
        style={{
          width: "400px",
          padding: "40px",
          borderRadius:
            "25px"
        }}
      >
        <h1
          className="gradient-text"
        >
          LedgerMind AI
        </h1>

        <input
          placeholder="Email"
          onChange={(e)=>
            setEmail(
              e.target.value
            )
          }
          style={{
            width:"100%",
            marginTop:"20px",
            padding:"12px"
          }}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e)=>
            setPassword(
              e.target.value
            )
          }
          style={{
            width:"100%",
            marginTop:"15px",
            padding:"12px"
          }}
        />

        <button
          onClick={
            handleLogin
          }
          style={{
            width:"100%",
            marginTop:"20px",
            padding:"12px",
            background:
              "#6366f1",
            border:"none",
            color:"white"
          }}
        >
          Login
        </button>

        <p
          style={{
            marginTop:"15px"
          }}
        >
          No account?
          <Link
            to="/register"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;