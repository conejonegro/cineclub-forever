# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build
npm run lint     # Run ESLint
```

## Environment Variables

Create `.env.local` with:
```
NEXT_PUBLIC_IMG_PATH=https://image.tmdb.org/t/p/w500
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
```

## Architecture

**Next.js 16 App Router** film club platform. Mix of server and client components.

### Data Flow

**Movie catalog** is driven by a hardcoded array in `src/lib/subtitles/index.jsx`. This is the source of truth for which movies appear on the site — each entry holds the TMDB ID, slug, video URL (hosted externally on `mcseguros.com.mx/cineclub/`), subtitle VTT path, cycle/category, and who proposed the film.

At runtime, `src/lib/TMBDApiCall.jsx` takes that array and fetches enriched metadata (title, poster, synopsis, genres, backdrop) from the TMDB API in Spanish (`language=es-MX`).

**Movie detail pages** (`/peliculas-detalle/[slug]`) are server components that combine TMDB data + credits with the local video/subtitle entry matched by slug. The native HTML5 `<video>` + `<track>` player is in `src/components/Video.js`.

**Subtitle files** (`.vtt`) live in `/public/subtitles/`.

**Reviews** are stored in Firestore under the `reviews` collection. `/reviews` lists published reviews (client component), `/reviews/[slug]` renders individual reviews server-side. The admin dashboard at `/subir-reviews` is protected: it checks for the user's email in the Firestore `admins` collection.

**Authentication** uses Firebase Auth (Google OAuth + email/password). `src/components/UserProvider.jsx` provides a `UserContext` wrapping the whole app. Auth state persists via `browserLocalPersistence`.

### Key Directories

- `src/lib/subtitles/index.jsx` — add/edit movies here
- `src/lib/ciclos/` — movie cycle/collection definitions (Teens, Cyberpunk, Mexicanas)
- `src/lib/getReviews/reviews.js` — Firestore queries for the reviews system
- `src/components/FirebaseSettings.js` — Firebase app initialization
- `public/subtitles/` — VTT subtitle files

### Path Alias

`@/*` maps to `./src/*`.
