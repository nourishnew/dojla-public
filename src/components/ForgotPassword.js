import React, { useRef, useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(false);

  async function handleResetPassword(e) {
    e.preventDefault();
    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage("Check you inbox for further isntructions");
    } catch {
      setError("Failed to reset password");
    }
    setLoading(false);
  }

  return (
    <div className="loginContainer" style={{ margin: "auto" }}>
      <div className="inputContainer">
        <p
          style={{
            fontFamily: "Akaya Kanadaka, cursive",
            fontSize: "50px",
            fontWeight: "500",
            color: "#feb009",
            marginBottom: "1em",
            textAlign: "center",
          }}
        >
          Dojla
        </p>
        <h2 style={{ textAlign: "center", fontFamily: "Fredoka One, cursive" }}>
          {" "}
          Reset Password
        </h2>
        <form onSubmit={handleResetPassword} className="verticalFlex">
          <input
            type="email"
            ref={emailRef}
            required
            placeholder="Email"
            className="loginInput"
          />
          <Button
            disabled={loading}
            type="submit"
            style={{
              width: "75%",
              margin: "auto",
              marginTop: "1em",
              backgroundColor: "#bd8d46",
            }}
          >
            Send
          </Button>
        </form>

        <div
          className="horizontal_flex"
          style={{ margin: "auto", marginTop: "1em", width: "fit-content" }}
        >
          <p
            style={{
              color: "black",
              marginRight: "15px",
              fontFamily: "Nunito, sans-serif",
            }}
          >
            Need an account ?
          </p>{" "}
          <Link to="/signup" style={{ textDecoration: "none" }}>
            <p style={{ color: "#efac35", fontFamily: "Nunito, sans-serif" }}>
              Sign up
            </p>
          </Link>
        </div>
        {error && <Alert variant="danger">{error}</Alert>}

        {message && <Alert variant="success">{message}</Alert>}
      </div>
    </div>
  );
}
