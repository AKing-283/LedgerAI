import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async () => {
    setError("");
    setSuccess("");

    // Validation
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.access_token) {
        localStorage.setItem("token", result.access_token);
        if (result.organization_id) {
          localStorage.setItem("organization_id", result.organization_id);
        }
        if (result.organization_name) {
          localStorage.setItem("organization_name", result.organization_name);
        }

        setSuccess("Login successful! Redirecting...");

        setTimeout(() => {
          navigate("/dashboard");
        }, 800);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        setError(error.response.data.detail);
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "40px",
        }}
      >
        {/* Logo / Title */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 className="gradient-text" style={{ fontSize: "28px", fontWeight: 700 }}>
            LedgerAI
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", marginTop: "8px", fontSize: "14px" }}>
            Sign in to your account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "12px",
              padding: "12px 16px",
              marginBottom: "20px",
              color: "#fca5a5",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div
            style={{
              background: "rgba(34, 197, 94, 0.15)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              borderRadius: "12px",
              padding: "12px 16px",
              marginBottom: "20px",
              color: "#86efac",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {success}
          </div>
        )}

        {/* Email */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              color: "rgba(255,255,255,0.6)",
              marginBottom: "6px",
              fontWeight: 500,
            }}
          >
            Email
          </label>
          <input
            className="input-field"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              color: "rgba(255,255,255,0.6)",
              marginBottom: "6px",
              fontWeight: 500,
            }}
          >
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              className="input-field"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              style={{ paddingRight: "44px" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(255,255,255,0.4)",
                fontSize: "14px",
                padding: "4px",
              }}
              tabIndex={-1}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          className="btn-primary"
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "15px",
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {loading ? (
            <>
              <span
                style={{
                  display: "inline-block",
                  width: "18px",
                  height: "18px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                  animation: "spin 0.6s linear infinite",
                }}
              />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>

        {/* Forgot Password */}
        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <Link
            to="/forgot-password"
            style={{
              color: "rgba(255,255,255,0.4)",
              cursor: "pointer",
              fontSize: "13px",
              textDecoration: "underline",
            }}
          >
            Forgot password?
          </Link>
        </div>

        {/* Register Link */}
        <p
          style={{
            textAlign: "center",
            marginTop: "24px",
            color: "rgba(255,255,255,0.5)",
            fontSize: "14px",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#818cf8",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;