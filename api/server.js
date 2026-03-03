const express = require("express");
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const slugify = require("slugify");

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

const GRAV_PAGES = path.join(__dirname, "../grav/user/pages/04.noticias");
const ASSETS_PATH = path.join(__dirname, "../frontend/public/assets/images");

// Asegurar que la carpeta de assets existe
if (!fs.existsSync(ASSETS_PATH)) {
  fs.mkdirSync(ASSETS_PATH, { recursive: true });
}

// 1. Obtener todas las noticias (READ)
app.get("/api/noticias", (req, res) => {
  const noticias = [];
  if (!fs.existsSync(GRAV_PAGES)) return res.json([]);

  fs.readdirSync(GRAV_PAGES).forEach(folder => {
    const folderPath = path.join(GRAV_PAGES, folder);
    if (fs.lstatSync(folderPath).isDirectory()) {
      const filePath = path.join(folderPath, "item.md");
      if (fs.existsSync(filePath)) {
        try {
          const fileContent = fs.readFileSync(filePath, "utf-8");
          const { data, content } = matter(fileContent);
          
          // Debug logs si es necesario
          console.log(`Cargando noticia de: ${folder}`);

          noticias.push({
            id: folder,
            title: data.title,
            date: data.date,
            type: data.type || "texto",
            image: data.image || null,
            content: content ? content.trim() : ""
          });
        } catch (err) {
          console.error(`Error procesando ${filePath}:`, err);
        }
      }
    }
  });

  // Ordenar por fecha (descendente) y retornar
  const sorted = noticias.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(sorted);
});

// 2. Crear una noticia (CREATE)
app.post("/api/noticias", (req, res) => {
  const { title, date, type, content } = req.body;
  const slug = slugify(title, { lower: true, strict: true });
  const folderName = `99.${slug}`;
  const folderPath = path.join(GRAV_PAGES, folderName);
  
  if (fs.existsSync(folderPath)) return res.status(400).send("La noticia ya existe");
  fs.mkdirSync(folderPath, { recursive: true });

  let imageNames = [];
  if (req.files && req.files.image) {
    const files = Array.isArray(req.files.image) ? req.files.image : [req.files.image];
    
    // Usar un bucle for tradicional para manejar promesas de mv si fuera necesario, 
    // pero express-fileupload mv es síncrono con callback o asíncrono.
    for (const file of files) {
      const imageName = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;
      const destPath = path.join(ASSETS_PATH, imageName);
      
      // Aseguramos que file es el objeto correcto que tiene mv
      if (typeof file.mv === 'function') {
        file.mv(destPath, (err) => {
          if (err) console.error("Error moviendo archivo:", err);
        });
        imageNames.push(imageName);
      }
    }
  }

  // Si es un solo nombre, guardarlo como string, si son varios como array YAML
  const imageField = imageNames.length > 1 
    ? `\nimage:\n${imageNames.map(name => `  - ${name}`).join("\n")}` 
    : `\nimage: ${imageNames[0] || "null"}`;

  const fileContent = `---
title: ${title}
date: ${date}
type: ${type}${imageField}
---
${content}`;

  fs.writeFileSync(path.join(folderPath, "item.md"), fileContent);
  res.json({ message: "Noticia creada con éxito" });
});

// 3. Eliminar noticia (DELETE)
app.delete("/api/noticias/:id", (req, res) => {
  const folderPath = path.join(GRAV_PAGES, req.params.id);
  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true, force: true });
    res.json({ message: "Noticia eliminada" });
  } else {
    res.status(404).send("Noticia no encontrada");
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API Node corriendo en http://localhost:${PORT}`);
});