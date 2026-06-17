// src/authConfig.js

export const msalConfig = {
    auth: {
        clientId: "94d43f1e-376a-4787-881e-eeeaee29e023", // ID dell'App Registration del Frontend (Passo 4)
        authority: "https://login.microsoftonline.com/4ebd9f8c-58ab-4a1f-8249-f2e2313a8b54", // Il tuo Directory (tenant) ID
        redirectUri: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
    },
    cache: {
        cacheLocation: "localStorage", 
        storeAuthStateInCookie: false,
    }
};

// Lo scope che abbiamo esposto nel backend per autorizzare gli utenti
export const loginRequest = {
    scopes: ["api://94d43f1e-376a-4787-881e-eeeaee29e023/access_as_user"]
};

