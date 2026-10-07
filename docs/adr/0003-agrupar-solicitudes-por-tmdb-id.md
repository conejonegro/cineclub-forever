# ADR-0003: Agrupar solicitudes por `tmdb_id` sin migrar datos viejos

- **Estado:** Aceptado
- **Fecha:** 2026-10-07

## Contexto
`/peliculas-solicitadas` agrupaba las solicitudes de `movie_requests` por título en minúsculas y luego buscaba cada título en TMDB tomando el primer resultado. Eso partía la misma película en varias tarjetas ("The Matrix" vs "Matrix") y a veces mostraba el póster equivocado. Los votos (`movie_votes`) usan `movie_key` = título en minúsculas.

Con ADR-0002 las solicitudes nuevas traen `tmdb_id`, pero las viejas no, y no se quería perder ninguna solicitud ni voto.

## Decisión
Agrupar por `tmdb_id` **en lectura**, sin tocar Firestore:

- Solicitudes nuevas: key `tmdb-<id>`, con título y póster guardados.
- Solicitudes viejas: se resuelven en TMDB por título (primer resultado) y se juntan con el grupo de ese `tmdb_id`; si no hay match, se agrupan por título como antes.
- Votos: cada grupo suma los votos de su key nueva más los votos viejos de cualquiera de sus títulos. Si el usuario ya votó con una key vieja, cuenta como ya votado. Los votos nuevos se guardan con la key del grupo.

## Alternativas consideradas
- **Script de migración en Firestore:** más limpio a largo plazo, pero riesgoso y sin forma fácil de revisar los matches de TMDB antes de escribirlos.
- **Seguir agrupando por título:** no resuelve duplicados ni pósters equivocados.

## Consecuencias
- **Positivas:** no se borra ni migra nada; viejas y nuevas conviven en una sola tarjeta.
- **Negativas / riesgos:** las solicitudes viejas siguen dependiendo de que el primer resultado de TMDB sea el correcto, y la página hace una búsqueda a TMDB por cada título viejo distinto en cada carga. Si en algún momento se migra, este ADR quedaría reemplazado.
