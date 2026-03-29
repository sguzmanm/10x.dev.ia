# Technical Brief

## 1. Título de la tarea

Agente Inteligente de Generación de Preguntas para Votación en Agenda

---

## 2. Contexto

Actualmente, las organizaciones enfrentan desafíos al gestionar sesiones y fases de agendas complejas. No existe un mecanismo automatizado que pueda analizar estas tareas y generar preguntas relevantes que faciliten la toma de decisiones colaborativas mediante votación.

El objetivo de esta tarea es construir un **agente inteligente basado en LangChain** que reciba una lista de sesiones/fases de una agenda como entrada y genere preguntas pertinentes sobre las cuales múltiples personas puedan votar. Esto mejorará la capacidad de recolectar feedback estructurado y facilitar la toma de decisiones colaborativas.

---

## 3. Requerimientos técnicos

### Lenguaje / Stack

- **Lenguaje**: TypeScript
- **Versión mínima**: Node.js 20+
- **Librerías principales**:
  - `langchain`: Framework de agentes IA (versión compatible con Node.js 20+)
  - `@langchain/core`: Core de LangChain
  - Integración de LLM (según disponibilidad de API)

---

### Arquitectura

- **Clean Architecture**: Separación clara entre capas de dominio, casos de uso, infraestructura e interfaz
- **Stateless Service**: El agente no mantiene estado entre ejecuciones
- **Pattern**: Agent Pattern (LangChain)
- **Principios**: SOLID, inyección de dependencias

---

### Input esperado

**Formato CLI:**

```
1. Tarea 1
2. Tarea 2
3. Tarea 3
```

**Interfaz TypeScript:**

```typescript
interface AgendaTask {
  id: number;
  title: string;
}

interface AgentInput {
  tasks: AgendaTask[];
}
```

---

## 4. Output esperado

El agente debe retornar un JSON estructurado con las preguntas generadas:

```typescript
interface VotingOption {
  id: string;
  label: string;
}

interface GeneratedQuestion {
  questionId: string;
  question: string;
  options: VotingOption[];
  reasoning: string;
}

interface AgentOutput {
  questions: GeneratedQuestion[];
  totalQuestions: number;
  generatedAt: string;
}
```

**Ejemplo de salida:**

```json
{
  "questions": [
    {
      "questionId": "q_001",
      "question": "¿Considera que la Tarea 1 debe priorizarse en la próxima fase?",
      "options": [
        { "id": "opt_yes", "label": "Sí" },
        { "id": "opt_no", "label": "No" }
      ],
      "reasoning": "Evalúa la prioridad relativa de la tarea según contexto de agenda"
    }
  ],
  "totalQuestions": 1,
  "generatedAt": "2026-03-29T14:30:00Z"
}
```

---

## 5. Herramientas requeridas

### Tool: Question Formatter

**Nombre**: `formatQuestionsToJSON`

**Descripción**: Formatea las preguntas generadas por el agente en un JSON estructurado apto para votación.

**Input:**

```typescript
interface RawQuestion {
  question: string;
  options: string[];
  reasoning: string;
}
```

**Output**: JSON compliant con `GeneratedQuestion[]`

**Responsabilidad**:
- Validar la estructura de preguntas
- Generar IDs únicos para cada pregunta
- Mapear opciones a estructura de votación
- Incluir timestamp

---

## 6. Constraints (Restricciones)

- No usar librerías externas salvo las aprobadas: `langchain`, `@langchain/core`, y dependencias de test/lint
- Implementar type hints en todo el código TypeScript
- Seguir principios SOLID y buenas prácticas de JavaScript/TypeScript
- Separar claramente:
  - **Domain Layer**: Entidades (Task, Question, VotingOption)
  - **Use Cases Layer**: Lógica del agente
  - **Infrastructure Layer**: Integraciones con LangChain y APIs externas
  - **Interface Layer**: CLI y formateo de salida
- Evitar anidamientos innecesarios; preferir early returns
- Usar nombres comprensibles en inglés para variables y funciones
- El agente debe ser determinístico en su estructura de salida
- Máximo 3 preguntas por tarea en la agenda

---

## 7. Definition of Done (DoD)

El trabajo se considera terminado cuando:

- El código pasa linters (ESLint configurado)
- El código sigue convenciones de estilo adoptadas (Prettier)
- La cobertura de tests unitarios es al mínimo **90%**
- El agente procesa correctamente listas de tareas desde CLI
- Las preguntas generadas están estructuradas en JSON válido
- Existe documentación clara de cómo usar el agente
- Se valida input y se maneja errores apropiadamente
- La Tool `formatQuestionsToJSON` está integrada y testeada

---

## 8. Criterios de Aceptación

- [ ] Agente recibe lista de tareas desde CLI sin errores
- [ ] Genera preguntas relevantes basadas en contexto de tareas
- [ ] Output JSON cumple con estructura especificada
- [ ] Todos los tests pasan (>90% cobertura)
- [ ] Linters y formatters pasan sin advertencias
- [ ] README contiene instrucciones de uso
- [ ] Código sigue Clean Architecture
