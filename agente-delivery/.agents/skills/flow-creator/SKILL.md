---
name: flow-creator
description: Use this skill when the user asks to create a user flow or process flow for a Dropi feature. Triggered by "crea el flujo de", "dame el flujo de", "define el flujo para".
---

# Flow Creator

## Objetivo

Generar el flujo de usuario (user flow) de una funcionalidad, en formato paso a paso y opcionalmente en pseudocódigo UML/Mermaid para diagramación.

## Cuándo usarlo

- "crea el flujo de [funcionalidad]"
- "dame el flujo de [proceso]"
- "define el flujo para [historia / épica]"
- Cuando una historia necesita su user flow antes de diseño o desarrollo

## Instrucciones

1. Lee `canon/dropi_methodology.md` para el contexto de tipos de usuario.
2. Si falta contexto, pregunta al usuario:
   - ¿Qué funcionalidad o proceso se va a mapear?
   - ¿Cuál es el tipo de usuario protagonista?
   - ¿Cuál es el punto de entrada (desde dónde empieza)?
   - ¿Cuál es el resultado final esperado?
3. Genera:

   **a) Flujo narrativo (paso a paso)**
   - Lista numerada de pasos desde el punto de entrada hasta el resultado final.
   - Incluir bifurcaciones (si X entonces Y, si no entonces Z).
   - Indicar claramente qué hace el usuario y qué hace el sistema en cada paso.

   **b) Flujo en Mermaid (para diagramación)**
   ```mermaid
   flowchart TD
     A[Inicio] --> B[Acción del usuario]
     B --> C{Condición}
     C -->|Sí| D[Resultado exitoso]
     C -->|No| E[Manejo de error]
     D --> F[Fin]
   ```

   **c) Casos alternativos y de error**
   - Listar al menos 2-3 escenarios alternativos o de error relevantes con su flujo.

4. Ajusta el nivel de detalle según el tipo de historia al que pertenece:
   - **UX:** enfocarse en la perspectiva del usuario, puntos de decisión y emociones.
   - **Frontend:** enfocarse en navegación, estados de UI y transiciones.
   - **Backend:** enfocarse en llamadas a API, validaciones y respuestas del sistema.
5. Presenta como borrador para revisión.

## Restricciones

- No inventar reglas de negocio no mencionadas por el usuario.
- Los diagramas Mermaid deben ser válidos y ejecutables.

## Salida esperada

Flujo de usuario paso a paso + diagrama Mermaid, listo para incluir en la descripción de la historia o compartir con el equipo.
