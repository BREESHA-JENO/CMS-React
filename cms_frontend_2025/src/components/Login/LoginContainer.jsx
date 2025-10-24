import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginPage from "../../Pages/Login/LoginPage";
import { loginUser, forgotPasswordRequest } from "../../Service/loginapi";

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

  const handleLogin = async (e) => {
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

    try {
      const response = await loginUser(username, password);
      const data = response.data;
      setSuccessMsg("Login successful!");

      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));

      setTimeout(() => {
        const role = data.user.role;
        if (role === "ADMIN") navigate("/admin");
        else if (role === "DOC") navigate("/doctor");
        else if (role === "REC") navigate("/receptionist");
        else if (role === "LAB") navigate("/lab");
        else if (role === "PHARM") navigate("/pharmacist");
        else if (role === "AMB") navigate("/ambulance");
        else navigate("/");
      }, 1000);
    } catch (error) {
      if (error.response) {
        const msg = error.response.data.error || "Login failed";
        if (msg.toLowerCase().includes("username")) setUsernameError(msg);
        else setPasswordError(msg);
      } else {
        setPasswordError("Network error");
      }
    }
  };

  const handleForgotPassword = async (e) => {
  e.preventDefault();
  if (!fpEmail.trim()) {
    setFpMessage("Please enter your username/email.");
    return;
  }
  try {
    const res = await forgotPasswordRequest(fpEmail); // Use fpEmail here!
    setFpMessage(res.data.message || "Request sent to admin.");
  } catch {
    setFpMessage("Error sending request.");
  }
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
