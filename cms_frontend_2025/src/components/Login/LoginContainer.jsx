import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginPage from "../../Pages/Login/LoginPage";

function LoginContainer() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [showForgot, setShowForgot] = useState(false);
  const [fpEmail, setFpEmail] = useState("");
  const [fpMessage, setFpMessage] = useState("");

  const navigate = useNavigate();

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    setUsernameError("");
    setPasswordError("");
    setSuccessMsg("");

    if (!username.trim()) {
      setUsernameError("Please enter username");
      return;
    }

    if (!password.trim()) {
      setPasswordError("Please enter password");
      return;
    }

    const storedUser = localStorage.getItem("staff_" + username);
    if (!storedUser) {
      setUsernameError("User not found");
      return;
    }

    const parsed = JSON.parse(storedUser);
    if (parsed.password !== password) {
      setPasswordError("Incorrect password");
      return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(parsed));
    setSuccessMsg("Login successful!");
    setTimeout(() => {
      if (parsed.role === "Admin") navigate("/admin");
      else if (parsed.role === "Doctor") navigate("/doctor");
      else navigate("/");
    }, 1000);
  };

  // Handle forgot password
  const handleForgotPassword = (e) => {
    e.preventDefault();

    if (!fpEmail.trim()) {
      setFpMessage("Please enter your email.");
      return;
    }

    const staff = localStorage.getItem("staff_" + fpEmail);
    if (!staff) {
      setFpMessage("Email not found.");
      return;
    }

    const requestKey = "request_" + fpEmail;
    const date = new Date().toLocaleString();
    const request = {
      email: fpEmail,
      type: "ForgotPassword",
      date,
      status: "pending",
    };

    localStorage.setItem(requestKey, JSON.stringify(request));
    setFpMessage("Request sent to admin.");
  };

  return (
    <LoginPage
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      usernameError={usernameError}
      passwordError={passwordError}
      successMsg={successMsg}
      handleLogin={handleLogin}
      showForgot={showForgot}
      setShowForgot={setShowForgot}
      fpEmail={fpEmail}
      setFpEmail={setFpEmail}
      fpMessage={fpMessage}
      handleForgotPassword={handleForgotPassword}
    />
  );
}

export default LoginContainer;
