import React, { useState } from "react";
import "./AdminPanel.css";

const AdminPanel = ({ noticias, onNoticiaCreada, onNoticiaEliminada }) => {
  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    type: "texto",
    content: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("date", formData.date);
    data.append("type", formData.type);
    data.append("content", formData.content);
    if (image) data.append("image", image);

    try {
      const response = await fetch("http://localhost:3001/api/noticias", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        alert("¡Noticia creada con éxito!");
        setFormData({
          title: "",
          date: new Date().toISOString().split("T")[0],
          type: "texto",
          content: "",
        });
        setImage(null);
        onNoticiaCreada();
      }
    } catch (error) {
      console.error("Error al crear noticia:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta noticia?")) {
      await fetch(`http://localhost:3001/api/noticias/${id}`, { method: "DELETE" });
      onNoticiaEliminada();
    }
  };

  return (
    <div className="admin-panel shadow-sm">
      <h2 className="admin-title">Panel de Administración</h2>
      
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Título de la Noticia</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Tipo de Noticia</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="texto">Solo Texto</option>
              <option value="texto_imagen">Texto + Imagen</option>
              <option value="imagen">Solo Imagen</option>
            </select>
          </div>
          <div className="form-group">
            <label>Fecha</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>
        </div>

        {(formData.type === "texto_imagen" || formData.type === "imagen") && (
          <div className="form-group">
            <label>Subir Imagen</label>
            <input type="file" accept="image/*" onChange={handleImageChange} required={formData.type === "imagen"} />
          </div>
        )}

        <div className="form-group">
          <label>Contenido</label>
          <textarea name="content" value={formData.content} onChange={handleChange} rows="4" required />
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? "Guardando..." : "Publicar Noticia"}
        </button>
      </form>

      <hr />

      <h3 className="sub-title">Noticias existentes</h3>
      <div className="news-list">
        {noticias.map((n) => (
          <div key={n.id} className="news-item">
            <div>
              <strong>{n.title}</strong> <small>({n.type})</small>
            </div>
            <button onClick={() => handleDelete(n.id)} className="btn-delete">Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
