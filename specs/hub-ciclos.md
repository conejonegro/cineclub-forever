# Hub de Ciclos

## Problema
Las películas del catálogo están organizadas en ciclos (Snob, Libre, Teens...) a través del campo `ciclo` en `src/lib/subtitles/index.jsx`, pero hoy ese dato es casi invisible: solo aparece como una etiqueta suelta en cada tarjeta de la home. No hay forma de navegar el sitio "por ciclo" ni de leer el criterio editorial detrás de cada uno. Los miembros no tienen dónde entender qué es cada ciclo ni ver de un vistazo todas las películas que pertenecen a él.

## Usuarios afectados
Todos los visitantes del sitio — miembros del cineclub y visitantes nuevos que quieren explorar el catálogo por ciclo en vez de solo por el grid general de la home.

## User Stories
- Como visitante, quiero ver un listado de los ciclos existentes desde la navegación principal, para descubrir cómo está organizado el catálogo.
- Como visitante, quiero entrar a la página de un ciclo específico y leer su descripción editorial, para entender el criterio o la broma detrás de ese ciclo.
- Como visitante, quiero ver todas las películas de un ciclo en su página, para explorarlas y llegar a su detalle con un clic.
- Como miembro del cineclub, quiero que agregar un ciclo nuevo (ej. "Teens") sea tan simple como escribir su descripción, para no depender de trabajo técnico extra cada vez que arranca un ciclo.

## Criterios de aceptación

**Navegación**
- [ ] El nav principal (`src/components/NavComponent.js`) incluye un ítem "Ciclos", visible para todos los visitantes (con o sin sesión iniciada), posicionado como primer ítem del nav (antes de "Reviews").
- [ ] En desktop, "Ciclos" es un texto-link a `/ciclos` acompañado de un control (ej. chevron) que despliega un dropdown con la lista de ciclos existentes; cada uno enlaza a `/ciclos/[slug]`.
- [ ] El dropdown se cierra al hacer clic fuera de él o al seleccionar un ciclo.
- [ ] En el menú móvil, "Ciclos" aparece como un ítem plano más que enlaza a `/ciclos` (sin desplegar sub-ítems, siguiendo el patrón plano ya usado en el menú móvil actual).
- [ ] La lista de ciclos que aparece en el dropdown y en el índice se deriva dinámicamente del campo `ciclo` de `src/lib/subtitles/index.jsx` — si mañana se agrega una película con un ciclo nuevo (ej. "Cyberpunk"), aparece automáticamente sin tocar el nav.

**Página índice `/ciclos`**
- [ ] Existe la ruta `/ciclos` (`src/app/ciclos/page.jsx`) que muestra una tarjeta por cada ciclo existente, con su nombre y el número de películas que contiene.
- [ ] Si un ciclo tiene descripción editorial cargada, la tarjeta muestra un extracto corto de la descripción; si no la tiene, la tarjeta se muestra igual (solo con nombre y conteo), sin texto placeholder de error.
- [ ] Cada tarjeta enlaza a `/ciclos/[slug]`.

**Página de detalle `/ciclos/[slug]`**
- [ ] Existe la ruta `/ciclos/[slug]` (`src/app/ciclos/[slug]/page.jsx`) que muestra: nombre del ciclo, su descripción editorial (si existe) y el grid de películas que pertenecen a ese ciclo.
- [ ] Si el ciclo no tiene descripción cargada todavía, la página se muestra igual (nombre + grid de películas), sin renderizar el bloque de descripción ni un mensaje de error.
- [ ] Cada película del grid enlaza a `/peliculas-detalle/[slug]` y reutiliza el estilo visual de póster ya usado en el grid de la home (`src/app/page.js`).
- [ ] Si el slug no corresponde a ningún ciclo existente, la página responde 404 (`notFound()` de `next/navigation`).
- [ ] Las películas mostradas son exactamente las que tienen ese `ciclo` en `src/lib/subtitles/index.jsx` — ninguna fuente de datos paralela.

**Datos**
- [ ] Existe `src/lib/ciclos/ciclosData.js` con un mapeo simple `nombre del ciclo -> descripción editorial`. Solo "Snob" tiene descripción al lanzar este feature; "Libre" y "Teens" quedan sin descripción hasta que alguien la escriba.
- [ ] Agregar la descripción de un ciclo nuevo (ej. "Libre") requiere únicamente añadir una entrada a ese mapeo — no requiere tocar rutas, nav, ni lógica de filtrado.

