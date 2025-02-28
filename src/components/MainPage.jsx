import React, { useState } from "react";
import { useMsal } from "@azure/msal-react";

function MainPage() {
  const { instance, accounts } = useMsal();
  const [tenantData, setTenantData] = useState(null);
  const [error, setError] = useState(null);

  const fetchTenantData = async () => {
    setError(null);
    const tokenRequest = {
      scopes: ["api://20428427-abf0-424b-83d7-f2fbb7ba1c83/readTenantData"],
      account: accounts[0],
    };

    try {
      // First try to acquire the token silently
      let tokenResponse;
      try {
        tokenResponse = await instance.acquireTokenSilent(tokenRequest);
      } catch (silentError) {
        console.warn("Silent token acquisition failed. Falling back to interactive method.", silentError);
        // Fallback to interactive login to get consent
        tokenResponse = await instance.acquireTokenPopup(tokenRequest);
      }
      const accessToken = tokenResponse.accessToken;

      // Call the protected API endpoint using the token
      const response = await fetch("https://webapplicationtest-bffqhvhcccgefmey.westeurope-01.azurewebsites.net/api/tenant-data", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tenant data");
      }
      const data = await response.json();
      setTenantData(data);
    } catch (err) {
      console.error("Error fetching tenant data:", err);
      setError(err.message);
    }
  };

  return (
    <div className="App">
      <div className="main-page">
        <h1>Welcome to the Main Page!</h1>
        <p>This is the main area of the application.</p>
        <button onClick={fetchTenantData}>Fetch Tenant Data</button>
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {tenantData && (
          <div>
            <h2>Tenant Data</h2>
            <pre>{JSON.stringify(tenantData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainPage;
