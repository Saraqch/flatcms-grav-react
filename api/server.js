const express = require("express");
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const cors = require("cors");

const app = express();
app.use(cors());

const GRAV_PAGES = path.join(__dirname, "../grav/user/pages/04.noticias");

// Endpoint: obtener noticias
app.get("/api/noticias", (req, res) => {
  const noticias = [];

  if (!fs.existsSync(GRAV_PAGES)) {
    return res.status(404).json({ error: "No se encuentra la carpeta de noticias en Grav" });
  }

  const folders = fs.readdirSync(GRAV_PAGES);

  folders.forEach(folder => {
    const folderPath = path.join(GRAV_PAGES, folder);
    
    // Solo procesar si es un directorio
    if (fs.lstatSync(folderPath).isDirectory()) {
      const filePath = path.join(folderPath, "item.md");

      if (fs.existsSync(filePath)) {
        const file = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(file);

        noticias.push({
        title: data.title,
        date: data.date,
        content: content.trim(),
        type: data.type || "texto",
        image: data.image || null
      });
      }
    }
  });

   noticias.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.json(noticias);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API Node corriendo en http://localhost:${PORT}`);
});