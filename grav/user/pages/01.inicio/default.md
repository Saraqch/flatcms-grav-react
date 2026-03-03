---
title: Bebras Bolivia
process:
    twig: true
noticias:
  - title: "Estudiantes resuelven desafíos Bebras en tiempo récord"
    date: "2026-03-03"
    summary: "Durante la competencia regional, los participantes demostraron habilidades..."
    url: "/noticias/99.estudiantes-resuelven-desafios-bebras-en-tiempo-record"
  - title: "Bebras Bolivia abre convocatoria 2026"
    date: "2026-02-03"
    summary: "Se anunció oficialmente la apertura de la convocatoria 2026..."
    url: "/noticias/99.bebras-bolivia-abre-convocatoria-2026"
---

# Bebras Bolivia

Bienvenido a la página oficial de **Bebras Bolivia**.

## ¿Qué es Bebras?
Bebras is una iniciativa internacional que promueve el pensamiento computacional en estudiantes.

---

## 📰 Últimas Noticias

{% for noticia in page.noticias %}
### {{ noticia.title }}
📅 {{ noticia.date }}

{{ noticia.summary }}...

[Leer más]({{ noticia.url }})

---
{% endfor %}