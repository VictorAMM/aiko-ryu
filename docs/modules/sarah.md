# Módulo: Sarah (RAG Engine)

## Propósito
Realiza recuperação aumentada por geração (RAG), busca e integra conhecimento externo ao fluxo dos agentes.

## Interface/Contrato
```typescript
interface SarahAgent {
  retrieveKnowledge(query: string): KnowledgeResult;
  emitEvent(event: TraceEvent): void;
}
```

## Inputs/Outputs
- **Input:** Query de conhecimento/contexto
- **Output:** KnowledgeResult (conteúdo, fontes, confiança)

## Eventos
- `rag.knowledge.retrieved`
- `rag.knowledge.failed`

## Exemplo de Uso
```typescript
const result = sarahAgent.retrieveKnowledge('Como funciona backup incremental?');
if (result.confidence > 0.8) {
  // ...
}
```

## Falhas Conhecidas
- Fonte não encontrada
- Baixa confiança 

## Testes Relacionados
- [../../test/basic.test.ts](../../test/basic.test.ts) 