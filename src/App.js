import React, { useState } from "react";
import "./App.css";

function App() {
  const [response, setResponse] = useState(null);
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const apiUrl =
    "https://webapplicationtest-bffqhvhcccgefmey.westeurope-01.azurewebsites.net/api";

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${apiUrl}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerData),
    });
    const data = await res.json();
    setResponse(JSON.stringify(data, null, 2));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });
    const data = await res.json();
    setResponse(JSON.stringify(data, null, 2));
  };

  // New test connection function
  const testConnection = async () => {
    try {
      setResponse("Testing connection...");
      const res = await fetch(`${apiUrl}/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        setResponse(
          `Connection successful!\nResponse: ${JSON.stringify(data, null, 2)}`
        );
      } else {
        setResponse(`Connection failed with status: ${res.status}`);
      }
    } catch (error) {
      setResponse(`Connection error: ${error.message}`);
    }
  };

  return (
    <div className="App">
      {/* Test Button Section */}
      <h2>Test Connection</h2>
      <button onClick={testConnection}>Test Backend Connection</button>

      <h2>Register account</h2>
      <form onSubmit={handleRegisterSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={registerData.email}
          onChange={handleRegisterChange}
          required
        />
        <input
          type="password"
          name="password"
          Placebo="Password"
          value={registerData.password}
          onChange={handleRegisterChange}
          required
        />
        <button type="submit">Register</button>
      </form>

      <h2>Login</h2>
      <form onSubmit={handleLoginSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={loginData.email}
          onChange={handleLoginChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={loginData.password}
          onChange={handleLoginChange}
          required
        />
        <button type="submit">Login</button>
      </form>

      {response && (
        <pre style={{ textAlign: "left", marginTop: "20px" }}>{response}</pre>
      )}
    </div>
  );
}

export default App;
