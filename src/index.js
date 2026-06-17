// src/index.js o src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";

// 1. Inizializza l'istanza MSAL
const msalInstance = new PublicClientApplication(msalConfig);

// 2. Opzionale ma consigliato aziendalmente: registra l'evento se il login va a buon fine
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
    msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
        msalInstance.setActiveAccount(event.payload.account);
    }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        {/* 3. L'intero blocco DEVE essere racchiuso nel provider */}
        <MsalProvider instance={msalInstance}>
            <App />
        </MsalProvider>
    </React.StrictMode>
);