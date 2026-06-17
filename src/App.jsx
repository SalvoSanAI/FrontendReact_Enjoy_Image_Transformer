import React, { useState, useCallback } from 'react';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import './App.css';

function App() {
  const { instance, accounts } = useMsal();
  
  const [uploadedImage, setUploadedImage] = useState(null);
  const [outputImage, setOutputImage] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHero, setSelectedHero] = useState(null);
  const [statusText, setStatusText] = useState(""); 
  const [error, setError] = useState(null);

  // ==========================================
  // 🔄 IL CICLO DI POLLING (VIAGGIO DI RITORNO)
  // ==========================================
  const startPolling = (filename, accessToken) => {
    let attempts = 0;
    const maxAttempts = 20; // Prova per circa 80 secondi (20 * 4s) prima di andare in timeout

    const intervalId = setInterval(async () => {
      attempts++;
      setStatusText(`Il supereroe sta elaborando... (Tentativo ${attempts})`);

      try {
        // Interroghiamo la NUOVA Azure Function appena pubblicata
        const checkUrl = `https://rg-azure-project-gfcge4ehhte5bhd8.italynorth-01.azurewebsites.net/api/get-download-sas?filename=${filename}`;
        
        const response = await fetch(checkUrl, {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${accessToken}` // Passiamo il token di Entra ID
          }
        });

        // Se il server risponde 200 OK, significa che l'immagine nell'output-container esiste!
        if (response.ok) {
          const data = await response.json();
          
          clearInterval(intervalId); // 🛑 Fermiamo il ciclo
          setOutputImage(data.downloadUrl); // 🖼️ Impostiamo il SAS URL firmato per visualizzarla
          setIsLoading(false);
          setStatusText("🎉 Trasformazione completata con successo!");
        } 
        // Nota: se risponde 404, il catch non scatta e il ciclo continua tranquillamente al prossimo intervallo
        
      } catch (err) {
        console.log("In attesa del completamento sul server...", err);
      }

      // Se superiamo i tentativi massimi, interrompiamo per non consumare risorse all'infinito
      if (attempts >= maxAttempts) {
        clearInterval(intervalId);
        setIsLoading(false);
        setStatusText("");
        setError("L'elaborazione ha impiegato troppo tempo. Verifica i log della coda su Azure.");
      }
    }, 4000); // Controllo ogni 4 secondi
  };

  // ==========================================
  // 🚀 AZIONE DI TRASFORMAZIONE (VIAGGIO DI ANDATA)
  // ==========================================
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
    setError(null);

    try {
      // 1. Recupera l'Access Token silenziosamente grazie a MSAL
      setStatusText("Autenticazione con Microsoft Entra ID...");
      const tokenResponse = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0]
      });
      const accessToken = tokenResponse.accessToken;

      // 2. Chiama la prima Azure Function per ottenere il SAS URL di Scrittura
      setStatusText("Richiesta autorizzazione di upload ad Azure...");
      const functionUrl = `https://rg-azure-project-gfcge4ehhte5bhd8.italynorth-01.azurewebsites.net/api/get-upload-sas?filename=${uploadedImage.file.name}`;
      
      const response = await fetch(functionUrl, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });

      if (!response.ok) throw new Error(`Errore autorizzazione backend: ${response.status}`);
      const data = await response.json();
      const uploadUrl = data.uploadUrl;

      // 3. Esegui il caricamento diretto nell'input-container bypassando il firewall tramite il SAS URL
      setStatusText("Caricamento immagine nel Blob Storage blindato...");
      const uploadResult = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": uploadedImage.file.type
        },
        body: uploadedImage.file
      });

      if (!uploadResult.ok) throw new Error("Caricamento nel Blob Storage fallito.");

      // 🚀 AGGANCIO DEL POLLING: L'andata è completata con successo. 
      // Diamo il via al ciclo di controllo passando il nome del file e il token
      startPolling(uploadedImage.file.name, accessToken);

    } catch (err) {
      setIsLoading(false);
      setStatusText("");
      setError(err.message || 'Si è verificato un errore imprevisto.');
    }
  }, [uploadedImage, selectedHero, instance, accounts]);

  const handleReset = useCallback(() => {
    setUploadedImage(null);
    setOutputImage(null);
    setIsLoading(false);
    setStatusText("");
    setError(null);
  }, []);

  const handleImageLoaded = useCallback((imageData) => {
    setUploadedImage(imageData);
    setOutputImage(null);
    setStatusText("");
    setError(null);
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