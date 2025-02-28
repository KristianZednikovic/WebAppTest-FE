const msalConfig = {
  auth: {
    clientId: "4c2fd26d-7777-4606-9be6-5cba2879e07e",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: "https://agreeable-field-04e575103.4.azurestaticapps.net",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: true,
  },
};

export default msalConfig;