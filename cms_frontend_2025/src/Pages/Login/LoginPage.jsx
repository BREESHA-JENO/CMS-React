import React from "react";
import "../Login/Login.css";

function LoginPage({
  username,
  setUsername,
  password,
  setPassword,
  usernameError,
  passwordError,
  successMsg,
  handleLogin,
  showForgot,
  setShowForgot,
  fpEmail,
  setFpEmail,
  fpMessage,
  handleForgotPassword,
}) {
  return (
    <div className="login-container">
      <h2>Login to HealthIs</h2>

      {!showForgot ? (
        <form onSubmit={handleLogin}>
          <span id="success" style={{ color: "#0a775f" }}>
            {successMsg}
          </span>

          <label htmlFor="username">Username:</label>
          <input
            type="email"
            id="username"
            value={username}
            placeholder="Enter Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <span style={{ color: "red" }}>{usernameError}</span>

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span style={{ color: "red" }}>{passwordError}</span>

          <button type="submit">Login</button>
        </form>
      ) : (
        <section id="forgot-password-form">
          <h3>Forgot Password</h3>
          <form onSubmit={handleForgotPassword}>
            <label htmlFor="fpEmail">Enter your registered email:</label>
            <input
              type="email"
              id="fpEmail"
              value={fpEmail}
              onChange={(e) => setFpEmail(e.target.value)}
              required
            />
            <button type="submit">Request Password Reset</button>
            <button type="button" onClick={() => setShowForgot(false)}>
              Back to Login
            </button>
            <p id="fpMessage">{fpMessage}</p>
          </form>
        </section>
      )}

      {!showForgot && (
        <a href="#" className="forgot-password" onClick={() => setShowForgot(true)}>
          Forgot Password?
        </a>
      )}
    </div>
  );
}

export default LoginPage;
