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
            <li><a href="/" onClick={() => setIsOpen(false)}>Inicio</a></li>
            <li><a href="/acerca" onClick={() => setIsOpen(false)}>Acerca de</a></li>
            <li><a href="/plan" onClick={() => setIsOpen(false)}>Plan de estudios</a></li>
            <li><a href="/noticias" onClick={() => setIsOpen(false)}>Noticias</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
export default Header;