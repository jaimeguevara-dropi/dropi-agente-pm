---
name: epic-creator
description: Use this skill when the user asks to create, draft or describe a Dropi epic. Triggered by phrases like "dame la descripción de la siguiente épica", "crea la épica de", "describe la épica para".
---

# Epic Creator

## Objetivo

Generar la descripción completa de una épica siguiendo la metodología oficial de Dropi.

## Cuándo usarlo

- Cuando el usuario pide crear o redactar una épica
- Cuando el usuario dice "dame la descripción de la siguiente épica"
- Cuando el usuario necesita estructurar una iniciativa como épica de Jira

## Instrucciones

1. Lee `canon/dropi_methodology.md` para refrescar el formato oficial.
2. Si el usuario no especificó todos los datos, pregunta lo mínimo necesario:
   - Sigla del producto (DROPI / DROPI APP / ADMIN / CAS)
   - Nombre de la iniciativa
   - País y usuarios afectados
   - Problema que resuelve (contexto)
3. Genera la épica con TODAS las secciones del formato oficial:
   - Título (formato: `[Sigla]: [Nombre]_[País]_[Usuarios]`)
   - Contexto y descripción del problema
   - ¿Qué buscamos?
   - Fases del proceso
   - Criterios de éxito y métricas
   - Público objetivo
   - Sección de documentación (con placeholders si no se tiene el link)
4. Presenta el resultado como borrador para aprobación del usuario.
5. Si el usuario aprueba, usa el skill `canon-keeper` para guardarlo en `approved_context`.

## Restricciones

- Nunca inventar métricas o datos que el usuario no haya proporcionado; usar placeholders claros como `[métricas por definir]`.
- No crear la épica sin al menos el contexto del problema.
- El título debe seguir EXACTAMENTE el formato oficial.

## Salida esperada

Una épica lista para copiar en Jira, en el formato completo de Dropi.
