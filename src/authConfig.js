// src/authConfig.js

export const msalConfig = {
    auth: {
        clientId: "94d43f1e-376a-4787-881e-eeeaee29e023", // ID dell'App Registration del Frontend (Passo 4)
        authority: "https://login.microsoftonline.com/4ebd9f8c-58ab-4a1f-8249-f2e2313a8b54", // Il tuo Directory (tenant) ID
        redirectUri: "http://localhost:3000", // Dove gira React in locale
    },
    cache: {
        cacheLocation: "sessionStorage", // Salva il login nella sessione del browser
        storeAuthStateInCookie: false,
    }
};

// Lo scope che abbiamo esposto nel backend per autorizzare gli utenti
export const loginRequest = {
    scopes: ["api://94d43f1e-376a-4787-881e-eeeaee29e023/access_as_user"]
};