import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginPage from "../../Pages/Login/LoginPage";
import { loginUser, forgotPasswordRequest } from "../../Service/loginapi";
import { getMyStaffProfile } from "../../Service/admin_api";

function LoginContainer() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [fpEmail, setFpEmail] = useState("");
  const [fpMessage, setFpMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setUsernameError("");
    setPasswordError("");
    setSuccessMsg("");
    setIsLoading(true);

    if (!username.trim()) {
      setUsernameError("Please enter username");
      setIsLoading(false);
      return;
    }
    if (!password.trim()) {
      setPasswordError("Please enter password");
      setIsLoading(false);
      return;
    }

    try {
      const response = await loginUser(username, password);
      const data = response.data;
      setSuccessMsg("Login successful!");

      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);

      // --- Key session logic begins here ---
      // Fetch staff profile to get staff_id for this login
      try {
        const myStaffRes = await getMyStaffProfile();
        const staff = myStaffRes.data;
        // Build session user object with staff_id
        const userSession = {
          ...data.user,
          staff_id: staff.id,
          profile_image: staff.profile_image || "",
          staff_profile: staff,
        };
        localStorage.setItem("user", JSON.stringify(userSession));
      } catch (e) {
        // If profile fetch fails, fallback to basic user info
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      // --- Key session logic ends here ---

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
        const status = error.response.status;
        const errorData = error.response.data;

        if (status === 403 && errorData.error) {
          setPasswordError(errorData.error);
        } else {
          const msg = errorData.error || errorData.detail || "Login failed";
          if (
            msg.toLowerCase().includes("username") ||
            msg.toLowerCase().includes("email")
          ) {
            setUsernameError(msg);
          } else {
            setPasswordError(msg);
          }
        }
      } else {
        setPasswordError("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!fpEmail.trim()) {
      setFpMessage("Please enter your username/email.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await forgotPasswordRequest(fpEmail);
      setFpMessage(res.data.message || "Request sent to admin.");
    } catch (error) {
      const msg = error.response?.data?.error || "Error sending request.";
      setFpMessage(msg);
    } finally {
      setIsLoading(false);
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
      isLoading={isLoading}
    />
  );
}

export default LoginContainer;
