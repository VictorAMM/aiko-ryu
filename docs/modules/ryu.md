# Módulo: Ryu (Integrity Guardian)

## Propósito
Garante a integridade do sistema, valida outputs e compliance com contratos e especificações.

## Interface/Contrato
```typescript
interface RyuAgent {
  validateIntegrity(output: unknown): ValidationResult;
  emitEvent(event: TraceEvent): void;
}
```

## Inputs/Outputs
- **Input:** Output de agentes, snapshots, contratos
- **Output:** ValidationResult (result, consensus, reason, details)

## Eventos
- `integrity.validation.passed`
- `integrity.validation.failed`

## Exemplo de Uso
```typescript
const result = ryuAgent.validateIntegrity({ foo: 'bar' });
if (result.result) {
  // ...
}
```

## Falhas Conhecidas
- Output fora do contrato
- Falha de consenso 

## Testes Relacionados
- [../../test/basic.test.ts](../../test/basic.test.ts) 