# Getting Started

## Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Git

## Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd Test3

# Instale as dependências
npm install

# Verifique a instalação
npm test
```

## Quick Start

```bash
# Execute o analyzer para validar o projeto
npm run analyze

# Execute os testes
npm test

# Execute o linting
npm run lint

# Execute type checking
npm run type-check
```

## Estrutura do Projeto

```
Test3/
├── src/
│   ├── agents/           # Contratos e implementações de agentes
│   ├── backup/           # Sistema de backup CAS + Metadata DAG
│   └── test-readme-analyzer.ts  # Validador de documentação
├── test/                 # Testes unitários e de integração
├── docs/                 # Documentação modular
│   ├── overview.md       # Visão geral do sistema
│   ├── modules/          # Contratos de módulos
│   ├── flows/            # Fluxos de execução
│   ├── examples/         # Exemplos práticos
│   └── dev/              # Documentação de desenvolvimento
└── README.md             # Overview e links
```

## Primeiros Passos

### 1. Entenda a Arquitetura

Leia [docs/overview.md](../overview.md) para entender:
- Visão geral do sistema
- Arquitetura de agentes
- Princípios DDD/SDD

### 2. Explore os Módulos

- [docs/modules/aiko.md](../modules/aiko.md) - Validação semântica
- [docs/modules/ryu.md](../modules/ryu.md) - Integridade e compliance
- [docs/modules/backup-system.md](../modules/backup-system.md) - Sistema de backup

### 3. Execute Exemplos

```bash
# Teste o sistema de backup
npm test test/backup.test.ts

# Teste os agentes
npm test test/agentContract.test.ts
npm test test/aikoAgent.test.ts
```

### 4. Valide a Documentação

```bash
# Execute o analyzer
npm run analyze

# Verifique a cobertura de documentação
# O analyzer reportará arquivos faltando e problemas de qualidade
```

## Desenvolvimento

### Adicionando Novos Agentes

1. Crie o contrato em `src/agents/`
2. Implemente o agente seguindo o padrão
3. Adicione testes em `test/`
4. Documente em `docs/modules/`
5. Execute o analyzer para validar

### Adicionando Novos Fluxos

1. Implemente o fluxo
2. Documente em `docs/flows/`
3. Adicione exemplos em `docs/examples/`
4. Crie testes de integração

### Atualizando Documentação

1. Siga o padrão modular
2. Inclua exemplos de código
3. Adicione links para testes
4. Execute o analyzer para validar

## Troubleshooting

### Problemas Comuns

**TypeScript errors:**
```bash
npm run type-check
```

**Test failures:**
```bash
npm test -- --verbose
```

**Documentation warnings:**
```bash
npm run analyze
```

### Logs e Debug

```bash
# Logs detalhados
DEBUG=* npm test

# Logs do analyzer
npm run analyze -- --verbose
```

## Próximos Passos

1. **Leia a documentação completa** em `docs/`
2. **Execute exemplos** para entender o sistema
3. **Contribua** seguindo o workflow em [docs/dev/development-workflow.md](development-workflow.md)
4. **Mantenha a documentação atualizada** usando o analyzer

## Links Úteis

- [Documentação Completa](../overview.md)
- [Workflow de Desenvolvimento](development-workflow.md)
- [Exemplos Práticos](../examples/)
- [Contratos de Módulos](../modules/) 