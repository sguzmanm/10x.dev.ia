---
name: defining-tdd
description: Define y guía el proceso TDD en el proyecto 02-x-clone. Establece cómo crear casos de uso, escribir tests primero, y verificar la implementación. Usar cuando se va a implementar un nuevo feature, caso de uso, o se pide escribir tests.
---

# Defining TDD

## Principio fundamental

**Los tests se escriben ANTES de la implementación.** Nunca al revés.

El ciclo es: **Red → Green → Refactor**
1. **Red**: Escribe un test que falle (la funcionalidad no existe aún).
2. **Green**: Implementa el mínimo código para que el test pase.
3. **Refactor**: Limpia el código sin romper los tests.

---

## Paso 1: Definir los casos de uso

Antes de escribir cualquier test o código, documenta los casos de uso como criterios de aceptación concretos.

**Formato obligatorio:**

```
Caso de uso: [nombre del feature]

✅ DEBE hacer:
- Dado [contexto], cuando [acción], entonces [resultado esperado]
- ...

❌ NO DEBE hacer:
- [comportamiento inválido o error esperado]
- ...
```

**Ejemplo:**

```
Caso de uso: Crear tweet

✅ DEBE hacer:
- Dado un usuario autenticado, cuando envía un texto de 1-280 chars, entonces el tweet se guarda y aparece en el feed
- Dado un tweet creado, cuando el usuario lo ve en su perfil, entonces aparece con fecha y contenido correcto

❌ NO DEBE hacer:
- Permitir tweets vacíos
- Permitir tweets de más de 280 caracteres
- Permitir crear tweets sin estar autenticado
```

---

## Paso 2: Estructura de archivos de test

```
/app/src/
  features/
    tweet/
      __tests__/
        tweet.unit.test.ts       # Lógica pura, sin red ni DB
        tweet.integration.test.ts # Con Supabase (mocked)
  components/
    Tweet/
      __tests__/
        Tweet.test.tsx           # Render y comportamiento del componente
```

**Regla de colocación:** El test vive junto al código que prueba, dentro de `__tests__/`.

---

## Paso 3: Plantilla de test

### Test unitario (lógica de negocio)

```typescript
import { describe, it, expect } from 'vitest'
import { [funcionAProbar] } from '../[modulo]'

describe('[NombreDelCasoDeUso]', () => {
  it('debe [comportamiento esperado]', () => {
    // Arrange
    const input = ...

    // Act
    const result = [funcionAProbar](input)

    // Assert
    expect(result).toEqual(...)
  })

  it('debe fallar cuando [condición inválida]', () => {
    expect(() => [funcionAProbar](inputInvalido)).toThrow(...)
  })
})
```

### Test de componente React

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { [Componente] } from '../[Componente]'

describe('[Componente]', () => {
  it('debe renderizar [elemento] cuando [condición]', () => {
    // Arrange
    render(<[Componente] prop="valor" />)

    // Assert
    expect(screen.getByText('...')).toBeInTheDocument()
  })

  it('debe llamar [handler] cuando el usuario [acción]', () => {
    const onAction = vi.fn()
    render(<[Componente] onAction={onAction} />)

    fireEvent.click(screen.getByRole('button', { name: '...' }))

    expect(onAction).toHaveBeenCalledWith(...)
  })
})
```

---

## Paso 4: Orden de trabajo obligatorio

```
[ ] 1. Documentar casos de uso (✅ DEBE / ❌ NO DEBE)
[ ] 2. Escribir los tests en rojo (sin implementación)
[ ] 3. Confirmar que los tests fallan con `npm run test`
[ ] 4. Implementar el mínimo código para que pasen (Green)
[ ] 5. Refactorizar si aplica
[ ] 6. Delegar verificación al subagente `qa-engineer`
```

> ⚠️ No avanzar al paso 4 sin haber escrito los tests primero.

---

## Convenciones de nombrado

| Tipo | Sufijo | Ejemplo |
|------|--------|---------|
| Lógica pura | `.unit.test.ts` | `tweet-validator.unit.test.ts` |
| Con Supabase | `.integration.test.ts` | `tweet-repo.integration.test.ts` |
| Componente UI | `.test.tsx` | `TweetCard.test.tsx` |

---

## Qué NO testear

- Código de terceros (Supabase SDK, librerías UI).
- Tipos de TypeScript (los verifica el compilador).
- Estilos de Tailwind.
