# Solicitar Película

## Problema
Los miembros del cineclub no tienen una forma de proponer películas para sesiones futuras. Esto hace que las sugerencias se pierdan en conversaciones informales y que no haya visibilidad de qué películas interesan al grupo.

## Usuarios afectados
- **Visitante / miembro del cineclub**: quiere proponer una película y ver qué otros han propuesto.
- **Administrador**: puede ver el historial de solicitudes para planear los ciclos.

## User Stories

- Como visitante, quiero llenar un formulario rápido con mi nombre, correo y la película que propongo, para que el cineclub considere mi sugerencia.
- Como visitante, quiero ver la página de películas solicitadas, para saber qué películas ya han pedido otros y cuántas veces.
- Como miembro del cineclub, quiero ver el conteo de solicitudes por película, para hacerme una idea del interés general del grupo.

---

## Fase 1 — Formulario + Escritura en Firestore

### Criterios de aceptación

- [ ] El array `navItems` en `src/components/NavComponent.js` incluye dos nuevas entradas después de "Reviews":
  - `{ text: "Solicitar película", item_url: "/solicitar-pelicula" }`
  - `{ text: "Películas solicitadas", item_url: "/peliculas-solicitadas" }`
- [ ] Existe la ruta `/solicitar-pelicula` como página dedicada (`src/app/solicitar-pelicula/page.jsx`).
- [ ] La página muestra un formulario con tres campos: **Nombre**, **Correo electrónico** y **Película que propones**.
- [ ] Los tres campos son requeridos. El campo de correo valida formato básico de email en el cliente.
- [ ] Al enviar el formulario con datos válidos, se escribe un documento nuevo en la colección `movie_requests` de Firestore con la siguiente estructura:
  ```
  {
    name: string,
    email: string,
    movie_title: string,
    created_at: Timestamp  // serverTimestamp()
  }
  ```
- [ ] Después del envío exitoso, el formulario muestra un mensaje de confirmación ("Tu solicitud fue enviada") y los campos se limpian.
- [ ] Si el envío falla, se muestra un mensaje de error genérico al usuario ("Ocurrió un error. Intenta de nuevo.").
- [ ] El formulario es accesible para cualquier visitante, sin necesidad de iniciar sesión.

### Fuera de alcance (Fase 1)
- No se agrupan ni muestran las solicitudes todavía (la ruta `/peliculas-solicitadas` existe en el nav pero queda como placeholder hasta Fase 2).
- No se envía ningún correo de confirmación al solicitante.
- No hay validación de duplicados (un usuario puede pedir la misma película varias veces).

### Notas técnicas

**Archivos a tocar:**
- `src/components/NavComponent.js` — agregar al array `navItems` (actualmente solo contiene `{ text: "Reviews", item_url: "/reviews" }`):
  ```js
  { text: "Solicitar película", item_url: "/solicitar-pelicula" },
  { text: "Películas solicitadas", item_url: "/peliculas-solicitadas" },
  ```

**Archivos a crear:**
- `src/app/solicitar-pelicula/page.jsx` — Client Component con el formulario. Usa `addDoc` y `serverTimestamp` del SDK de Firebase (`src/components/FirebaseSettings.js` ya inicializa la app).

**Firestore:**
- La colección `movie_requests` se crea automáticamente al primer envío; no requiere configuración previa en Firestore.
- Importaciones necesarias: `addDoc`, `collection`, `serverTimestamp` desde `firebase/firestore`.

---

## Fase 2 — Página pública `/peliculas-solicitadas` (pendiente)

> Esta fase no forma parte del alcance actual. Se documenta aquí como referencia para la siguiente iteración.

### Criterios de aceptación (Fase 2)

- [ ] La página `/peliculas-solicitadas` muestra todas las películas solicitadas, agrupadas por título (case-insensitive).
- [ ] Cada entrada muestra: título de la película y el número de veces que ha sido solicitada (ej. "3 solicitudes").
- [ ] La lista está ordenada de mayor a menor número de solicitudes.
- [ ] Si no hay solicitudes, se muestra el estado vacío: "Aún no hay solicitudes. ¡Sé el primero en pedir una película!".
- [ ] No se muestran nombres ni correos de los solicitantes (privacidad).

### Fuera de alcance (Fase 2)
- No hay paginación ni búsqueda.
- No hay gestión ni moderación desde el panel de admin.

### Notas técnicas (Fase 2)
- Archivos a crear: `src/app/peliculas-solicitadas/page.jsx`.
- El agrupamiento puede hacerse en cliente con un `reduce` sobre los documentos, ordenando por conteo descendente.
- El link en el nav ya estará en su lugar desde Fase 1.

---

## Preguntas abiertas

_(Resueltas)_
1. ~~¿El link "Solicitar película" lleva a una página dedicada o abre un modal?~~ — Página dedicada `/solicitar-pelicula`.
2. ~~¿Arrancar con Fase 1 o implementar ambas juntas?~~ — Solo Fase 1 por ahora.
3. ~~¿Dónde vive el link de "Películas solicitadas" en el nav?~~ — En el nav principal, justo después de "Reviews".
