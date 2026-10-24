# Estado de la aplicación

Foto actual de Cineclub Forever: qué hay, qué está en curso y qué está pendiente. Se actualiza cada vez que algo de aquí cambia (película nueva, ciclo nuevo, feature, integración, pendiente resuelto).

- **Qué hace un feature:** `specs/`
- **Por qué se decidió algo:** `docs/adr/`
- **Cómo está todo hoy:** este archivo

**Última actualización:** 2026-10-23

## En producción
- **Sitio:** https://cineclub-forever.vercel.app (deploy automático de Vercel al hacer push a `main`).
- **Stack:** Next.js 16 (App Router), React 19, Firebase 11 (Auth + Firestore), TMDB API.
- **Videos:** hospedados en `mcseguros.com.mx/cineclub/`. Subtítulos `.vtt` en `public/subtitles/`.

## Catálogo
- **11 películas** en `src/lib/subtitles/index.jsx`, una por cada video que hay en el servidor (`mcseguros.com.mx/cineclub/`): `miasma`, `los-domingos`, `strange-days`, `another-earth`, `las-horas-perdidas`, `possession`, `cronologia-del-agua`, `together`, `the-drama`, `devil`, `the-wild-boys`.
- **Regla:** el catálogo solo lista películas cuyo video está en el servidor. Si se baja un video, se quita su entrada; si se vuelve a subir, se agrega de nuevo.
- **Más reciente:** *Adolescencia, sexo y muerte en Campamento Miasma* (2026), propuesta por Luis.
- **Retiradas el 2026-10-23** porque su video ya no estaba en el servidor: *Después de hora*, *No estarás sola*, *Pillion*, *Si pudiera te daría una patada*, *Sirāt*, *Atrapado robando*, *The Shrouds*. Sus `.vtt` siguen en `public/subtitles/` por si se vuelven a subir.

## Ciclos
| Ciclo | Películas | Nota |
|---|---|---|
| **Terror - Halloween** | 1 | **Ciclo actual** (bloque escrito a mano en `src/app/page.js`; solo lista a Luis como proponente) |
| Libre | 6 | |
| Snob | 3 | Ciclo actual anterior |
| Teens | 1 | |

Los ciclos se derivan del catálogo (`getCiclos()` en `src/lib/ciclos/ciclosData.js`); la descripción de cada uno vive en ese mismo archivo.

## Secciones del sitio
| Ruta | Qué es |
|---|---|
| `/` | Película destacada (la primera del catálogo), ciclo actual y cartelera |
| `/peliculas-detalle/[slug]` | Reproductor con subtítulos, créditos, comentarios y "visto por" |
| `/ciclos`, `/ciclos/[slug]` | Hub de ciclos |
| `/premiadas`, `/premiadas/[slug]` | Ganadoras de festivales: Cannes 2026, Venecia 2026 (ADR-0004) |
| `/posibles-peliculas` | Candidatas 2024–2026 ya disponibles en YTS, por categoría (`src/lib/posibles/posibles.js`) |
| `/solicitar-pelicula` | Búsqueda en TMDB para pedir películas (ADR-0002) |
| `/peliculas-solicitadas` | Solicitudes agrupadas por `tmdb_id` con votos; los admins pueden borrar (ADR-0003, ADR-0005) |
| `/reviews`, `/reviews/[slug]` | Reviews publicadas |
| `/subir-reviews` | Dashboard de reviews (solo admins) |
| `/profile`, `/login` | Perfil y acceso (Google o correo) |
| `/api/tmdb-search` | Proxy de búsqueda en TMDB |

**Colecciones de Firestore:** `reviews`, `comments`, `movie_requests`, `movie_votes`, `watched`, `admins`.

## Integraciones
- **TMDB:** metadatos en `es-MX` (`NEXT_PUBLIC_TMDB_API_KEY`).
- **Firebase:** Auth y Firestore (`src/components/FirebaseSettings.js`).
- **Instagram (@cineclub_forever):** publicación por API desde scripts locales (ADR-0007).
  - **Credenciales:** `IG_ACCESS_TOKEN` e `IG_USER_ID` en `.env.local`.
  - **Vencimiento del token:** **vence ~2026-12-22**; renovar antes.
  - **Imágenes:** en `public/instagram/`.
  - **Publicado:** *Campamento Miasma*, post y historia (2026-10-23).
  - **Historias:** la API solo sube la imagen (9:16); no permite compartir el post ni stickers de link.
  - **Estilo de los textos:** opinión personal corta de Luis, sin tono de anuncio, con hashtags al final.

## Pendientes
- [ ] Renovar el token de Instagram antes del 2026-12-22.
- [ ] Mover el script de publicación de Instagram al repo (con renovación de token).
- [ ] Definir quién propone en el ciclo Terror - Halloween (hoy solo aparece Luis en el inicio).
- [ ] Implementar el spec `specs/borrar-mis-solicitudes.md` (los usuarios aún no pueden borrar sus propias solicitudes; solo los admins).
- [ ] Hacer dinámico el bloque "Ciclo actual" del inicio (hoy se edita a mano en `src/app/page.js`).
