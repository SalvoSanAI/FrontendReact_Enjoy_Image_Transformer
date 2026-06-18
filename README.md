[React Frontend]
│
│ (1. Upload Immagine con Metadata 'hero')
▼
[Azure Blob Storage: input-container]
│
│ (2. Trigger Event Grid / Queue)
▼
[Azure Storage Queue: images-to-process]
│
│ (3. Trigger su Coda)
▼
[Azure Functions (Python V2)] ────(4. Chiamata MaaS)────► [Azure AI Foundry: FLUX.2-pro]
│                                                              │
│ (5. Scrittura Output PNG)                                    │ (Risposta con byte)
▼                                                              ▲
[Azure Blob Storage: output-container] ◄──────────────────────────────┘
▲
│ (6. Polling Asincrono)
│
[React Frontend]


---

## 🔄 Flusso dei Dati (Step-by-Step)

1. **Frontend (React)**: 
   L'utente seleziona un personaggio dal menu (gestito tramite `react-select`) e scatta una foto. Al click su "Trasforma", il frontend genera un nome file univoco con un timestamp (`photo-[timestamp]-[random].jpg`) e carica l'immagine direttamente su un **Azure Blob Storage (`input-container`)** via SAS Token. Il personaggio selezionato viene iniettato come metadato HTTP nell'header `x-ms-meta-hero`.
   
2. **Accoppiamento Asincrono (Storage Queue)**: 
   L'inserimento del blob nel container genera un evento che popola in automatico la coda di messaggi **Azure Storage Queue (`images-to-process`)**. Questo garantisce che ogni richiesta venga tracciata e che non vadano persi file in caso di picchi di traffico.

3. **Elaborazione Background (Azure Functions)**: 
   Una **Azure Function in Python (Modello V2)** attivata dal trigger di coda si sveglia e:
   * Estrae in modo sicuro il metadato `hero` dal blob associato.
   * Scarica i byte dell'immagine originale ed esegue una normalizzazione e un ridimensionamento ottimizzato (`Pillow`).
   * Recupera il prompt descrittivo avanzato dal dizionario interno `HERO_CONTEXT`.

4. **Generazione AI (Azure AI Foundry)**: 
   La Function effettua una chiamata REST *Model-as-a-Service (MaaS)* all'endpoint serverless di **FLUX.2-pro**, inviando l'immagine (Image-to-Image) e il prompt dei dettagli del costume.

5. **Salvataggio dell'Output**: 
   Ricevuta la risposta dall'IA, la Function converte il flusso di output in formato PNG e lo scrive nell'**Azure Blob Storage (`output-container`)** con lo stesso nome file univoco generato dal frontend.

6. **Visualizzazione**: 
   Nel frattempo, il frontend React effettua un polling asincrono leggero sull' `output-container`. Non appena il file con il nome univoco appare, l'interfaccia interrompe lo spinner e mostra l'immagine finale all'utente.

---

## 🛠️ Stack Tecnologico

### Frontend
* **React.js**: Interfaccia utente reattiva e gestione della webcam.
* **React Select**: Menu di ricerca dinamico per la selezione dei personaggi.
* **Azure Static Web Apps (SWA)**: Hosting globale del frontend con pipeline di CI/CD nativa tramite GitHub Actions.

### Backend & Cloud Infrastructure
* **Azure Functions (Python 3.13 V2 Programming Model)**: Computazione serverless ed elaborazione asincrona guidata dagli eventi.
* **Azure Blob Storage**: Storage distribuito ad alte prestazioni separato in due container logici (`input` / `output`).
* **Azure Storage Queues**: Gestione della coda dei messaggi per disaccoppiare frontend e backend.
* **Azure AI Foundry**: Endpoint serverless per il modello di Generative AI **FLUX.2-pro** (Black Forest Labs).
* **Application Insights**: Monitoraggio avanzato e tracciamento dei log di esecuzione in tem