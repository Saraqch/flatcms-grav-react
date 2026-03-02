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
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(fileContent);
        noticias.push({
          id: folder,
          title: data.title,
          date: data.date,
          type: data.type || "texto",
          image: data.image || null,
          content: content.trim()
        });
      }
    }
  });
  res.json(noticias.sort((a, b) => new Date(b.date) - new Date(a.date)));
});

// 2. Crear una noticia (CREATE)
app.post("/api/noticias", (req, res) => {
  const { title, date, type, content } = req.body;
  const slug = slugify(title, { lower: true, strict: true });
  const folderName = `99.${slug}`; // 99 para que aparezca al final o según lógica de Grav
  const folderPath = path.join(GRAV_PAGES, folderName);
  
  if (fs.existsSync(folderPath)) return res.status(400).send("La noticia ya existe");
  fs.mkdirSync(folderPath, { recursive: true });

  let imageName = null;
  if (req.files && req.files.image) {
    const file = req.files.image;
    imageName = `${Date.now()}-${file.name}`;
    file.mv(path.join(ASSETS_PATH, imageName));
  }

  const fileContent = `---
title: ${title}
date: ${date}
type: ${type}
image: ${imageName}
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