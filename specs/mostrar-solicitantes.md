# Mostrar solicitantes por película (solo admins)

## Problema
Los administradores del cineclub no pueden saber quién pidió cada película: la página `/peliculas-solicitadas` solo muestra el conteo de solicitudes, pero no los nombres ni correos de las personas que las enviaron. Esto dificulta la comunicación con los miembros y la toma de decisiones sobre qué películas programar.

## Usuarios afectados
- **Administrador del cineclub** — el único que necesita ver esta información para gestionar las solicitudes.

## User Stories

- Como administrador, quiero ver el nombre y correo electrónico de cada persona que solicitó una película, para poder contactarlos o considerar su popularidad real.
- Como administrador, quiero que esta información esté oculta para usuarios no admin, para proteger los datos personales de los miembros.

## Criterios de aceptación

- [ ] Cuando el usuario autenticado es admin, cada película en la lista muestra debajo del título y conteo una sección con los solicitantes.
- [ ] Cada solicitante se muestra con su nombre y su correo electrónico, tal como están almacenados en Firestore.
- [ ] Si una misma persona solicitó la misma película más de una vez, aparece una vez por cada documento (sin deduplicar), reflejando el conteo real.
- [ ] Cuando el usuario no es admin (o no está autenticado), la sección de solicitantes no se renderiza ni aparece en el DOM.
- [ ] La lista de solicitantes se carga con los mismos datos que ya se obtienen en `fetchRequests` — no se hace una segunda consulta a Firestore.
- [ ] El diseño de la sección de solicitantes es compacto y no rompe el layout existente de la tarjeta de película.
- [ ] El texto de solicitantes es visualmente secundario (tamaño pequeño, color gris) respecto al título y conteo.

## Fuera de alcance
- Exportar o descargar la lista de solicitantes.
- Mostrar fecha/hora de la solicitud.
- Permitir al admin contactar a los solicitantes desde la misma página.
- Cambiar la estructura de la colección `movie_requests` en Firestore.
- Modificar el formulario de solicitud en `/solicitar-pelicula/page.jsx`.
- Paginación o búsqueda dentro de solicitantes.

## Notas técnicas

**Archivo a modificar:** `src/app/peliculas-solicitadas/page.jsx` — es el único archivo que necesita cambios.

**Cambio en la lógica de agrupación (`fetchRequests`):** al construir cada objeto agrupado, además de `ids`, guardar también un array `requesters` con objetos `{ name, email }` extraídos de `d.data()`. Así cada grupo tendrá:
```js
{ display, count, ids, requesters: [{ name, email }, ...], tmdb }
```

**Renderizado condicional:** en el JSX del `<li>`, cuando `isAdmin === true`, renderizar debajo del bloque de título/conteo un sublistado con los datos de `requesters`.

**Sin cambios en Firestore ni en otros componentes.** La verificación de admin ya existe (`isAdmin` state) y puede reutilizarse directamente para condicionar la visibilidad.

## Decisiones tomadas

- **Visibilidad:** siempre visible — la sección de solicitantes se muestra directamente bajo el conteo, sin necesidad de expandir.
- **Datos incompletos:** mostrar solo lo que exista — si falta el nombre, mostrar solo el correo; si falta el correo, mostrar solo el nombre; si falta ambos, omitir ese solicitante.
