import React from 'react';
import './CardNoticia.css';

const CardNoticia = ({ noticia }) => {
  const { title, date, content, type, image } = noticia;

  return (
    <div className={`card-noticia ${type}`}>
      {/* IMAGEN: Se muestra si el tipo es 'imagen' o 'texto_imagen' */}
      {image && (type === 'imagen' || type === 'texto_imagen') && (
        <div className="card-media">
          {/* Aquí usaríamos la ruta a la carpeta de assets de Grav */}
          <img src={`/assets/images/${image}`} alt={title} className="noticia-img" />
        </div>
      )}

      {/* TEXTO: Se muestra si el tipo es 'texto' o 'texto_imagen' */}
      {(type === 'texto' || type === 'texto_imagen') && (
        <div className="card-content">
          <span className="noticia-date">{new Date(date).toLocaleDateString()}</span>
          <h3 className="noticia-title">{title}</h3>
          <p className="noticia-excerpt">{content.substring(0, 150)}...</p>
        </div>
      )}

      {/* Si es solo imagen, el título puede ir como un overlay o pie de foto */}
      {type === 'imagen' && !content && (
        <div className="card-content overlay">
          <h3 className="noticia-title">{title}</h3>
        </div>
      )}
    </div>
  );
};

export default CardNoticia;
