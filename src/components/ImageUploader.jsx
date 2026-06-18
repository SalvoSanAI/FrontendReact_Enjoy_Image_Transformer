import React, { useRef, useState, useCallback, useEffect } from 'react';
import './ImageUploader.css';

function ImageUploader({ uploadedImage, onImageLoaded }) {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [localStream, setLocalStream] = useState(null);

  const processFile = useCallback((file) => {
    if (!file) return;

    const allowed = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/bmp',
      'image/heic'
    ];

    if (!allowed.includes(file.type) && !file.type.startsWith('image/')) {
      alert('Formato non supportato. Usa JPEG, PNG, WebP, GIF o BMP.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onImageLoaded({
        file,
        dataUrl: reader.result
      });
    };
    reader.readAsDataURL(file);
  }, [onImageLoaded]);

  const handleFileChange = (e) => {
    processFile(e.target.files[0]);
    e.target.value = ''; 
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    processFile(file);
  }, [processFile]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // ===== CAMERA =====

  const getCameraErrorMessage = (err) => {
    if (!window.isSecureContext) {
      return 'La fotocamera richiede una connessione HTTPS sicura. Apri il sito con https://<IP-del-PC>:3000 (o localhost) per usare la webcam da un altro dispositivo.';
    }

    if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
      return 'Accesso alla fotocamera negato. Consenti i permessi del browser e riprova.';
    }

    if (err?.name === 'NotFoundError') {
      return 'Nessuna webcam disponibile sul dispositivo corrente.';
    }

    return 'Impossibile aprire la fotocamera. Controlla i permessi del browser e la connessione sicura.';
  };

  const openCamera = () => {
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      alert('Per usare la fotocamera da un altro PC, apri il sito con HTTPS (es. https://<IP-del-PC>:3000).');
      return;
    }

    setCameraOpen(true);
  };

  useEffect(() => {
    let streamRef = null;

    const startVideo = async () => {
      if (cameraOpen) {
        try {
          if (!window.isSecureContext) {
            throw new Error('SECURE_CONTEXT_REQUIRED');
          }

          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1920 }, height: { ideal: 1080 } } // Risoluzione più alta per il popup grande
          });
          streamRef = stream;
          setLocalStream(stream);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error(err);
          alert(getCameraErrorMessage(err));
          setCameraOpen(false);
        }
      }
    };

    startVideo();

    return () => {
      if (streamRef) {
        streamRef.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraOpen]);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {      
      // 1. Genera un suffisso univoco (es. 1718742514-a9b2)
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

      // 2. Crea il nome del file dinamico (es. photo-1718742514-a9b2.jpg)
      const fileName = `photo-${uniqueId}.jpg`;

      // 3. Crea il file object con il nome dinamico
      const file = new File([blob], fileName, { type: 'image/jpeg' });

      processFile(file);
      closeCamera();
    }, 'image/jpeg');
  };

  const closeCamera = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setCameraOpen(false);
  };

  const handleChooseFileClick = () => {
    if (cameraOpen) {
      closeCamera();
    }
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 50);
  };

  return (
    <section className="panel panel-left">
      <div className="panel-label">
        <span className="panel-label-icon">📷</span>
        <span>La Tua Foto</span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/bmp,image/heic,image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <div className="upload-buttons">
        <button
          className="btn btn-upload"
          onClick={handleChooseFileClick}
          title="Carica da file"
        >
          <span className="btn-icon">📁</span>
          <span>Scegli File</span>
        </button>

        <button
          className="btn btn-camera"
          onClick={openCamera}
          disabled={cameraOpen}
          title="Usa webcam"
        >
          <span className="btn-icon">📸</span>
          <span>Fotocamera</span>
        </button>
      </div>

      {/* POPUP / MODALE FOTOCAMERA */}
      {cameraOpen && (
        <div className="camera-modal-overlay" onClick={closeCamera}>
          <div className="camera-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="camera-modal-close" onClick={closeCamera} title="Chiudi">
              &times;
            </button>
            
            <h3 className="camera-modal-title">Inquadra e Scatta</h3>
            
            <div className="camera-container">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="camera-preview"
              />

              <div className="camera-actions">
                <button className="btn btn-camera-scatta" onClick={capturePhoto}>
                  <span className="btn-icon">📸</span> Scatta Foto
                </button>
                <button className="btn btn-camera-chiudi" onClick={closeCamera}>
                  Annulla
                </button>
              </div>
            </div>
          </div>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      )}

      {/* Drop zone / preview */}
      <div
        className={`image-zone ${isDragging ? 'dragging' : ''} ${uploadedImage ? 'has-image' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploadedImage && handleChooseFileClick()}
      >
        {uploadedImage ? (
          <img
            src={uploadedImage.dataUrl}
            alt="Immagine caricata"
            className="preview-image"
          />
        ) : (
          <div className="drop-placeholder">
            <div className="drop-icon">🖼️</div>
            <p className="drop-text">Trascina qui la tua foto</p>
            <p className="drop-subtext">oppure clicca per scegliere</p>
            <div className="drop-formats">JPG • PNG • WebP • GIF • BMP</div>
          </div>
        )}
      </div>

      {uploadedImage && (
        <div className="image-info">
          <span className="info-name">{uploadedImage.file.name}</span>
          <span className="info-size">{(uploadedImage.file.size / 1024).toFixed(1)} KB</span>
        </div>
      )}
    </section>
  );
}

export default ImageUploader;