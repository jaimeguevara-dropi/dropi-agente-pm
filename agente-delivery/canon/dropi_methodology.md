# Metodología de producto — Dropi

## Jerarquía de incidencias (Jira)

```
Épica
  → Historia (UX / UI / Frontend / Backend / DBA / QA / Legal / Lanzamiento)
      → Subtarea
  → Incidencia de Producto
      → Subtarea
  → Subtarea (directa de épica)
```

---

## Siglas de producto

| Sigla | Aplica a |
|---|---|
| `DROPI` | Core de la plataforma web (lo que ven los usuarios) |
| `DROPI APP` | Proyecto DROPI APP |
| `ADMIN` | Funcionalidades administrativas |
| `CAS` | Proyecto CAS |

---

## Épica

### Formato del título
`[Sigla del producto]: [Nombre de la épica]_[País]_[Usuarios afectados]`

**Ejemplo:** `DROPI: Validación de cuentas bancarias_Colombia_Todos los usuarios`

### Descripción de la épica

**Contexto**
- Descripción del problema:
  - ¿Qué problema estamos resolviendo?
  - ¿Por qué es importante?
  - ¿A qué usuarios afecta?
  - Datos relevantes que justifiquen la solución

**¿Qué buscamos?**
- Detalle de lo que vamos a lograr
- ¿Qué vamos a hacer?
- Fases del proceso (con posibles bloqueantes y entregable esperado por fase)

**Criterios de éxito**
- Métricas a impactar
- Público objetivo (tipos de usuario, países, marcas blancas)

**Documentación**
- Kickoff (link)
- Flujo general
- Figma / FigJam
- Documentos relacionados

---

## Historia

### Formato del título
`[Etiqueta] [Sigla del producto]: [Nombre descriptivo]`

**Ejemplo:** `[UX] DROPI Informe general de productos para Dropshippers`

### Etiquetas y su contenido esperado

| Etiqueta | Contenido esperado en la historia |
|---|---|
| `UX` | Flujo de interacción, wireframes en baja, investigaciones, benchmarks, pruebas de usuarios |
| `UI` | Benchmarks visuales, diseños en alta con especificaciones para handoff, prototipos en alta |
| `Frontend` | Componentes visuales requeridos, conexión con APIs backend, endpoints |
| `Backend` | APIs necesarias, esquema de datos, procesos automatizados |
| `DBA` | Estructura de tablas, validaciones y restricciones |
| `QA` | Procesos a validar, revisión de flujos |
| `Legal` | Revisión de requerimientos, adiciones a términos y condiciones |
| `Lanzamiento` | Beneficios por tipo de usuario, video Tango de las funcionalidades |

### Descripción de la historia

**Historia (formato)**
```
Como [tipo de usuario],
Puedo [acción],
Para [resultado].
```

Tipos de usuario válidos: Dropshipper, Proveedor, Emprendedor, Marca Blanca, Seller, Administrador, Super Administrador.

**Descripción del proceso**
Detalle de cómo se realizaría el proceso: documentación, flujos, paso a paso y detalles relevantes.

**Flujo del usuario (user flow)**
Paso a paso que debe realizar el usuario para completar la tarea.
- Separado por viñetas o números
- Incluir diagrama UML si aplica

**Criterios de aceptación (formato Gherkin)**
```
Escenario: [Nombre del escenario]
  Dado que [precondición / escenario inicial]
  Cuando [acción que ejecuta el usuario]
  Entonces [resultado esperado / validación]
```

**Condiciones adicionales**
- Versión del sistema de diseño (1.0 = componentes actuales; 2.0 = sistema de diseño nuevo)
- Es nuevo o rediseño
- Resoluciones: Desktop, tablet, laptop, responsive (móvil)

**Definición de Hecho (DoD)**
Resultados esperados para cada acción o requerimiento.

---

## Subtarea

### Formato del título
`[Etiqueta] [Sigla del producto]: [Nombre descriptivo]`

**Ejemplo:** `[UX] DROPI APP Diseño del nuevo flujo de pantalla favoritos Dropi app`

### Descripción de la subtarea
Pasos a seguir para completar la tarea:
- Actividades concretas (investigaciones, benchmarking, definiciones de épica, sesiones de ideación, etc.)

---

## Incidencia de Producto

Va dentro de una épica. Agrupa actividades que desarrolla el equipo de producto para el avance de la épica.

---

## Documento de Kickoff

### Estructura oficial

**1. Título del Proyecto**
El mismo título del pitch aprobado.

