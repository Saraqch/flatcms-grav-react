---
title: Bebras Bolivia
process:
    twig: true
---

# Bebras Bolivia

Bienvenido a la página oficial de **Bebras Bolivia**.

## ¿Qué es Bebras?
Bebras es una iniciativa internacional que promueve el pensamiento computacional en estudiantes.

---

## 📰 Últimas Noticias

{% for noticia in page.find('/noticias').children.order('date', 'desc') %}
### {{ noticia.title }}
📅 {{ noticia.date|date("d/m/Y") }}

{{ noticia.summary(100)|striptags }}...

[Leer más]({{ noticia.url }})

---
{% endfor %}