# ADR-0002: TMDB en lugar de YTS como buscador de solicitudes

- **Estado:** Aceptado
- **Fecha:** 2026-10-07

## Contexto
El formulario de `/solicitar-pelicula` buscaba películas en la API de YTS (`/api/yts-search`). Eso limitaba las solicitudes a lo que YTS tuviera, obligaba a buscar con el título original en inglés y mostraba un badge de "Disponible en YTS" que no aportaba: el admin busca y consigue las películas por su cuenta. El resto del sitio ya usaba TMDB para metadata.

## Decisión
Buscar en TMDB (`/search/movie`, `language=es-MX`) a través de la ruta de servidor `/api/tmdb-search`. Cada solicitud guarda `tmdb_id`, `movie_title`, `original_title`, `year` y `poster_path`. La misma ruta acepta `?id=` para traer una película específica (lo usa `/solicitar-pelicula?tmdb=ID`, por ejemplo desde Premiadas).

Se eliminó `/api/yts-search` y todo rastro de YTS en la UI. Se conserva "Solicitar de todas formas" para lo que no esté en TMDB.

## Alternativas consideradas
- **Conservar YTS como chequeo de disponibilidad (solo admin):** descartado; el admin consigue las películas por fuera.
- **Llamar a TMDB directo desde el cliente:** descartado; la ruta de servidor centraliza la llamada y el formato de respuesta.

## Consecuencias
- **Positivas:** catálogo completo, búsqueda en español, pósters y datos consistentes con el resto del sitio.
- **Negativas / riesgos:** el título guardado es el que TMDB tenga en `es-MX`, que para algunas películas sin traducción es el original (japonés, coreano, etc.).
