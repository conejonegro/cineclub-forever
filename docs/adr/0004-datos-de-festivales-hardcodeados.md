# ADR-0004: Datos de festivales en archivos locales; TMDB solo para medios

- **Estado:** Aceptado
- **Fecha:** 2026-10-07

## Contexto
La sección "Premiadas en Festivales" (`/premiadas`) muestra, por festival, el palmarés oficial y películas recomendadas fuera del palmarés. TMDB no tiene datos de premios, y para películas recientes a menudo regresa el título en el idioma original (japonés, coreano), el director en otro alfabeto (cirílico) y sin sinopsis en español.

## Decisión
- Cada festival es un archivo en `src/lib/premiadas/` (ej. `cannes2026.js`, `venecia2026.js`) con `tmdbId`, premio o sección, título, título alterno, director y nota opcional, escritos a mano.
- `src/lib/premiadas/festivales.js` registra los festivales (slug, ícono, textos) y es la única fuente para la página índice, la página dinámica `/premiadas/[slug]` y el desplegable del menú.
- De TMDB solo se toman póster, año y sinopsis, con `revalidate` de un día.
- Los `tmdbId` se verifican contra el director en TMDB antes de agregarlos.

## Alternativas consideradas
- **Guardar festivales en Firestore con un panel de admin:** más flexible, pero excesivo para algo que cambia unas pocas veces al año.
- **Tomar título y director de TMDB:** descartado por los problemas de idioma descritos arriba.

## Consecuencias
- **Positivas:** control total del contenido; agregar un festival es crear un archivo y registrarlo; el ícono se comparte entre ediciones del mismo festival (`icono` en `festivales.js`).
- **Negativas / riesgos:** agregar o corregir un festival requiere un deploy. Al solicitar una película desde Premiadas, el título guardado viene de TMDB, no de este archivo (ver riesgo en ADR-0002).
