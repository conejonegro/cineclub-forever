# ADR-0007: Publicar en Instagram con la API de Instagram (Instagram Login)

- **Estado:** Aceptado
- **Fecha:** 2026-10-23

## Contexto
Queremos anunciar en la cuenta @cineclub_forever las películas que entran al catálogo, con un texto escrito desde Claude Code y sin tener que subirlo a mano desde el celular. La API de Instagram solo publica a partir de una **URL pública** de la imagen y acepta proporciones entre 4:5 y 1.91:1; los pósters de TMDB son 2:3 y no entran.

Meta ofrece dos configuraciones de la API: con inicio de sesión de Instagram o con inicio de sesión de Facebook (esta última exige una página de Facebook vinculada). Una app solo puede tener una de las dos.

## Decisión
- La app de Meta ("Cineclub forever - Dev") usa **API setup with Instagram login** con los permisos `instagram_business_basic` e `instagram_business_content_publish`, en acceso estándar (sin App Review), porque solo publica en la cuenta propia, que tiene rol de evaluador de Instagram.
- Las credenciales viven en `.env.local` como `IG_ACCESS_TOKEN` e `IG_USER_ID`, **sin** prefijo `NEXT_PUBLIC_`, para que nunca lleguen al navegador. No se usan desde la app web: solo desde scripts locales.
- La imagen del post se prepara en 4:5 (1080×1350) y se sirve desde el propio sitio en `public/instagram/`; se hace commit y push, se espera el deploy de Vercel y se publica con la URL `https://cineclub-forever.vercel.app/instagram/<archivo>.jpg`.
- Publicar es en dos pasos de la API: crear el contenedor (`POST /{ig-user-id}/media` con `image_url` y `caption`) y publicarlo (`POST /{ig-user-id}/media_publish`).
- Nada se publica sin que Luis apruebe la imagen y el texto.

## Alternativas consideradas
- **API setup with Facebook login:** requiere una página de Facebook vinculada y más permisos (`pages_*`, `business_management`); innecesario para publicar en una sola cuenta.
- **Usar directamente las URLs de imágenes de TMDB:** no requiere hosting, pero los pósters (2:3) quedan fuera del rango de proporción que acepta Instagram. Los backdrops (16:9) sí entran, pero no son la pieza que queremos de portada.
- **Hosting externo de imágenes (S3, CDN):** un servicio y credenciales más; el sitio en Vercel ya sirve archivos públicos.
- **Programadores de terceros (Later, Buffer, etc.):** más pasos manuales y otra cuenta que mantener.

## Consecuencias
- **Positivas:** se puede anunciar una película desde la misma sesión en que se agrega al catálogo; las imágenes quedan versionadas en el repo.
- **Negativas / riesgos:**
  - El token de larga duración vence a los ~60 días (el actual, alrededor del 2026-12-22) y hay que renovarlo con `GET https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token`.
  - Publicar depende de que el deploy de Vercel termine antes de crear el contenedor.
  - Límite de 100 publicaciones por API cada 24 horas.
  - Los links en el caption no son clickeables: el post manda a "link en bio".
  - El script de publicación aún no vive en el repo (se corrió como script de un solo uso).
