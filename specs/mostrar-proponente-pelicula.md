# Mostrar proponente de película

## Problema
Las tarjetas de película en la página principal no muestran quién propuso cada film. Este dato ya existe en `src/lib/subtitles/index.jsx` bajo el campo `propuestaPor`, pero no llega a la UI. Para un club de cine, saber quién recomendó una película es parte central de la experiencia: personaliza el catálogo y genera conversación entre los miembros.

## Usuarios afectados
Todos los visitantes de la página principal — miembros del Cineclub Forever que navegan el catálogo.

## User Stories
- Como miembro del cineclub, quiero ver quién propuso cada película en la tarjeta, para saber a quién preguntarle sobre ella antes de verla.
- Como visitante nuevo, quiero identificar de un vistazo el origen de cada recomendación, para entender que el catálogo es curado por personas reales.

## Criterios de aceptación
- [ ] Cada tarjeta de película en la página principal muestra "Propuesta por [nombre]".
- [ ] El texto es legible y visualmente secundario respecto al título.
- [ ] La página de detalle de cada película también muestra "Propuesta por [nombre]".
- [ ] Si `propuestaPor` estuviera vacío, no se muestra el campo en ninguna de las dos vistas.
- [ ] El dato se muestra en todas las tarjetas del grid, sin importar el ciclo.

## Fuera de alcance
- Filtrar o agrupar películas por proponente.
- Cambiar el diseño general de la tarjeta más allá de agregar este campo.
- Modificar el campo `propuestaPor` desde la UI (es dato estático en código).

## Notas técnicas

**Campo fuente:** `propuestaPor` en cada objeto del array dentro de `src/lib/subtitles/index.jsx`.

**Flujo del dato hoy:**
1. `Subtitles()` devuelve el array con `propuestaPor` incluido.
2. `TMDBApiCall(moviesData)` recibe ese array pero en `src/lib/TMBDApiCall.jsx` solo mapea campos de la respuesta TMDB — `propuestaPor` se pierde aquí porque el `postDataFormated` no lo incluye.
3. `page.js` renderiza `posts` (resultado de TMDB) que ya no contiene `propuestaPor`.

**Lo que hay que cambiar:**

1. **`src/lib/TMBDApiCall.jsx`** — en el `map` de `postDataFormated`, cruzar el índice con `dataArray` para rescatar `propuestaPor`:
   ```js
   const postDataFormated = postData?.map((post, index) => ({
     // ...campos actuales...
     propuestaPor: dataArray[index].propuestaPor,
   }));
   ```

2. **`src/app/page.js`** — dentro del bloque `<div className="p-4">` de cada tarjeta, agregar después de la sinopsis:
   ```jsx
   {movie.propuestaPor && (
     <p className="mt-2 text-xs text-gray-500">
       Propuesta por {movie.propuestaPor}
     </p>
   )}
   ```

3. **`src/app/peliculas-detalle/[slug]/page.jsx`** — la página de detalle ya tiene acceso al objeto local de subtítulos (por slug). Agregar el campo `propuestaPor` desde ese objeto local, no desde TMDB.

**No existe un componente separado de tarjeta** — el JSX de la tarjeta está inline en `src/app/page.js`. No es necesario extraerlo como parte de este feature.

## Decisiones tomadas
- Copy: "Propuesta por [nombre]"
- Alcance: página principal + página de detalle

## Preguntas abiertas
Ninguna.
