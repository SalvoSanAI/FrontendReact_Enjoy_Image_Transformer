import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // 👈 Il CSS globale o di base va SEMPRE prima
import App from './App';

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

// 👇 QUESTO È IL SEGRETO: dice a MSAL di elaborare la risposta dell'autenticazione all'avvio
msalInstance.handleRedirectPromise().then((response) => {
    if (response) {
        msalInstance.setActiveAccount(response.account);
    } else {
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
            msalInstance.setActiveAccount(accounts[0]);
        }
    }
}).catch(err => {
    console.error("Errore MSAL promessa:", err);
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <MsalProvider instance={msalInstance}>
            <App />
        </MsalProvider>
    </React.StrictMode>
);