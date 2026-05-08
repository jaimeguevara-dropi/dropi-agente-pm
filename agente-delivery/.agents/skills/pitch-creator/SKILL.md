---
name: pitch-creator
description: Use this skill when the user asks to create a pitch for a Dropi epic or initiative. Triggered by "crea un pitch para", "prepara el pitch de", "dame el pitch de".
---

# Pitch Creator

## Objetivo

Generar un pitch ejecutivo para una épica o iniciativa de Dropi, siguiendo el formato oficial de la compañía. El objetivo del pitch es generar interés y obtener aprobación para pasar a la fase de shaping.

## Cuándo usarlo

- "crea un pitch para [épica / iniciativa]"
- "prepara el pitch de [nombre]"
- "dame el pitch de [idea]"

## Instrucciones

1. Lee `canon/dropi_methodology.md` y el contexto de la iniciativa si existe en `approved_context`.
2. Si falta contexto, pregunta al usuario por lo mínimo necesario:
   - ¿Qué problema estamos resolviendo?
   - ¿A quién afecta?
   - ¿Cuánto tiempo estamos dispuestos a invertir?
3. Genera el pitch con las siguientes secciones EN ESTE ORDEN:

---

### Título del Pitch
Breve y descriptivo. Debe capturar la esencia de la idea en pocas palabras.

---

### 1. Problema

**¿Qué problema estamos resolviendo?**
Describe el problema específico que afecta a los usuarios o al negocio. Claro y conciso.

**¿Por qué es importante este problema?**
Impacto en los usuarios, el negocio o ambos. Usar datos o ejemplos concretos para ilustrar la magnitud.

**¿Cómo se está resolviendo actualmente?**
Soluciones actuales (o falta de ellas) y sus limitaciones.

---

### 2. Apetencia

**¿Cuánto tiempo estamos dispuestos a invertir?**
Tiempo máximo que el equipo puede dedicar. Realista, considerando recursos disponibles.

**¿Qué restricciones tenemos?**
Limitaciones técnicas, presupuestarias o de recursos que podrían afectar el desarrollo.

---

### 3. Solución *(Opcional)*

**¿Cómo podríamos resolver este problema?**
Una o varias ideas de solución en líneas generales. Sin entrar en detalles técnicos en esta etapa.

**¿Qué beneficios aportaría esta solución?**
Resultados esperados para los usuarios y para el negocio.

**¿Qué riesgos existen?**
Posibles riesgos y desafíos que podrían surgir durante el desarrollo.

---

### 4. Consideraciones Adicionales *(Opcional)*

**¿Qué datos o investigaciones respaldan esta idea?**
Datos de mercado, investigación o feedback de usuarios que justifiquen la necesidad.

**¿Qué preguntas abiertas tenemos?**
Preguntas que deben responderse en la fase de shaping.

**¿Quién sería el responsable del proyecto?**
Persona o equipo que lideraría el proyecto si se aprueba.

---

## Restricciones

- Las secciones 3 y 4 son opcionales; no forzarlas si el usuario no tiene esa información aún.
- No inventar datos, cifras o nombres; usar `[dato por confirmar]` como placeholder.
- El título debe ser concreto y memorable, no genérico.
- Tono directo y ejecutivo. Sin jerga técnica innecesaria.
- Longitud: lo suficiente para generar interés, no para explicar la solución completa.

## Salida esperada

Un pitch completo en el formato oficial de Dropi, listo para presentar a los responsables de tomar decisiones y obtener aprobación para pasar a la fase de shaping.
