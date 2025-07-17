# Development Workflow

## Metodologia

Este projeto segue uma metodologia rigorosa de **DDD/BDD/TDD** com foco em:

- **Design-Driven Development (DDD)**: Intenção de design guia implementação
- **Behavior-Driven Development (BDD)**: Comportamentos especificados antes do código
- **Test-Driven Development (TDD)**: Testes escritos antes da implementação

## Workflow de Desenvolvimento

### 1. Análise de Requisitos (DDD)

```typescript
// 1. User Research
interface UserResearch {
  personas: UserPersona[];
  painPoints: PainPoint[];
  needsAnalysis: UserNeed[];
}

// 2. Design Intent
interface DesignIntent {
  userGoal: string;
  businessValue: string;
  technicalConstraints: string[];
  successMetrics: Metric[];
}
```

### 2. Especificação de Comportamento (BDD)

```typescript
// 3. Behavior Specification
describe('Agent Behavior', () => {
  it('should validate semantic consistency', () => {
    // Given: input data
    // When: agent processes
    // Then: expected output
  });
});
```

### 3. Implementação com Testes (TDD)

```typescript
// 4. Test-First Implementation
class AgentImplementation {
  // Write failing test first
  // Implement minimal code to pass
  // Refactor while keeping tests green
}
```

## Processo de Qualidade

### Quality Gates

Cada feature deve passar por:

1. **Type Checking**: `npm run type-check`
2. **Linting**: `npm run lint`
3. **Testing**: `npm test`
4. **Documentation**: `npm run analyze`

### Continuous Validation

```bash
# Execute todos os gates
npm run validate

# Ou individualmente
npm run type-check
npm run lint
npm test
npm run analyze
```

## Estrutura de Feature

### 1. Contrato (Interface)

```typescript
// src/agents/MyAgent.ts
export interface MyAgentContract {
  id: string;
  role: string;
  capabilities: Capability[];
  validateInput(input: unknown): ValidationResult;
  process(input: unknown): Promise<ProcessResult>;
  emitEvents(): Event[];
}
```

### 2. Implementação

```typescript
// src/agents/MyAgent.ts
export class MyAgent implements MyAgentContract {
  // Implementação seguindo contrato
  // Com validação e observabilidade
}
```

### 3. Testes

```typescript
// test/myAgent.test.ts
describe('MyAgent', () => {
  // Testes de contrato
  // Testes de comportamento
  // Testes de integração
});
```

### 4. Documentação

```markdown
// docs/modules/my-agent.md
# Módulo: My Agent

## Propósito
Descrição clara do propósito

## Interface/Contrato
```typescript
interface MyAgentContract {
  // Interface completa
}
```

## Exemplo de Uso
```typescript
// Exemplo prático
```

## Teste Relacionado
- [test/myAgent.test.ts](../../test/myAgent.test.ts)
```

## Workflow de Commit

### 1. Preparação

```bash
# Atualize a documentação
npm run analyze

# Execute todos os testes
npm test

# Verifique tipos
npm run type-check
```

### 2. Commit

```bash
# Commit com mensagem descritiva
git add .
git commit -m "feat: add semantic validation agent

- Implements semantic consistency validation
- Adds comprehensive test coverage
- Updates documentation with examples
- Follows DDD/SDD principles"
```

### 3. Validação Pós-Commit

```bash
# Execute analyzer novamente
npm run analyze

# Verifique se todos os gates passam
npm run validate
```

## Padrões de Código

### 1. Contratos Imutáveis

```typescript
// ✅ Correto
interface AgentContract {
  readonly id: string;
  readonly role: string;
  validate(input: unknown): ValidationResult;
}

// ❌ Incorreto
interface AgentContract {
  id: string; // Mutável
  role?: string; // Opcional sem justificativa
}
```

### 2. Observabilidade Obrigatória

```typescript
// ✅ Correto
class Agent {
  emit(event: Event): void {
    this.eventEmitter.emit(event.type, event);
  }
  
  trace(operation: string, data: unknown): void {
    this.tracer.trace(operation, data);
  }
}
```

### 3. Validação Local

```typescript
// ✅ Correto
class Agent {
  process(input: unknown): Promise<Result> {
    const validation = this.validateInput(input);
    if (!validation.success) {
      throw new ValidationError(validation.errors);
    }
    // Processa apenas após validação
  }
}
```

## Troubleshooting

### Problemas Comuns

**Type errors:**
```bash
# Verifique tipos
npm run type-check

# Corrija problemas
# Adicione tipos faltantes
# Implemente interfaces
```

**Test failures:**
```bash
# Execute testes específicos
npm test -- --testNamePattern="MyAgent"

# Debug com logs
DEBUG=* npm test
```

**Documentation warnings:**
```bash
# Execute analyzer
npm run analyze

# Corrija documentação
# Adicione exemplos
# Atualize links
```

### Debug Workflow

```bash
# 1. Identifique o problema
npm run validate

# 2. Isole o problema
npm test -- --testNamePattern="specific-test"

# 3. Corrija incrementalmente
# 4. Valide novamente
npm run validate
```

## Próximos Passos

1. **Siga o workflow** para cada feature
2. **Mantenha qualidade** em cada commit
3. **Documente sempre** seguindo padrões
4. **Valide continuamente** com analyzer

## Links Úteis

- [Getting Started](getting-started.md)
- [Documentação de Módulos](../modules/)
- [Exemplos Práticos](../examples/)
- [Contratos de Agentes](../modules/) 