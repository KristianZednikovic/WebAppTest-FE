import React, { useState } from "react";
import { useMsal } from "@azure/msal-react";

function MainPage() {
  const { instance, accounts } = useMsal();
  const [tenantData, setTenantData] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Function to fetch all tenant data (for the logged in tenant)
  const fetchAllTenantData = async () => {
    setError(null);
    const tokenRequest = {
      scopes: ["api://20428427-abf0-424b-83d7-f2fbb7ba1c83/readTenantData"],
      account: accounts[0],
    };

    try {
      let tokenResponse;
      try {
        tokenResponse = await instance.acquireTokenSilent(tokenRequest);
      } catch (silentError) {
        console.warn(
          "Silent token acquisition failed. Falling back to interactive method.",
          silentError
        );
        tokenResponse = await instance.acquireTokenPopup(tokenRequest);
      }
      const accessToken = tokenResponse.accessToken;
      console.log("Access token: ", accessToken);

      // API call without a search parameter returns all data for the logged-in tenant
      const response = await fetch(
        "https://webapplicationtest-bffqhvhcccgefmey.westeurope-01.azurewebsites.net/api/tenant-data",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

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


  const searchTenantData = async (term) => {
    setError(null);
    const tokenRequest = {
      scopes: ["api://20428427-abf0-424b-83d7-f2fbb7ba1c83/readTenantData"],
      account: accounts[0],
    };

    try {
      let tokenResponse;
      try {
        tokenResponse = await instance.acquireTokenSilent(tokenRequest);
      } catch (silentError) {
        console.warn(
          "Silent token acquisition failed. Falling back to interactive method.",
          silentError
        );
        tokenResponse = await instance.acquireTokenPopup(tokenRequest);
      }
      const accessToken = tokenResponse.accessToken;
      console.log("Access token: ", accessToken);

      // Append the search query parameter to filter by the "data" field
      const response = await fetch(
        `https://webapplicationtest-bffqhvhcccgefmey.westeurope-01.azurewebsites.net/api/tenant-data?search=${encodeURIComponent(term)}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tenant data for search");
      }
      const data = await response.json();
      setTenantData(data);
    } catch (err) {
      console.error("Error searching tenant data:", err);
      setError(err.message);
    }
  };

  // Handle search form submission
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    const tokenRequest = {
      scopes: ["api://20428427-abf0-424b-83d7-f2fbb7ba1c83/readTenantData"],
      account: accounts[0],
    };
  
    try {

      let tokenResponse;
      try {
        tokenResponse = await instance.acquireTokenSilent(tokenRequest);
      } catch (silentError) {
        console.warn(
          "Silent token acquisition failed. Falling back to interactive method.",
          silentError
        );
        tokenResponse = await instance.acquireTokenPopup(tokenRequest);
      }
      const accessToken = tokenResponse.accessToken;
      console.log("Access token: ", accessToken);
  
      // Build the API URL. If a search term is provided, append it as a query parameter.
      let url = "https://webapplicationtest-bffqhvhcccgefmey.westeurope-01.azurewebsites.net/api/tenant-data";
      if (searchTerm.trim()) {
        url += `?search=${encodeURIComponent(searchTerm.trim())}`;
      }
  
      // Fetch data from the backend using the access token
      const response = await fetch(url, {
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
        <form onSubmit={handleSearchSubmit}>
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
