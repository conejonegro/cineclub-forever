# Borrar mis solicitudes

## Problema
Un usuario que solicitó una película no puede retirarla si cambia de opinión; la solicitud se queda ocupando uno de sus 5 lugares y sumando en `/peliculas-solicitadas`.

## Usuarios afectados
Miembro del cineclub con sesión iniciada.

## User Stories

- Como miembro, quiero quitar una película que solicité, para que ya no aparezca si dejé de querer verla.
- Como miembro, quiero liberar un lugar de mis 5 solicitudes, para poder pedir otra película.

## Criterios de aceptación

- [ ] En "Mis solicitudes" del perfil (`src/components/MisSolicitudes.jsx`), cada solicitud tiene un botón ✕.
- [ ] Al darle clic pide confirmación ("¿Quitar tu solicitud de X?") y, si acepta, borra el documento de `movie_requests` y lo quita de la lista.
- [ ] Solo se pueden borrar solicitudes propias; un usuario no puede borrar solicitudes de otros aunque llame a Firestore directamente.
- [ ] Después de borrar, el contador baja (ej. "3 de 5") y el usuario puede volver a solicitar.
- [ ] Si otros usuarios pidieron la misma película, su tarjeta sigue en `/peliculas-solicitadas` con sus votos.

## Fuera de alcance
- Borrar los votos (`movie_votes`) asociados: quedan huérfanos pero no se muestran, y regresan si alguien vuelve a pedir la película.
- Editar una solicitud (cambiar la película).

## Notas técnicas
- Mismo patrón que `handleDelete` del admin en `src/app/peliculas-solicitadas/page.jsx` (`deleteDoc`).
- **Reglas de Firestore** (viven en la consola de Firebase, no en el repo): revisar las actuales antes de implementar. La regla esperada para `movie_requests`:

  ```
  allow delete: if request.auth != null
    && (request.auth.token.email.lower() == resource.data.email
        || exists(/databases/$(database)/documents/admins/$(request.auth.token.email.lower())));
  ```

  (`email` se guarda en minúsculas al crear la solicitud; la colección `admins` usa el correo como ID.)

## Preguntas abiertas
- ¿Cómo están hoy las reglas de Firestore de `movie_requests`? Si son abiertas, cualquier usuario ya puede borrar solicitudes ajenas; conviene cerrarlas aunque no se implemente este feature.
