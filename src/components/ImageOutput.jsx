import React from 'react';
import './ImageOutput.css';

function ImageOutput({ outputImage, isLoading }) {
  const handleDownload = () => {
    if (!outputImage) return;
    const a = document.createElement('a');
    a.href = outputImage;
    a.download = 'superhero-transformation.png';
    a.click();
  };

  return (
    <section className="panel panel-right">
      <div className="panel-label panel-label-output">
        <span className="panel-label-icon">✨</span>
        <span>Immagine Trasformata</span>
      </div>

      <div className={`image-zone output-zone ${isLoading ? 'loading' : ''} ${outputImage ? 'has-image' : ''}`}>
        {isLoading ? (
          <div className="loading-overlay">
            <div className="loading-spinner-wrapper">
              <div className="loading-ring" />
              <div className="loading-ring loading-ring-2" />
              <div className="loading-hero-icon">🦸</div>
            </div>
            <p className="loading-title">Trasformazione in corso...</p>
            <p className="loading-subtitle">Il modello AI sta creando il tuo supereroe Pixar</p>
            <div className="loading-dots">
              <span /><span /><span />
            </div>
          </div>
        ) : outputImage ? (
          <img
            src={outputImage}
            alt="Immagine trasformata"
            className="preview-image output-image"
          />
        ) : (
          <div className="drop-placeholder">
            <div className="output-placeholder-graphic">
              <span className="placeholder-hero">🦸‍♂️</span>
              <div className="placeholder-sparkles">
                <span>✨</span><span>⭐</span><span>✨</span>
              </div>
            </div>
            <p className="drop-text">Il risultato apparirà qui</p>
            <p className="drop-subtext">Carica una foto, scegli il tuo supereroe<br />e premi Trasforma!</p>
          </div>
        )}

        {outputImage && !isLoading && (
          <div className="output-badge">Pixar Style ✓</div>
        )}
      </div>

      {outputImage && !isLoading && (
        <button className="btn btn-download" onClick={handleDownload}>
          <span className="btn-icon">⬇️</span>
          <span>Scarica Immagine</span>
        </button>
      )}
    </section>
  );
}

export default ImageOutput;
