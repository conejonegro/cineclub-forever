# Architecture Decision Records (ADRs)

Registro de las decisiones técnicas importantes del proyecto: qué se decidió, por qué, y qué consecuencias tiene. Así cualquiera (incluido tú en seis meses) entiende por qué el código está como está.

- Los specs de features viven en `specs/`; aquí solo van **decisiones**.
- Un archivo por decisión, numerado: `NNNN-titulo-en-kebab-case.md`. Copia `TEMPLATE.md` para empezar.
- Los ADRs no se borran ni se reescriben: si una decisión cambia, se crea uno nuevo y el viejo se marca como `Reemplazado por ADR-NNNN`.

## Índice

| # | Decisión | Estado |
|---|---|---|
| [0001](0001-registrar-decisiones-con-adrs.md) | Registrar decisiones de arquitectura con ADRs | Aceptado |
| [0002](0002-tmdb-como-buscador-de-solicitudes.md) | TMDB en lugar de YTS como buscador de solicitudes | Aceptado |
| [0003](0003-agrupar-solicitudes-por-tmdb-id.md) | Agrupar solicitudes por `tmdb_id` sin migrar datos viejos | Aceptado |
| [0004](0004-datos-de-festivales-hardcodeados.md) | Datos de festivales en archivos locales; TMDB solo para medios | Aceptado |
| [0005](0005-disponibilidad-derivada-del-catalogo.md) | El estado "disponible" se deriva del catálogo, no se guarda | Aceptado |
| [0006](0006-titulo-en-ingles-como-respaldo.md) | Título en inglés como respaldo cuando TMDB no tiene uno legible | Aceptado |
