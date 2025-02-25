import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MailIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    width="20"
    height="20"
    viewBox="0 0 24 24"
  >
    <path d="M4 4h16v16H4z"></path>
    <path d="M22 4L12 11 2 4"></path>
  </svg>
);

const LockIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    width="20"
    height="20"
    viewBox="0 0 24 24"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0110 0v4"></path>
  </svg>
);

const EyeIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    width="20"
    height="20"
    viewBox="0 0 24 24"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    width="20"
    height="20"
    viewBox="0 0 24 24"
  >
    <path d="M17.94 17.94A10.06 10.06 0 012 12s4-8 10-8a9.77 9.77 0 014.88 1.27"></path>
    <path d="M1 1l22 22"></path>
    <path d="M9.88 9.88A3 3 0 0114.12 14.12"></path>
    <path d="M12 20c6 0 10-8 10-8a19.43 19.43 0 00-2-3.34"></path>
  </svg>
);

function Login() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const apiUrl = "https://webapplicationtest-bffqhvhcccgefmey.westeurope-01.azurewebsites.net/api";
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const toggleLoginPassword = () => {
    setShowLoginPassword(!showLoginPassword);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      const res = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        setErrorMessage(errorData.message || "Login failed. Please try again.");
      } else {
        const data = await res.json();
        navigate("/main", { state: { user: data.user, token: data.token } });
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again later.");
    }
  };

  return (
    <div className="App">
     <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLoginSubmit}>
        <div className="input-wrapper">
          <span className="icon">{MailIcon}</span>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={loginData.email}
            onChange={handleLoginChange}
            required
          />
        </div>
        <div className="input-wrapper">
          <span className="icon">{LockIcon}</span>
          <input
            type={showLoginPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleLoginChange}
            required
          />
          <span className="icon eye-icon" onClick={toggleLoginPassword}>
            {showLoginPassword ? EyeIcon : EyeOffIcon}
          </span>
        </div>
        <button type="submit">Login</button>
      </form>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
     </div>
    </div>
  );
}

export default Login;
