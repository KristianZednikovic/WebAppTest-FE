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

  const apiUrl = "http://localhost:2000/api";

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

  return (
    <div className="App">
      <h2>Register</h2>
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
          placeholder="Password"
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
