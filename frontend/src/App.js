import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [noticias, setNoticias] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/noticias")
      .then(res => res.json())
      .then(data => setNoticias(data));
  }, []);

  return (
    <div>
      <header className="header">
        <h1>Bebras Bolivia</h1>
        <nav>
          <a href="#">Acerca de</a>
          <a href="#">Plan de estudios</a>
          <a href="#">Noticias</a>
        </nav>
      </header>

      <main className="container">
        <h2>Últimas Noticias</h2>

        {noticias.map((n, i) => (
          <div key={i} className="news-card">
            <h3>{n.title}</h3>
            <small>{n.date}</small>
            <p>{n.content}</p>
          </div>
        ))}
      </main>

      <footer className="footer">
        © 2026 Bebras Bolivia
      </footer>
    </div>
  );
}

export default App;