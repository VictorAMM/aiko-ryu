# Módulo: Aiko (Semantic Validator)

## Propósito
Valida a consistência semântica dos dados e contratos entre agentes.

## Interface/Contrato
```typescript
interface AikoAgent {
  validateSemantic(input: unknown): ValidationResult;
  emitEvent(event: TraceEvent): void;
}
```

## Inputs/Outputs
- **Input:** Dados/contexto a serem validados
- **Output:** ValidationResult (result, consensus, reason, details)

## Eventos
- `semantic.validation.passed`
- `semantic.validation.failed`

## Exemplo de Uso
```typescript
const result = aikoAgent.validateSemantic({ foo: 'bar' });
if (result.result) {
  // ...
}
```

## Falhas Conhecidas
- Dados fora do contrato
- Falha de consenso 

## Testes Relacionados
- [../../test/aikoAgent.test.ts](../../test/aikoAgent.test.ts) 