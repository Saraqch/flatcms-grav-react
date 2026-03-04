import React, { useState } from 'react';
import './Header.css';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="header">
      <div className="container header-content">
        <h1 className="logo">Bebras Bolivia</h1>
        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <nav className={`nav ${isOpen ? 'open' : ''}`}>
          <ul>
            <li><a href="#noticias" onClick={() => setIsOpen(false)} style={{ color: "var(--bebras-yellow)", fontWeight: "bold" }}>Inicio</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setIsOpen(false); }} style={{ opacity: 0.5, pointerEvents: "none" }}>Acerca de</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setIsOpen(false); }} style={{ opacity: 0.5, pointerEvents: "none" }}>Plan de estudios</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setIsOpen(false); }} style={{ opacity: 0.5, pointerEvents: "none" }}>Noticias</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
export default Header;