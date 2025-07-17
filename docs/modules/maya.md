# Módulo: Maya (Context Manager)

## Propósito
Gerencia a propagação de contexto, transições de estado e histórico entre agentes.

## Interface/Contrato
```typescript
interface MayaAgent {
  propagateContext(context: ContextSlice): ContextResult;
  emitEvent(event: TraceEvent): void;
}
```

## Inputs/Outputs
- **Input:** ContextSlice (fragmento de contexto)
- **Output:** ContextResult (novo contexto, histórico, validação)

## Eventos
- `context.propagation.started`
- `context.propagation.completed`
- `context.propagation.failed`

## Exemplo de Uso
```typescript
const result = mayaAgent.propagateContext({ user: 'alice', state: 'active' });
if (result.validation.result) {
  // ...
}
```

## Falhas Conhecidas
- Contexto inconsistente
- Perda de histórico 

## Testes Relacionados
- [../../test/basic.test.ts](../../test/basic.test.ts) 