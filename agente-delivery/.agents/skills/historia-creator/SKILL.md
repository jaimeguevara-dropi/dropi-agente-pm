---
name: historia-creator
description: Use this skill when the user asks to create user stories for Dropi. Triggered by phrases like "dame las historias de UX de", "dame las historias de UI de", "crea las historias de frontend/backend/DBA/QA/legal/lanzamiento de".
---

# Historia Creator

## Objetivo

Generar historias de usuario en el formato oficial de Dropi, para cualquier tipo de etiqueta (UX, UI, Frontend, Backend, DBA, QA, Legal, Lanzamiento).

## Cuándo usarlo

- "dame las historias de UX de [épica]"
- "dame las historias de UI de [épica]"
- "dame las historias de frontend / backend / DBA / QA / legal / lanzamiento de [épica]"
- "crea las historias para [nombre de épica]"

## Instrucciones

1. Lee `canon/dropi_methodology.md` para refrescar el formato oficial.
2. Identifica el tipo de historia que el usuario necesita (UX, UI, Frontend, Backend, DBA, QA, Legal, Lanzamiento).
3. Si no existe el contexto de la épica, pídele al usuario que la describa o la comparta.
4. Por cada historia genera:

   **Título:** `[Etiqueta] [Sigla del producto]: [Nombre descriptivo]`

   **Historia:**
   ```
   Como [tipo de usuario],
   Puedo [acción],
   Para [resultado].
   ```

   **Descripción del proceso:** detalle de cómo se realizaría.

   **Flujo del usuario:** paso a paso numerado de lo que hace el usuario.

   **Criterios de aceptación (Gherkin):**
   ```
   Escenario: [nombre]
     Dado que [precondición]
     Cuando [acción]
     Entonces [resultado esperado]
   ```
   Genera al menos 2-3 escenarios por historia (happy path + casos de error relevantes).

   **Condiciones adicionales:** versión del design system, si es nuevo o rediseño, resoluciones.

   **Definición de Hecho (DoD):** resultados esperados concretos.

5. Agrega solo las secciones relevantes para el tipo de etiqueta:
   - **UX:** incluye flujos de interacción, wireframes esperados, benchmark.
   - **UI:** incluye resoluciones, versión del design system, handoff.
   - **Frontend:** incluye componentes, APIs/endpoints a conectar.
   - **Backend:** incluye APIs, esquema de datos, procesos automáticos.
   - **DBA:** incluye estructura de tablas, validaciones, restricciones.
   - **QA:** incluye flujos a validar, regresiones relevantes.
   - **Legal:** incluye requerimientos normativos, cambios a T&C.
   - **Lanzamiento:** incluye beneficios por usuario, video Tango.

6. Presenta como borrador para revisión del usuario.

## Restricciones

- El formato Gherkin es obligatorio para criterios de aceptación.
- El título debe seguir exactamente `[Etiqueta] [Sigla]: Nombre`.
- No mezclar tipos de etiqueta en la misma historia.
- No inventar datos técnicos (endpoints, nombres de tablas) sin base en el contexto dado.

## Salida esperada

Una o varias historias listas para copiar en Jira, en el formato completo de Dropi.
