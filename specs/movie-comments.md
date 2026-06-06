# Comentarios en Películas

## Problema

Los miembros del cineclub no tienen un lugar dentro de la página de cada película para dejar sus opiniones o reacciones después de verla. Sin esto, la conversación sucede por fuera de la plataforma y se pierde.

## Usuarios afectados

- **Miembro autenticado:** puede leer comentarios de otros y dejar el suyo.
- **Visitante no autenticado:** puede leer los comentarios existentes, pero no puede escribir uno.

## User Stories

- Como miembro autenticado, quiero escribir un comentario en la página de una película, para compartir mi opinión con el resto del cineclub.
- Como visitante, quiero leer los comentarios de otros miembros, para conocer las reacciones del grupo antes o después de ver la película.
- Como visitante no autenticado, quiero ver un mensaje claro que me invite a iniciar sesión, para saber por qué no puedo comentar.
- Como miembro autenticado, quiero ver mi comentario aparecer inmediatamente después de enviarlo, para tener confirmación de que se publicó correctamente.

## Criterios de aceptación

- [ ] La sección de comentarios aparece debajo del reproductor de video en `/peliculas-detalle/[slug]`.
- [ ] Al cargar la página, se muestran todos los comentarios existentes para esa película, ordenados del más reciente al más antiguo.
- [ ] Cada comentario muestra: nombre del usuario (o email como fallback si no hay displayName), contenido del comentario, y fecha relativa (ej. "hace 2 días").
- [ ] Si no hay comentarios, se muestra el mensaje "Sé el primero en comentar".
- [ ] Mientras se cargan los comentarios, se muestra un estado de carga visible (spinner o esqueleto).
- [ ] Si el usuario está autenticado, se muestra un formulario con un textarea y un botón de enviar.
- [ ] Si el usuario no está autenticado, en lugar del formulario se muestra el mensaje "Inicia sesión para comentar".
- [ ] El botón de enviar queda deshabilitado si el textarea está vacío o solo tiene espacios.
- [ ] Al enviar un comentario válido, este aparece inmediatamente al tope de la lista (adición optimista) sin necesidad de recargar la página.
- [ ] Al enviar un comentario válido, se muestra un toast de éxito usando `react-hot-toast`.
- [ ] El textarea queda vacío después de un envío exitoso.
- [ ] Los comentarios se guardan en Firestore en la colección `comments` con los campos: `movieSlug`, `userId`, `userEmail`, `userName`, `content`, `createdAt` (serverTimestamp).
- [ ] La carga de comentarios es una sola consulta al montar el componente (sin listener en tiempo real).

## Fuera de alcance

- Editar o eliminar comentarios desde la interfaz de usuario.
- Responder a comentarios (threading / hilos).
- Paginación o carga infinita de comentarios.
- Moderación o reporte de comentarios.
- Notificaciones cuando alguien comenta en una película.
- Implementación de reglas de seguridad de Firestore (solo se documentan).

## Notas técnicas

**Archivos nuevos:**
- `src/lib/getComments/comments.js` — dos funciones exportadas:
  - `fetchCommentsBySlug(slug)`: consulta la colección `comments` filtrando por `movieSlug == slug`, ordenada por `createdAt` desc. Convierte Timestamps a ISO string antes de retornar (mismo patrón que `convertFirestoreData` en `reviews.js`).
  - `createComment(slug, user, content)`: hace `addDoc` a la colección `comments` con `serverTimestamp()` en `createdAt`.
- `src/components/Comments.jsx` — componente cliente (`"use client"`). Recibe `movieSlug` como prop. Consume `UserContext` con `useContext`. Usa `react-hot-toast` para notificaciones. La fecha relativa se puede calcular con una función auxiliar sobre el campo `createdAt` (ya convertido a ISO string).

**Archivos modificados:**
- `src/app/peliculas-detalle/[slug]/page.jsx` — importar y renderizar `<Comments movieSlug={slug} />` después del bloque del video (`div.mb-16`), antes de la navegación prev/next. Como el page es un Server Component, `Comments` debe ser un Client Component independiente.

**Colección Firestore `comments`:**
```
{
  movieSlug: string,
  userId:    string,
  userEmail: string,
  userName:  string,   // user.displayName ?? user.email
  content:   string,
  createdAt: serverTimestamp
}
```

**Reglas de seguridad de Firestore (documentar, no implementar):**
```
match /comments/{commentId} {
  allow read: if true;
  allow create: if request.auth != null;
  allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
  allow update: if false;
}
```

**Consideraciones de estilo:** tema oscuro `bg-[#0d0d0d]`, acento `amber-400`, fuente Montserrat, consistente con el resto de la página de detalle.

## Preguntas abiertas

- ¿Se debe mostrar el avatar del usuario (foto de Google) junto a cada comentario, o solo el nombre?
- ¿Hay un límite de caracteres para el contenido del comentario? (sugerencia: 500 caracteres)
- ¿Los comentarios deben ser visibles para cualquier visitante en internet, o solo para miembros autenticados del cineclub?