## Fuera de alcance
- No se reconcilian ni se reutilizan los archivos viejos `src/lib/ciclos/Ciclos.js`, `CicloTeens.jsx` ni `cicloMexicanas.js`. Quedan sin tocar y sin ninguna relación con este feature — su formato está desincronizado del catálogo real y no deben usarse como referencia ni como fuente de datos.
- No se escriben las descripciones editoriales de "Libre" ni "Teens" en este momento (fuera del criterio de aceptación de tener el mecanismo listo para cuando alguien las redacte).
- No se modifica el bloque "Ciclo actual" que ya existe en la home (`src/app/page.js`), ni se sincroniza con los datos de `ciclosData.js`.
- No se convierte en link el badge "Ciclo {movie.ciclo}" que ya aparece en las tarjetas de la home ni en la página de detalle de película — sigue siendo texto plano.
- No hay filtros, orden ni búsqueda dentro de la página de un ciclo — se muestran todas las películas del ciclo en el orden en que aparecen en el array de `Subtitles()`.
- No hay administración de ciclos/descripciones desde un panel — es texto estático en código, igual que el resto del catálogo.
- No se agrupan ciclos por categoría ni jerarquía (ej. "ciclo activo" vs "ciclos pasados") — todos los ciclos se listan igual.

## Notas técnicas

**Fuente de verdad:** el campo `ciclo` en cada entrada de `src/lib/subtitles/index.jsx`. Ya viaja hasta el frontend porque `TMDBApiCall` (en `src/lib/TMBDApiCall.jsx`) ya incluye `ciclo` en `postDataFormated` (línea `ciclo: localMap.get(String(post.id))?.ciclo ?? ""`). No es necesario tocar `TMBDApiCall.jsx`.

**Slug del ciclo:** se genera con una función `slugify` propia dentro de `src/lib/ciclos/ciclosData.js`, con la misma normalización que ya usa `TMBDApiCall.jsx` (minúsculas, sin acentos, espacios a guiones). Se decidió **duplicar** esta función pequeña en vez de exportarla desde `TMBDApiCall.jsx`, para no tocar ese archivo por una feature que no lo necesita. Con los nombres actuales ("Snob", "Libre", "Teens") el resultado es directo: `snob`, `libre`, `teens`.

**Archivo nuevo `src/lib/ciclos/ciclosData.js`:**
```js
const descripciones = {
  Snob: "texto editorial del ciclo Snob...",
  // Libre: "...",
  // Teens: "...",
};

function slugify(str) { /* misma lógica que TMBDApiCall.jsx */ }

// Deriva la lista de ciclos existentes a partir del catálogo real,
// en el orden en que aparecen por primera vez en Subtitles().
export function getCiclos() {
  const movies = Subtitles();
  const nombres = [];
  movies.forEach((m) => {
    if (m.ciclo && !nombres.includes(m.ciclo)) nombres.push(m.ciclo);
  });

  return nombres.map((nombre) => ({
    nombre,
    slug: slugify(nombre),
    descripcion: descripciones[nombre] ?? "",
    totalPeliculas: movies.filter((m) => m.ciclo === nombre).length,
  }));
}
```
`getCiclos()` solo depende de `Subtitles()` (array local, síncrono) — no llama a TMDB. Por eso puede usarse tanto en `NavComponent.js` (client component) como en las páginas server de `/ciclos` sin necesidad de fetch adicional ni estado de carga.

**`src/components/NavComponent.js`** (client component ya existente):
- Importar `getCiclos` y llamarlo para obtener la lista de ciclos.
- Agregar estado local (ej. `ciclosOpen`) para controlar el dropdown de desktop, con cierre al hacer clic fuera.
- Agregar `{ text: "Ciclos", item_url: "/ciclos" }` al inicio del array que alimenta el menú móvil plano (`navItems`/`allLinks`).

**`src/app/ciclos/page.jsx`** (server component, nuevo):
- Usa `getCiclos()` para listar tarjetas de ciclo (nombre, conteo, extracto de descripción si existe).

**`src/app/ciclos/[slug]/page.jsx`** (server component, nuevo, mismo patrón que `src/app/peliculas-detalle/[slug]/page.jsx`):
```js
const ciclos = getCiclos();
const ciclo = ciclos.find((c) => c.slug === slug);
if (!ciclo) notFound();

const moviesData = Subtitles();
const posts = await TMDBApiCall(moviesData);
const peliculasDelCiclo = posts.filter((p) => p.ciclo === ciclo.nombre);
```
- Puede incluir `generateMetadata` con el nombre del ciclo, siguiendo el mismo patrón que `peliculas-detalle/[slug]/page.jsx`.
- El grid de películas reutiliza (duplicando el JSX, no extrayendo un componente compartido — sigue la convención actual del repo donde `src/app/page.js` también tiene su grid inline) el estilo de tarjeta de póster: imagen, título, género, "Propuesta por" si existe.

## Preguntas abiertas
Ninguna. Las decisiones de estructura de rutas, generación de slug, integración en el nav y reutilización de estilos quedan resueltas arriba.
