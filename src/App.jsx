import React, { useState, useCallback } from 'react';
import { useMsal, AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { loginRequest } from "./authConfig"; // Assicurati che questo file sia nella cartella src

import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ImageOutput from './components/ImageOutput';
import Footer from './components/Footer';
import ErrorModal from './components/ErrorModal';
import './App.css';

function App() {
  const { instance, accounts } = useMsal();
  
  const [uploadedImage, setUploadedImage] = useState(null); // { file, dataUrl }
  const [outputImage, setOutputImage] = useState(null);    // URL dell'immagine elaborata finale
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHero, setSelectedHero] = useState(null);
  const [statusText, setStatusText] = useState("");         // Feedback visivo dei passaggi di Azure
  const [error, setError] = useState(null);

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch(e => setError("Errore durante il login: " + e.message));
  };

  const handleImageLoaded = useCallback((imageData) => {
    setUploadedImage(imageData);
    setOutputImage(null);
    setStatusText("");
  }, []);

  const handleTransform = useCallback(async () => {
    if (!uploadedImage) {
      setError('Per favore carica un\'immagine prima di procedere.');
      return;
    }
    if (!selectedHero) {
      setError('Per favore seleziona un supereroe prima di procedere.');
      return;
    }

    setIsLoading(true);
    setOutputImage(null);

    try {
      // 1. Recupera l'Access Token in background da Microsoft Entra ID
      setStatusText("Generazione del token di sicurezza Microsoft...");
      const tokenResponse = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0]
      });
      const accessToken = tokenResponse.accessToken;

      // 2. Chiama l'Azure Function per richiedere il SAS URL blindato
      setStatusText("Richiesta SAS URL sicuro ad Azure...");
      const functionUrl = `https://rg-azure-project-gfcge4ehhte5bhd8.italynorth-01.azurewebsites.net/api/get-upload-sas?filename=${uploadedImage.file.name}`;
      
      const response = await fetch(functionUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}` // Passiamo il token a Easy Auth
        },
      });

      if (!response.ok) {
        throw new Error(`Errore di autenticazione backend: ${response.status}`);
      }

      const data = await response.json();
      const uploadUrl = data.uploadUrl; // Il link temporaneo generato dal backend

      // 3. Esegui l'upload diretto sul Blob Storage bypassando il server
      setStatusText("Caricamento immagine direttamente nel Blob Storage...");
      const uploadResult = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": uploadedImage.file.type
        },
        body: uploadedImage.file
      });

      if (!uploadResult.ok) {
        throw new Error("Impossibile caricare l'immagine sullo Storage di Azure.");
      }

      setStatusText("🎉 Immagine caricata con successo! L'elaborazione è partita.");
      setIsLoading(false);
      
      // NOTA: Poiché l'elaborazione sulla coda avviene in background, qui dovresti idealmente
      // fare un polling o mostrare un messaggio. Per ora simuliamo che l'operazione sia stata inviata.
      // In seguito potrai impostare l'URL finale dell'immagine ridimensionata/elaborata.
      setOutputImage("https://stprojectbackend001.blob.core.windows.net/output-container/" + uploadedImage.file.name);

    } catch (err) {
      setIsLoading(false);
      setStatusText("");
      setError(err.message || 'Si è verificato un errore imprevisto durante la comunicazione con Azure.');
    }
  }, [uploadedImage, selectedHero, instance, accounts]);

  const handleReset = useCallback(() => {
    setUploadedImage(null);
    setOutputImage(null);
    setIsLoading(false);
    setStatusText("");
  }, []);

  return (
    <div className="app-layout">
      <Header />

      {/* Se l'utente NON è loggato, blocca l'app e mostra la schermata di Login di Microsoft */}
      <UnauthenticatedTemplate>
        <main className="app-main" style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Accesso Richiesto</h2>
          <p>Devi autenticarti con il tuo account Microsoft per accedere alla piattaforma di elaborazione immagini.</p>
          <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
            Accedi con Microsoft
          </button>
        </main>
      </UnauthenticatedTemplate>

      {/* Se l'utente È loggato, mostra la normale interfaccia operativa */}
      <AuthenticatedTemplate>
        <main className="app-main">
          {statusText && <div className="status-banner">{statusText}</div>}
          
          <div className="panels-container">
            <ImageUploader
              uploadedImage={uploadedImage}
              onImageLoaded={handleImageLoaded}
            />
            <div className="panels-divider">
              <span className="divider-icon">⚡</span>
            </div>
            <ImageOutput
              outputImage={outputImage}
              isLoading={isLoading}
            />
          </div>
        </main>

        <Footer
          selectedHero={selectedHero}
          onHeroChange={setSelectedHero}
          onTransform={handleTransform}
          onReset={handleReset}
          isLoading={isLoading}
          hasImage={!!uploadedImage}
        />
      </AuthenticatedTemplate>

      {error && (
        <ErrorModal message={error} onClose={() => setError(null)} />
      )}
    </div>
  );
}

export default App;