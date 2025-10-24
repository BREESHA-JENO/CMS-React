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
  isLoading, // Optional: Add loading prop for professional feel
}) {
  return (
    <div className="login-center-wrapper">
      <div className="login-container">
        {/* Optional Logo Placeholder - Replace with actual logo if available */}
        <div className="login-logo-placeholder">
          <span className="logo-text">HealthIs</span>
        </div>

        <h2>Login to Your Account</h2>

        {!showForgot ? (
          <form onSubmit={handleLogin} className="login-form" noValidate>
            {successMsg && (
              <div className="success-message" role="alert" aria-live="polite">
                {successMsg}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username" className="sr-only">
                Username or Email
              </label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="username"
                  value={username}
                  placeholder="Username or Email"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  aria-describedby={usernameError ? "username-error" : undefined}
                  disabled={isLoading}
                />
                {usernameError && (
                  <span id="username-error" className="error-message" role="alert">
                    {usernameError}
                  </span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="input-wrapper">
                <input
                  type="password"
                  id="password"
                  value={password}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-describedby={passwordError ? "password-error" : undefined}
                  disabled={isLoading}
                />
                {passwordError && (
                  <span id="password-error" className="error-message" role="alert">
                    {passwordError}
                  </span>
                )}
              </div>
            </div>

            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        ) : (
          <section className="forgot-password-section">
            <h3>Forgot Your Password?</h3>
            <p className="forgot-subtitle">
              Enter your registered email to receive a reset link.
            </p>
            <form onSubmit={handleForgotPassword} className="forgot-form" noValidate>
              <div className="form-group">
                <label htmlFor="fpEmail">Username or Email</label>
                <input
                  type="text"
                  id="fpEmail"
                  value={fpEmail}
                  placeholder="Enter your username or email"
                  onChange={(e) => setFpEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <button type="submit" className="submit-button" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Sending...
                  </>
                ) : (
                  "Request Reset Link"
                )}
              </button>
              <button
                type="button"
                className="back-button"
                onClick={() => setShowForgot(false)}
                disabled={isLoading}
              >
                Back to Sign In
              </button>
              {fpMessage && (
                <p className="fp-message" role="alert">
                  {fpMessage}
                </p>
              )}
            </form>
          </section>
        )}

        {!showForgot && (
          <div className="forgot-link-wrapper">
            <button
              type="button"
              className="forgot-password-link"
              onClick={() => setShowForgot(true)}
            >
              Forgot Password?
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;