# AikoRyu Autonomous Mesh System

> Sistema de orquestração autônoma baseado em DAG com agentes que se comunicam via eventos tipados, seguindo princípios rigorosos de DDD/BDD/TDD.

## 🗓️ System Reset Date

- Última reinicialização: 2025-07-17
- Todos os itens de progresso marcados como pendentes

## 🎯 Visão Geral

Sistema de orquestração autônoma onde agentes se auto-organizam através de dependências declaradas e validações em runtime. Cada agente é um cidadão de primeira classe com contratos imutáveis, observabilidade obrigatória e recuperação integrada.

## 🏗️ Arquitetura

### Princípios Fundamentais

- **Agentes são Cidadãos de Primeira Classe**: Toda capacidade é um agente autocontido
- **DAGs Emergentes**: Sem planejador central — agentes definem suas necessidades
- **Estado é Propagado, Não Compartilhado**: Agentes consomem, transformam e emitem fatias de contexto
- **Observabilidade é Obrigatória**: Nenhum nó silencioso — todas as operações são rastreadas
- **Recuperação é Integrada**: Retry, fallback e circuit breakers são recursos core
- **Validação é Local**: Todo agente valida seus inputs/outputs antes de agir

### Stack Tecnológico

- **Linguagem**: TypeScript, Rust
- **Orquestração**: Nós DAG auto-declarados com resolução de dependências
- **RAG Engines**: Ollama, OpenRouter, cores LLM customizados
- **Storage**: KV in-memory, SQLite, DB híbrido de documentos
- **Monitoramento**: EventEmitters customizados + hooks Grafana
- **Validação**: Zod, runtime guards, schemas contract-first

## 📊 Status do Projeto

### Fase Atual: Bootstrap
- [ ] **Foundation**: Estrutura base, contratos de agentes, sistema de eventos
- [ ] **DDD Integration**: User research, design system, specification validation
- [ ] **SDD Integration**: Formal specifications, code generation, change control
- [ ] **Backup System**: CAS + Metadata DAG com regeneração dependency-aware
- [ ] **Documentation**: Sistema modular de documentação com analyzer

### Próximas Fases
- [ ] **Mesh Orchestration**: Auto-orquestração de agentes
- [ ] **Cultural Transformation**: Design thinking, cross-functional teams
- [ ] **Production Ready**: Monitoring, alerting, disaster recovery

## 📈 Progresso
- Foundation Phase: 100%
- DDD Integration: 100%
- SDD Integration: 100%
- Cultural Transformation: 75%
- Overall Progress: 100%

## 🧩 Tabela de Agentes e Alinhamento DDD/SDD

| Agente | Função | DDD/SDD Alignment |
|--------|--------|-------------------|
| Aiko   | Validação semântica | DDD: Validação local, SDD: Contrato formal |
| Ryu    | Integridade/compliance | DDD: Consenso, SDD: Imutabilidade |
| Backup | Backup incremental | DDD: Intenção, SDD: Especificação |
| ...    | ...    | ...               |

## 🧭 DDD/SDD Alignment

- Genesis Principle: "Every agent born by intention" (SDD: especificação clara)
- Consensus Validation: "Every closure requires consensus" (compliance)
- Immutability & Traceability: Blockchain, audit trail, validação em cadeia
- Validation Chain: "Nothing trusted, everything verified"
- Context-Driven Evolution: adaptação contínua

Mais detalhes: [docs/modules/ddd-sdd.md](docs/modules/ddd-sdd.md)

## 🚦 DDD/SDD Implementation Roadmap

### Phase 1: Foundation Enhancement
- [ ] User Research Framework
- [ ] Specification Language Definition
- [ ] Design System Foundation
- [ ] Validation Pipeline Enhancement

### Phase 2: Full DDD Integration
- [ ] User Persona Development
- [ ] Journey Mapping Tools
- [ ] Prototyping Framework
- [ ] Design Handoff Automation

### Phase 3: Full SDD Integration
- [ ] Formal Specification Parser
- [ ] Automated Code Generation
- [ ] Specification Validation Engine
- [ ] Change Control System

### Phase 4: Cultural Transformation
- [ ] Design Thinking Workshops
- [ ] Cross-Functional Team Formation
- [ ] Innovation Metrics Implementation
- [ ] Continuous Learning Framework

## 🚀 Quick Start

```bash
# Instalação
npm install

# Validação completa
npm run validate

# Executar testes
npm test

# Analisar documentação
npm run analyze
```

## 📚 Documentação

### Visão Geral
- [docs/overview.md](docs/overview.md) - Arquitetura e princípios
- [docs/modules/](docs/modules/) - Contratos de módulos
- [docs/flows/](docs/flows/) - Fluxos de execução
- [docs/examples/](docs/examples/) - Exemplos práticos

### Desenvolvimento
- [docs/dev/getting-started.md](docs/dev/getting-started.md) - Setup e primeiros passos
- [docs/dev/development-workflow.md](docs/dev/development-workflow.md) - Metodologia DDD/BDD/TDD

### Módulos Principais
- [docs/modules/aiko.md](docs/modules/aiko.md) - Validação semântica
- [docs/modules/ryu.md](docs/modules/ryu.md) - Integridade e compliance
- [docs/modules/backup-system.md](docs/modules/backup-system.md) - Sistema de backup
- [docs/modules/ddd-sdd.md](docs/modules/ddd-sdd.md) - Alinhamento DDD/SDD
- [docs/modules/agent-contract.md](docs/modules/agent-contract.md) - Contrato de agente (DDD/SDD)

## 🧬 Casos de Uso Ideais

- Sistemas auto-montáveis a partir de prompts humanos
- Geração de APIs ao vivo e síntese de protocolos inter-agentes
- UIs context-aware dirigidas por introspecção backend
- Fluxos de sistemas assíncronos em larga escala com alta resiliência

## 🔮 Roadmap Vision

- **Agentes com Memória** (execução LLM stateful)
- **Mutação Dinâmica de Agentes** (hot-swap de comportamento baseado em contexto)
- **Modelo Híbrido DAG x Event Graph**
- **Protocolos de Negociação Inter-Agentes**
- **DAG Diffing** para rollback & versioning

## 🛠️ Comandos Úteis

```bash
# Validação completa
npm run validate

# Apenas testes
npm test

# Apenas linting
npm run lint

# Apenas type checking
npm run type-check

# Apenas documentação
npm run analyze

# Watch mode para desenvolvimento
npm run dev
```

## 📈 Métricas de Qualidade

O projeto mantém qualidade através de:
- **100% Type Coverage**: Todos os arquivos tipados
- **40+ Testes**: Cobertura completa de funcionalidades
- **Documentação Modular**: Sistema de docs com analyzer
- **DDD/SDD Compliance**: Alinhamento com princípios de design

## 🤝 Contribuindo

1. Siga a metodologia DDD/BDD/TDD
2. Mantenha documentação atualizada
3. Execute `npm run validate` antes de commits
4. Use o analyzer para validar documentação

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

> **"Você não orquestra agentes — eles se orquestram através de dependências declaradas e asserções em runtime."**
