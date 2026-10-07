# ADR-0001: Registrar decisiones de arquitectura con ADRs

- **Estado:** Aceptado
- **Fecha:** 2026-10-07

## Contexto
Las decisiones técnicas (qué API usar, cómo guardar datos en Firestore, qué se hardcodea) quedaban solo en la memoria de quien las tomó o enterradas en mensajes de commit. Los specs de `specs/` describen features, no el porqué de las decisiones detrás.

## Decisión
Documentar cada decisión técnica relevante como un ADR en `docs/adr/`, numerado y siguiendo `TEMPLATE.md`.

## Alternativas consideradas
- **Solo mensajes de commit:** difíciles de encontrar y no explican alternativas descartadas.
- **Agregarlo a los specs:** mezcla el "qué" de un feature con decisiones que a veces cruzan varios features.

## Consecuencias
- **Positivas:** hay un rastro claro de por qué el código es como es; facilita revisar o revertir decisiones.
- **Negativas / riesgos:** requiere disciplina para escribir el ADR cuando se toma la decisión, no después.
