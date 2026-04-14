# Perfil: Foto de usuario y correo

## Problema

En la página de perfil (`/profile`), la foto del usuario no se muestra cuando el campo `photoURL` es `null` o vacío — situación que ocurre siempre para usuarios registrados con email/password, ya que Firebase no asigna foto automáticamente. En lugar de mostrar un avatar de respaldo, la sección de foto desaparece completamente. Adicionalmente, aunque el correo se renderiza en el código, existe riesgo de que aparezca vacío si `email` no está disponible en el objeto de usuario.

## Usuarios afectados

Todos los usuarios registrados con email/password (no Google OAuth). Potencialmente también usuarios de Google que hayan eliminado o privado su foto de perfil.

## User Stories

- Como usuario registrado con email y contraseña, quiero ver un avatar genérico en mi perfil cuando no tengo foto, para que la página no se vea rota o incompleta.
- Como usuario de Google OAuth, quiero ver mi foto de perfil de Google en la página de perfil, para reconocer que es mi cuenta.
- Como cualquier usuario autenticado, quiero ver mi correo electrónico en la página de perfil, para confirmar con qué cuenta inicié sesión.

## Criterios de aceptación

- [ ] Si `userData.photoURL` tiene valor, se muestra esa imagen como avatar circular (comportamiento actual que debe preservarse).
- [ ] Si `userData.photoURL` es `null`, vacío o indefinido, se muestra un ícono genérico de `react-icons` en el mismo lugar y con el mismo estilo circular.
- [ ] Si `userData.displayName` es `null` o indefinido, se muestra el texto "Usuario" como fallback.
- [ ] El correo electrónico (`userData.email`) se muestra siempre que el usuario esté autenticado. Si por alguna razón `email` fuera `null`, se muestra el texto "Sin correo registrado" en lugar de dejarlo vacío.
- [ ] El comportamiento es consistente para ambos métodos de autenticación: Google OAuth y email/password.

## Fuera de alcance

- Permitir que el usuario suba o cambie su foto de perfil desde la plataforma.
- Edición de nombre, correo u otros datos del perfil.
- Validación o sincronización del perfil con Firestore.
- Cambio de contraseña desde el perfil.

## Notas técnicas

**Archivo a modificar:** `src/app/profile/page.jsx`

**Datos disponibles en `UserContext` (objeto `firebaseUser` de Firebase):**
- `user.photoURL` — URL de foto de Google; `null` para usuarios de email/password.
- `user.displayName` — nombre del usuario; puede ser `null` en email/password.
- `user.email` — correo electrónico; disponible en ambos métodos de autenticación.
- `user.uid` — identificador único.
- `user.emailVerified` — boolean.

**Dominio de imágenes:** `lh3.googleusercontent.com` ya está en la allowlist de `next.config.mjs`, por lo que las fotos de Google funcionan correctamente con el componente `<Image>` de Next.js.

**Implementación sugerida para el avatar:**

```jsx
// Reemplazar el bloque condicional actual por:
{userData.photoURL ? (
  <Image
    src={userData.photoURL}
    width={96}
    height={96}
    alt={`Foto de ${userData.displayName ?? "usuario"}`}
    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
  />
) : (
  <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center">
    {/* SVG de ícono de usuario genérico */}
    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
    </svg>
  </div>
)}
```

**Implementación sugerida para el correo:**

```jsx
<p className="text-gray-600 mb-4">
  <b>Email:</b> {userData.email ?? "Sin correo registrado"}
</p>
```

## Decisiones tomadas

- Avatar dummy: ícono genérico de `react-icons` (ya disponible en el proyecto).
- Fallback de nombre: mostrar "Usuario" cuando `displayName` es `null`.

## Preguntas abiertas

Ninguna.
