# ADR-0006: Título en inglés como respaldo cuando TMDB no tiene uno legible

- **Estado:** Aceptado
- **Fecha:** 2026-10-07

## Contexto
ADR-0002 dejó como riesgo que el título guardado en una solicitud es el que TMDB tenga en `es-MX`. Para películas recientes sin traducción, TMDB regresa el título original: japonés (`ネルソンさん、あなたは人を殺しましたか？`), coreano (`가능한 사랑`), cirílico, etc. Ese título se mostraba en el buscador y quedaba guardado en `movie_requests`.

## Decisión
En `/api/tmdb-search` (búsqueda y búsqueda por `id`), si el título en `es-MX` contiene caracteres fuera del alfabeto latino, se pide la película en `en-US` y se usa ese título si es legible. La detección usa Unicode scripts (`Latin`, `Common`, `Inherited`), así que acentos, `ñ`, apóstrofes y signos pasan sin cambio.

## Alternativas consideradas
- **Usar siempre `original_title`:** empeora el caso (es justo el título ilegible).
- **Buscar siempre en inglés:** perdería los títulos en español que sí existen ("Días extraños").

## Consecuencias
- **Positivas:** títulos legibles en el buscador, en las solicitudes y en `/peliculas-solicitadas`.
- **Negativas / riesgos:** una llamada extra a TMDB por cada resultado con título no latino. Solicitudes guardadas antes de este cambio conservan su título original.
