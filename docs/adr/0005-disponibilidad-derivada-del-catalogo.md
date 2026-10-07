# ADR-0005: El estado "disponible" se deriva del catálogo, no se guarda

- **Estado:** Aceptado
- **Fecha:** 2026-10-07

## Contexto
Cuando una película solicitada se sube al catálogo, quien la pidió no se enteraba y la solicitud seguía apareciendo como pendiente. Queríamos marcarla como disponible en `/peliculas-solicitadas`, en el perfil ("Mis solicitudes"), en Premiadas y en el formulario de solicitud.

Las solicitudes guardan `tmdb_id` (ADR-0002) y cada película del catálogo (`src/lib/subtitles/index.jsx`) tiene `tmdb_ID` y su slug (`name`).

## Decisión
Calcular la disponibilidad al leer, cruzando el `tmdb_id` contra el catálogo con `getCatalogSlug(tmdbId)` en `src/lib/catalogo.js`, que regresa el slug para `/peliculas-detalle/[slug]` o `null`. No se agrega ningún campo de estado en Firestore.

- `/peliculas-solicitadas`: las disponibles salen del ranking y pasan a la sección "Ya están en el catálogo" con "Ver ahora".
- Perfil: "Mis solicitudes" (`src/components/MisSolicitudes.jsx`) marca cuáles ya están disponibles.
- Premiadas: "Solicitarla" se vuelve "Verla ahora".
- Formulario: si la película elegida ya está en el catálogo, se bloquea el envío y se ofrece verla.

## Alternativas consideradas
- **Guardar un campo `status` en cada solicitud y actualizarlo al subir la película:** requiere un paso manual extra (o un panel de admin) cada vez que se agrega una película, y se puede desincronizar.

## Consecuencias
- **Positivas:** agregar la película al catálogo basta para que todo se actualice solo; cero cambios en Firestore.
- **Negativas / riesgos:** depende de que el `tmdb_ID` del catálogo sea el mismo que eligió quien solicitó. Las solicitudes viejas (solo título) dependen del match por título de ADR-0003. No hay notificación activa (correo/push); el usuario lo ve al entrar a su perfil.
