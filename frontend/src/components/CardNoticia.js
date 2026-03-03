import React from 'react';
import './CardNoticia.css';

const CardNoticia = ({ noticia }) => {
  const { title, date, content, type, image } = noticia;

  // Convertir image a array si es un solo string
  const images = Array.isArray(image) ? image : (image ? [image] : []);

  return (
    <div className={`card-noticia ${type}`}>
      {/* RENDERIZADO DE IMÁGENES */}
      {images.length > 0 && (type === 'imagen' || type === 'texto_imagen') && (
        <div className={`card-media ${images.length > 1 ? 'grid-images' : ''}`}>
          {images.map((img, index) => (
            <img 
              key={index}
              src={`/assets/images/${img}`} 
              alt={`${title}-${index}`} 
              className={`noticia-img img-count-${images.length}`} 
            />
          ))}
        </div>
      )}

      {/* TEXTO */}
      {type !== 'imagen' && (
        <div className="card-content">
          <span className="noticia-date">{new Date(date).toLocaleDateString()}</span>
          <h3 className="noticia-title">{title}</h3>
          <p className="noticia-excerpt text-justify">{content}</p>
        </div>
      )}

      {/* Si es solo imagen, el título va como overlay o pie */}
      {type === 'imagen' && (
        <div className="card-content">
          <span className="noticia-date">{new Date(date).toLocaleDateString()}</span>
          <h3 className="noticia-title">{title}</h3>
          {content && <p className="noticia-excerpt">{content}</p>}
        </div>
      )}
    </div>
  );
};

export default CardNoticia;
