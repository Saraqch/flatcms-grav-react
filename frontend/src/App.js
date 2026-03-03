import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CardNoticia from './components/CardNoticia';
import AdminPanel from './components/AdminPanel'; 
import './App.css';

function App() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);

  const fetchNoticias = () => {
    setLoading(true);
    fetch('http://localhost:3001/api/noticias')
      .then(res => res.json())
      .then(data => {
        setNoticias(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar noticias:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNoticias();
  }, []);

  return (
    <div className="App">
      <Header />
      
      <main className="container main-content">
        <div style={{ textAlign: "right", marginBottom: "1rem" }}>
          <button 
            style={{ 
              background: "#34495e", 
              color: "white", 
              border: "none", 
              padding: "0.5rem 1rem", 
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: "bold"
            }}
            onClick={() => setShowAdmin(!showAdmin)}
          >
            {showAdmin ? "Ver Sitio Público" : "Modo ADMIN"}
          </button>
        </div>

        {showAdmin ? (
          <AdminPanel 
            noticias={noticias} 
            onNoticiaCreada={fetchNoticias}
            onNoticiaEliminada={fetchNoticias}
          />
        ) : (
          <>
            <section className="hero">
              <h2>¡Bienvenido a Bebras Bolivia!</h2>
              <p>
                Exploramos el mundo del <strong>Pensamiento Computacional</strong> a través de 
                desafíos lógicos interactivos.
              </p>
            </section>

            <section id="noticias" className="noticias-section">
              <h2>Últimas Noticias</h2>
              
              {loading ? (
                <p>Cargando noticias...</p>
              ) : (
                <div className="noticias-grid">
                  {noticias.length > 0 ? (
                    noticias.map((noticia, index) => (
                      <CardNoticia key={index} noticia={noticia} />
                    ))
                  ) : (
                    <p>No hay noticias publicadas en este momento.</p>
                  )}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;