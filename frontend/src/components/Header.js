import React, { useState } from 'react';
import './Header.css';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="logo">Bebras Bolivia</h1>
        <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '✕' : '☰'}
        </button>
        <nav className={`nav-menu ${isOpen ? 'open' : ''}`}>
          <a href="/">Inicio</a>
          <a href="/acerca">Acerca de</a>
          <a href="/plan">Plan de estudios</a>
          <a href="/noticias">Noticias</a>
        </nav>
      </div>
    </header>
  );
};
export default Header;