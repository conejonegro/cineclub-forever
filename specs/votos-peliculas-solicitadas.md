# Votos en Películas Solicitadas

## Problema
Los miembros del cineclub no tienen forma de expresar qué películas solicitadas les interesan más, lo que dificulta priorizar la programación futura basándose en el interés real del club.

## Usuarios afectados
- **Miembro autenticado**: puede votar una vez por cada película solicitada para indicar su interés.
- **Visitante no autenticado**: ve la página y el conteo de votos, pero no puede votar.
- **Administrador**: ve la misma interfaz de votación que cualquier miembro autenticado, más sus controles existentes (lista de solicitantes, botón borrar).

## User Stories

- Como miembro autenticado, quiero votar por una película solicitada con un solo clic, para que el cineclub sepa cuáles películas generan más interés.
- Como miembro autenticado, quiero ver claramente si ya voté por una película, para no intentar votar dos veces.
- Como visitante o miembro, quiero ver cuántos votos tiene cada película, para entender qué tan popular es entre el club.

## Criterios de aceptación

- [ ] Un usuario autenticado ve un botón "Votar" en cada tarjeta de película solicitada.
- [ ] Al presionar "Votar", el documento `{movie_key}__{user_email}` se crea en la colección `movie_votes` con los campos `movie_key`, `user_email` y `voted_at` (timestamp del servidor).
- [ ] El botón cambia a "Votado ✓" de forma inmediata (optimistic update) tras votar, sin esperar confirmación de Firestore.
- [ ] El botón "Votado ✓" aparece deshabilitado y con estilo visual distinto (por ejemplo, texto verde o gris) para indicar que el voto ya fue registrado.
- [ ] Al cargar la página con un usuario autenticado, se consulta `movie_votes` filtrando por `user_email == user.email` y se construye un Set de `movie_key` votados; ese Set determina el estado inicial de cada botón.
- [ ] El conteo de votos totales por película se calcula en cliente agrupando todos los documentos de `movie_votes` por `movie_key`. Esta query se ejecuta en paralelo con la query de `movie_requests`.
- [ ] El conteo de votos se muestra dentro de cada tarjeta, visualmente separado del conteo de solicitudes (no mezclado en el mismo texto).
- [ ] Un usuario no autenticado no ve el botón de votar en ninguna tarjeta.
- [ ] No es posible votar dos veces por la misma película: si el documento compuesto ya existe, `setDoc` es idempotente y el botón ya aparece deshabilitado desde la carga inicial.
- [ ] El formulario de solicitud de películas y la estructura de `movie_requests` no se modifican.
- [ ] Todas las variables del código nuevo usan nombres descriptivos (nunca de una sola letra).

## Fuera de alcance

- Cancelar o deshacer un voto ya emitido.
- Ordenar la lista por número de votos (el orden actual por solicitudes se mantiene).
- Notificaciones al administrador cuando una película acumula votos.
- Reglas de seguridad de Firestore para la colección `movie_votes` (se asume que ya existe una política permisiva para usuarios autenticados o que el equipo las configura por separado).
- Mostrar quiénes votaron (solo se muestra el conteo).

## Notas técnicas

**Archivo afectado:** `src/app/peliculas-solicitadas/page.jsx` — único archivo a modificar.

**Nueva colección Firestore:** `movie_votes`
- ID del documento: `{movie_key}__{user_email}` (compuesto, evita duplicados a nivel de base de datos).
- Campos: `movie_key: string`, `user_email: string`, `voted_at: serverTimestamp()`.
- `movie_key` se normaliza igual que en `movie_requests`: `title.trim().toLowerCase()`.

**Imports adicionales necesarios:** `setDoc`, `serverTimestamp` de `firebase/firestore`.

**Flujo de carga de datos (paralelo):**
```
Promise.all([
  getDocs(collection(db, "movie_requests")),  // ya existente
  getDocs(collection(db, "movie_votes"))       // nuevo
])
```
Ambas queries se resuelven juntas antes de construir el estado `grouped`. Los votos del usuario se filtran en cliente desde el resultado de `movie_votes` usando `user.email`.

**Estado nuevo en el componente:**
- `votedMovieKeys` — `Set<string>` con los `movie_key` que el usuario ya votó. Se inicializa en `fetchRequests` si hay usuario autenticado.
- `voteCountsByKey` — `Object<string, number>` con el total de votos por `movie_key`, calculado agrupando todos los docs de `movie_votes`.

**Función `handleVote(movieKey)`:**
1. Construye el ID compuesto.
2. Actualiza `votedMovieKeys` de forma optimista (spread del Set + movieKey).
3. Llama `setDoc` con `{ movie_key, user_email, voted_at: serverTimestamp() }`.

**Posición visual del conteo de votos:** debajo del conteo de solicitudes, en la misma columna de texto de la tarjeta. Ejemplo de jerarquía dentro de `<div className="flex-1">`:
1. Título
2. Rating TMDB
3. N solicitudes
4. N votos del club ← nuevo
5. Lista de solicitantes (solo admin)

**Botón de votar:** se coloca a la derecha de la tarjeta, al lado del botón "Borrar" (solo admin). Para usuarios no admin, ocupa ese mismo espacio alineado a la derecha.
