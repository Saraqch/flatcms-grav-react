import React, { useState } from "react";
import CONFIG from "../config";
import "./AdminPanel.css";

const AdminPanel = ({ noticias, onNoticiaCreada, onNoticiaEliminada }) => {
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    type: "texto",
    content: "",
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files).slice(0, 3);
    setImages(selectedFiles);
  };

  const handleEdit = (noticia) => {
    setEditingId(noticia.id);
    setFormData({
      title: noticia.title,
      date: noticia.date,
      type: noticia.type || "texto",
      content: noticia.content || "",
    });
    setImages([]); // Se limpian las imágenes para subir nuevas si se desea
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: "",
      date: new Date().toISOString().split("T")[0],
      type: "texto",
      content: "",
    });
    setImages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación según tipo (solo para nuevas noticias o si se cambia a imagen)
    if (!editingId && formData.type === "imagen" && images.length === 0) {
      alert("Debes subir al menos una imagen para este tipo de noticia.");
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("date", formData.date);
    data.append("type", formData.type);
    data.append("content", formData.content);
    
    if (images.length > 0) {
      images.forEach((img) => data.append("image", img));
    }

    try {
      const url = editingId 
        ? `${CONFIG.API_URL}/noticias/${editingId}`
        : `${CONFIG.API_URL}/noticias`;
      
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        body: data,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error en el servidor");
      }

      alert(editingId ? "¡Noticia actualizada!" : "¡Noticia creada!");
      cancelEdit();
      onNoticiaCreada();
    } catch (error) {
      console.error("Error al procesar noticia:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta noticia?")) {
      await fetch(`${CONFIG.API_URL}/noticias/${id}`, { method: "DELETE" });
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
            <label>{formData.type === "imagen" ? "Subir Imágenes (Máx 3)" : "Subir Imagen"}</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              required={formData.type === "imagen"} 
              multiple={formData.type === "imagen"} 
            />
            {images.length > 0 && <small>{images.length} archivo(s) seleccionado(s)</small>}
          </div>
        )}

        <div className="form-group">
          <label>Contenido</label>
          <textarea 
            name="content" 
            value={formData.content} 
            onChange={handleChange} 
            rows="4" 
            required={formData.type !== "imagen"} 
            placeholder={formData.type === "imagen" ? "Contenido opcional..." : "Escribe el contenido..."}
          />
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? "Guardando..." : (editingId ? "Actualizar Noticia" : "Publicar Noticia")}
        </button>
        {editingId && (
          <button type="button" onClick={cancelEdit} className="btn-cancel" style={{ marginLeft: '10px' }}>
            Cancelar Edición
          </button>
        )}
      </form>

      <hr />

      <h3 className="sub-title">Noticias existentes</h3>
      <div className="news-list">
        {noticias.map((n) => (
          <div key={n.id} className="news-item">
            <div className="news-info">
              <strong>{n.title}</strong> <small>({n.type})</small>
            </div>
            <div className="news-actions">
              <button onClick={() => handleEdit(n)} className="btn-edit">Editar</button>
              <button onClick={() => handleDelete(n.id)} className="btn-delete">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
