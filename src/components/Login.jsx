import React, { useEffect } from "react";
import { useNavigate} from "react-router-dom";
import { PublicClientApplication } from "@azure/msal-browser";
import msalConfig from "../controllers/azureLogin";

function Login() {
  const navigate = useNavigate();
  const msalInstance = new PublicClientApplication(msalConfig);

  // Define the scopes you need (e.g., "User.Read" to read the user’s profile)
  const loginRequest = {
    scopes: ["User.Read"]
  };

  useEffect(() => {
    const initializeMSAL = async () => {
      try {
        await msalInstance.initialize();
        console.log("MSAL initialized");
      } catch (error) {
        console.error("MSAL initialization failed:", error);
      }
    };
    initializeMSAL();
  }, [msalInstance]);

  // Function to handle Azure Entra ID login
  const handleAzureLogin = async () => {
    try {
      const response = await msalInstance.loginPopup(loginRequest);
      console.log("Login successful:", response);
      navigate("/main", { state: { user: response.account, token: response.idToken } });
    } catch (error) {
      console.error("Azure Entra ID login failed:", error);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h2>Login with Azure Entra ID</h2>
        <button onClick={handleAzureLogin}>Login with Azure Entra ID</button>
      </div>
    </div>
  );
}

export default Login;