**2. Introducción**
- Contexto: breve resumen del problema y por qué es importante.
- Objetivos del Proyecto: resultados específicos esperados.
- Apetencia: tiempo y recursos asignados al proyecto.

**3. Problema**
- Descripción Detallada: amplía el problema con datos, ejemplos y contexto adicional.
- Impacto: efecto en usuarios, negocio o ambos.
- Soluciones Actuales: cómo se aborda hoy y limitaciones de esas soluciones.

**4. Riesgos de Producto**

| Riesgo | Pregunta clave |
|---|---|
| Riesgo de valor | ¿El cliente encontrará valor en esta solución? |
| Riesgo de usabilidad | ¿Los usuarios podrán usarla efectivamente? |
| Riesgo de factibilidad | ¿Podemos construirla con los recursos y tecnologías disponibles? |
| Riesgo de viabilidad empresarial | ¿Esta solución funcionará para nuestro negocio? |
| Riesgo Legal | ¿Cumplimos con todos los requerimientos de ley? |

**5. Preguntas Abiertas**
- Preguntas Clave: preguntas que deben responderse en la fase de shaping.
- Hipótesis: posibles soluciones o enfoques a explorar.

**6. Escenarios**
- Posibles casos que pueden suceder durante el desarrollo.

**7. Primeras Ideas**
- Ideas iniciales que existen alrededor del proyecto.

**8. Equipo del Proyecto**
- Roles y Responsabilidades: rol, nombre, responsabilidades específicas.
- Contacto: información de contacto de cada miembro.

**9. Próximos Pasos**
- Plan de Trabajo Inicial: primeros pasos concretos.
- Reuniones de Seguimiento: calendario de revisiones periódicas.

**10. Apéndices (Opcional)**
- Datos de investigación, feedback de usuarios.
- Wireframes o bocetos iniciales.

---

## Pitch

Documento para generar interés y obtener aprobación para pasar a la fase de shaping.

### Estructura oficial

**Título del Pitch**
Breve y descriptivo. Captura la esencia de la idea.

**1. Problema**
- ¿Qué problema estamos resolviendo? (claro y conciso)
- ¿Por qué es importante? (datos o ejemplos concretos del impacto)
- ¿Cómo se está resolviendo actualmente? (soluciones actuales y sus limitaciones)

**2. Apetencia**
- ¿Cuánto tiempo estamos dispuestos a invertir? (tiempo máximo realista)
- ¿Qué restricciones tenemos? (técnicas, presupuestarias, de recursos)

**3. Solución** *(Opcional)*
- ¿Cómo podríamos resolver el problema? (ideas generales, sin detalle técnico)
- ¿Qué beneficios aportaría? (para usuarios y para el negocio)
- ¿Qué riesgos existen?

**4. Consideraciones Adicionales** *(Opcional)*
- ¿Qué datos o investigaciones respaldan esta idea?
- ¿Qué preguntas abiertas tenemos? (para la fase de shaping)
- ¿Quién sería el responsable del proyecto?

---

## Brief de Lanzamiento

Documento que se entrega al equipo de comunicaciones para coordinar el lanzamiento de una funcionalidad o producto.

### Estructura oficial

**1. Título del Proyecto**
Nombre oficial del producto o funcionalidad.

**2. Descripción General**
- ¿Qué es? (2-3 líneas)
- ¿Para quién está dirigido? (segmento o tipo de usuario)

**3. Beneficios Clave**
- Beneficio principal: el valor agregado central.
- Beneficios secundarios: otros puntos fuertes (viñetas, máximo 5).

**4. Objetivo del Lanzamiento**
- Meta principal de la campaña.
- Fechas de lanzamiento o ventana aproximada.
- Estrategia de producto: requerimientos puntuales del equipo de producto para el lanzamiento.

**5. Mensajes y Ángulos de Comunicación**
- Mensaje clave: frase o tagline que resume la propuesta de valor.
- Puntos de apoyo: ideas o frases que refuerzan la comunicación.

**6. Recursos Disponibles**
- Video demostrativo (enlace si aplica).
- Documentación paso a paso en Tango.
- Enlace a Figma / prototipo (solo si el equipo de comunicaciones lo requiere).
- Documentos o presentaciones (PDF de funcionalidades destacadas, etc.).

**7. Contacto Principal**
- Persona de producto responsable de resolver dudas de posicionamiento, tono o alcance.
- Fecha límite para enviar solicitudes de información adicional.

---

## Tipos de usuarios en Dropi

- Dropshipper
- Proveedor
- Emprendedor
- Marca Blanca
- Seller
- Administrador
- Super Administrador
