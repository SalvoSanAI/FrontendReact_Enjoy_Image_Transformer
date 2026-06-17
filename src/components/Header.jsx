import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="header-logo">
          <span className="logo-bolt">⚡</span>
        </div>
        <div className="header-title-group">
          <h1 className="header-title">
            <span className="title-enjoy">Enjoy</span>
            <span className="title-image"> Image</span>
            <span className="title-transformer"> Transformer</span>
          </h1>
          <p className="header-subtitle">Trasforma le tue foto in stile Pixar con i tuoi supereroi preferiti</p>
        </div>
        <div className="header-logo header-logo-right">
          <span className="logo-bolt">⚡</span>
        </div>
      </div>
      <div className="header-underline" />
    </header>
  );
}

export default Header;
