import React, { useState } from "react";
import { useMsal } from "@azure/msal-react";

function MainPage() {
  const { instance, accounts } = useMsal();
  const [tenantData, setTenantData] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const getAccessToken = async () => {
    const tokenRequest = {
      scopes: ["api://20428427-abf0-424b-83d7-f2fbb7ba1c83/readTenantData"],
      account: accounts[0],
    };

    try {
      return await instance.acquireTokenSilent(tokenRequest);
    } catch (silentError) {
      console.warn("Silent token failed. Falling back to popup.");
      return await instance.acquireTokenPopup(tokenRequest);
    }
  };

  const fetchTenantData = async (term = "") => {
    setError(null);

    try {
      const tokenResponse = await getAccessToken();
      const accessToken = tokenResponse.accessToken;

      const url = term
        ? `https://webapplicationtest-bffqhvhcccgefmey.westeurope-01.azurewebsites.net/api/tenant-data?search=${encodeURIComponent(term)}`
        : "https://webapplicationtest-bffqhvhcccgefmey.westeurope-01.azurewebsites.net/api/tenant-data";

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch tenant data");

      const data = await response.json();
      setTenantData(data);
    } catch (err) {
      console.error("Error fetching tenant data:", err);
      setError(err.message);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTenantData(searchTerm); //searchTerm.trim()
  };

  return (
    <div className="App">
      <div className="main-page">
        <h1>Welcome to the Main Page!</h1>
        <p>This is the main area of the application.</p>
        <form onSubmit={handleSearchSubmit} className="search-bar">
          <input
            type="text"
            placeholder="Search within tenant data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {tenantData && tenantData.length > 0 ? (
          <div>
            <h2>Tenant Data</h2>
            <pre>{JSON.stringify(tenantData, null, 2)}</pre>
          </div>
        ) : (
          <p>No data found.</p>
        )}
      </div>
    </div>
  );
}

export default MainPage;
