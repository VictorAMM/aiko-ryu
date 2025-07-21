# 🚀 AikoRyu System - Usage Guide

## 📋 **Overview**

The AikoRyu system is an autonomous agent orchestration platform that enables autonomous software construction through ontology-driven agent coordination, semantic validation, and production-ready build processes.

## 🏗️ **System Architecture**

### Core Components
- **🤖 Autonomous Agents**: Specialized agents with clear roles and responsibilities
- **🕸️ Mesh Network**: Agent communication and orchestration system
- **📋 Specification Engine**: Requirements validation and processing
- **🔍 Semantic Validator**: Context-aware validation and consensus building
- **🧠 RAG Engine**: Knowledge retrieval and semantic search
- **🔒 Integrity Guardian**: Security and compliance monitoring
- **⚡ Performance Optimizer**: System optimization and resource management

## 🚀 **Getting Started**

### 1. **Installation & Setup**

```bash
# Clone the repository
git clone <repository-url>
cd aikoryu-system

# Install dependencies
npm install

# Build the system
npm run build

# Start the system
npm start
```

### 2. **Environment Configuration**

```bash
# Environment variables
export NODE_ENV=production
export PORT=3000
export LOG_LEVEL=info
export ENABLE_GPU=true
export ENABLE_STREAMING=true
export OLLAMA_ENDPOINT=http://localhost:11434
export DEFAULT_MODEL=qwen3
```

### 3. **System Initialization**

The system automatically initializes all agents on startup:

```bash
npm start
```

**Expected Output:**
```
🎯 AikoRyu Autonomous Agent Orchestration System
🔬 Version: 1.0.0
🏗️  Architecture: DDD/SDD Aligned
🚀 GPU Optimization: Enabled
🧠 LLM Consistency: Deterministic Replay

🚀 Initializing AikoRyu System...
📊 Environment: production
🔧 GPU Optimization: Enabled
🌊 Streaming: Enabled

✅ aiko agent initialized
✅ sarah agent initialized
✅ ryu agent initialized
✅ alex agent initialized
✅ maya agent initialized
✅ specificationEngine agent initialized
✅ orchestrationManager agent initialized
✅ performanceOptimizer agent initialized
✅ neuralNetworkComposer agent initialized
✅ gpuAccelerator agent initialized

📈 Agent initialization complete: 10/10 agents ready
🎉 AikoRyu System is ready for production!
```

## 🤖 **Agent Usage**

### **AikoAgent - Semantic Validator**

**Purpose**: Validates specifications and ensures semantic coherence

```typescript
import { AikoAgent } from './agents/AikoAgent';

const aiko = new AikoAgent('aiko-main');
await aiko.initialize();

// Validate a specification
const spec = {
  id: 'project-001',
  name: 'E-commerce Platform',
  requirements: ['user auth', 'product catalog', 'payment processing']
};

const result = await aiko.validateSpecification(spec);
console.log(result);
// Output: { result: true, consensus: true, validation: {...} }
```

### **SarahAgent - RAG Engine**

**Purpose**: Knowledge retrieval and semantic search

```typescript
import { SarahAgent } from './agents/SarahAgent';

const sarah = new SarahAgent({
  ollamaEndpoint: 'http://localhost:11434',
  defaultModel: 'qwen3',
  gpuOptimization: true
});

// Retrieve knowledge
const knowledge = await sarah.retrieveKnowledge('authentication patterns');
console.log(knowledge);
// Output: { content: '...', sources: [...], confidence: 0.95 }
```

### **AlexAgent - DAG Orchestrator**

**Purpose**: Workflow orchestration and dependency resolution

```typescript
import { AlexAgent } from './agents/AlexAgent';

const alex = new AlexAgent();
await alex.initialize();

// Create execution DAG
const dag = await alex.createExecutionDAG({
  spec: projectSpec,
  requirements: ['frontend', 'backend', 'database'],
  constraints: ['performance', 'security']
});

console.log(dag);
// Output: { components: [...], dependencies: [...], executionOrder: [...] }
```

### **MayaAgent - Context Manager**

**Purpose**: Context propagation and state management

```typescript
import { MayaAgent } from './agents/MayaAgent';

const maya = new MayaAgent();
await maya.initialize();

// Propagate context
const contextSlice = {
  id: 'context-001',
  domain: 'ecommerce',
  state: 'planning',
  metadata: { complexity: 'high', priority: 'critical' }
};

const result = await maya.propagateContext(contextSlice);
console.log(result);
// Output: { propagatedTo: [...], conflicts: [...], enrichments: [...] }
```

### **RyuAgent - Integrity Guardian**

**Purpose**: Security validation and compliance checking

```typescript
import { RyuAgent } from './agents/RyuAgent';

const ryu = new RyuAgent();
await ryu.initialize();

// Verify system integrity
const integrity = await ryu.verifySystemIntegrity({
  security: true,
  compliance: true,
  performance: true,
  quality: true
});

console.log(integrity);
// Output: { security: true, compliance: true, performance: true, quality: true }
```

## 🕸️ **Mesh System Usage**

### **Basic Mesh Operations**

```typescript
import { AikoRyuMesh } from './mesh';

// Initialize mesh system
const mesh = new AikoRyuMesh({
  maxConcurrency: 10,
  eventTimeout: 5000,
  workflowTimeout: 30000,
  retryAttempts: 3,
  enableTracing: true,
  enableMetrics: true,
  logLevel: 'info',
  agents: []
});

await mesh.initialize();

// Get system status
const status = mesh.getStatus();
console.log(status);
// Output: { status: 'ready', uptime: 1234, agentCount: 10, ... }
```

### **Workflow Orchestration**

```typescript
// Define a workflow
const workflow = {
  id: 'workflow-001',
  name: 'Project Build Workflow',
  description: 'Build a complete project from specification',
  agents: ['aiko', 'alex', 'sarah', 'maya', 'ryu'],
  steps: [
    {
      id: 'step-1',
      agentId: 'aiko',
      action: 'validateSpecification',
      parameters: { spec: projectSpec },
      timeout: 5000
    },
    {
      id: 'step-2',
      agentId: 'alex',
      action: 'createExecutionDAG',
      parameters: { requirements: ['frontend', 'backend'] },
      timeout: 10000
    }
  ],
  dependencies: [],
  timeout: 60000,
  retryPolicy: { maxAttempts: 3, backoffStrategy: 'exponential' },
  metadata: {}
};

// Orchestrate the workflow
const result = await mesh.orchestrateWorkflow(workflow);
console.log(result);
// Output: { success: true, workflowId: 'workflow-001', status: 'completed', ... }
```

### **Event Routing**

```typescript
// Route an event to specific agents
const routingResult = await mesh.routeEvent(
  'specification.validated',
  { specId: 'spec-001', result: true },
  'aiko'
);

console.log(routingResult);
// Output: { success: true, routedTo: ['alex', 'sarah'], ... }

// Broadcast an event to all agents
const broadcastResult = await mesh.broadcastEvent(
  'system.ready',
  { timestamp: new Date() },
  'mesh'
);

console.log(broadcastResult);
// Output: { success: true, broadcastTo: ['aiko', 'alex', 'sarah', ...], ... }
```

## 📊 **Monitoring & Observability**

### **System Metrics**

```typescript
// Get system metrics
const metrics = await mesh.getSystemMetrics();
console.log(metrics);
// Output: { totalAgents: 10, activeAgents: 10, totalWorkflows: 5, ... }
```

### **Event History**

```typescript
// Get recent events
const events = await mesh.getEventHistory(50);
events.forEach(event => {
  console.log(`${event.timestamp}: ${event.eventType} from ${event.sourceAgent}`);
});
```

### **Agent Interactions**

```typescript
// Get agent interaction history
const interactions = await mesh.getAgentInteractions('aiko');
interactions.forEach(interaction => {
  console.log(`${interaction.timestamp}: ${interaction.sourceAgent} → ${interaction.targetAgent}`);
});
```

## 🔧 **Configuration Management**

### **Update System Configuration**

```typescript
// Update mesh configuration
const newConfig = {
  maxConcurrency: 20,
  eventTimeout: 10000,
  workflowTimeout: 60000,
  retryAttempts: 5,
  enableTracing: true,
  enableMetrics: true,
  logLevel: 'debug',
  agents: [
    { agentId: 'aiko', enabled: true, maxConcurrency: 5 },
    { agentId: 'sarah', enabled: true, maxConcurrency: 3 }
  ]
};

const success = await mesh.updateConfiguration(newConfig);
console.log(`Configuration updated: ${success}`);
```

## 🚀 **Production Deployment**

### **Docker Deployment**

```bash
# Build Docker image
npm run docker:build

# Run with Docker
npm run docker:run

# Or use docker-compose
docker-compose up -d
```

### **Environment-Specific Configuration**

```bash
# Development
NODE_ENV=development npm start

# Production
NODE_ENV=production npm start

# With GPU acceleration
ENABLE_GPU=true npm start

# With streaming enabled
ENABLE_STREAMING=true npm start
```

## 🧪 **Testing & Validation**

### **Run Tests**

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- --testNamePattern="Agent"

# Run with coverage
npm test -- --coverage
```

### **Linting & Type Checking**

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check
```

## 📈 **Performance Optimization**

### **GPU Acceleration**

```typescript
import { GPUAccelerator } from './agents/GPUAccelerator';

const gpu = new GPUAccelerator();
await gpu.initialize();

// Enable GPU acceleration for compute-intensive tasks
const result = await gpu.accelerateComputation({
  operation: 'matrix-multiplication',
  data: largeMatrix,
  optimization: 'gpu'
});
```

### **Performance Monitoring**

```typescript
import { PerformanceOptimizer } from './agents/PerformanceOptimizer';

const optimizer = new PerformanceOptimizer();
await optimizer.initialize();

// Optimize system performance
const optimization = await optimizer.optimizeSystem({
  targetFPS: 60,
  maxLatency: 100,
  concurrentOperations: 100
});
```

## 🔒 **Security & Compliance**

### **Integrity Verification**

```typescript
import { RyuAgent } from './agents/RyuAgent';

const ryu = new RyuAgent();
await ryu.initialize();

// Verify system integrity
const integrity = await ryu.verifySystemIntegrity({
  security: true,
  compliance: true,
  performance: true,
  quality: true
});

if (integrity.security && integrity.compliance) {
  console.log('✅ System integrity verified');
} else {
  console.log('❌ System integrity issues detected');
}
```

## 📚 **Advanced Usage Patterns**

### **Custom Agent Development**

```typescript
import { AgentContract } from './agents/AgentContract';

class CustomAgent implements AgentContract {
  readonly id: string;
  readonly role: string;
  
  constructor(id: string) {
    this.id = id;
    this.role = 'custom-agent';
  }
  
  async initialize(): Promise<void> {
    // Custom initialization logic
  }
  
  async shutdown(): Promise<void> {
    // Custom shutdown logic
  }
  
  getStatus(): AgentStatus {
    return { status: 'ready', uptime: Date.now() };
  }
  
  emitTrace(event: TraceEvent): void {
    // Custom trace emission
  }
}

// Register custom agent
const customAgent = new CustomAgent('custom-001');
await mesh.registerAgent(customAgent);
```

### **Workflow Composition**

```typescript
// Create complex workflows with dependencies
const complexWorkflow = {
  id: 'complex-workflow',
  name: 'Multi-Stage Project Build',
  steps: [
    {
      id: 'validate',
      agentId: 'aiko',
      action: 'validateSpecification',
      dependencies: []
    },
    {
      id: 'plan',
      agentId: 'alex',
      action: 'createExecutionDAG',
      dependencies: ['validate']
    },
    {
      id: 'retrieve',
      agentId: 'sarah',
      action: 'retrieveKnowledge',
      dependencies: ['validate']
    },
    {
      id: 'propagate',
      agentId: 'maya',
      action: 'propagateContext',
      dependencies: ['plan', 'retrieve']
    },
    {
      id: 'verify',
      agentId: 'ryu',
      action: 'verifySystemIntegrity',
      dependencies: ['propagate']
    }
  ]
};

const result = await mesh.orchestrateWorkflow(complexWorkflow);
```

## 🎯 **Best Practices**

### **1. Agent Design**
- Each agent should have a single, clear responsibility
- Implement proper error handling and recovery
- Use the trace system for observability
- Follow the AgentContract interface

### **2. Workflow Design**
- Keep workflows focused and composable
- Use appropriate timeouts and retry policies
- Implement proper error handling
- Consider dependencies and execution order

### **3. System Monitoring**
- Enable tracing and metrics in production
- Monitor agent health and performance
- Use system snapshots for recovery
- Implement proper logging

### **4. Security**
- Validate all inputs and outputs
- Implement proper access controls
- Use the integrity guardian for compliance
- Regular security audits

## 🚀 **Quick Reference**

### **Common Commands**

```bash
# Start system
npm start

# Build system
npm run build

# Run tests
npm test

# Deploy with Docker
npm run docker:deploy

# Production deployment
npm run prod
```

### **Key Agents**

| Agent | Purpose | Key Methods |
|-------|---------|-------------|
| **Aiko** | Semantic Validation | `validateSpecification()` |
| **Sarah** | Knowledge Retrieval | `retrieveKnowledge()` |
| **Alex** | DAG Orchestration | `createExecutionDAG()` |
| **Maya** | Context Management | `propagateContext()` |
| **Ryu** | Integrity Guardian | `verifySystemIntegrity()` |

### **System Status**

```typescript
// Check system status
const status = mesh.getStatus();
console.log(`Status: ${status.status}`);
console.log(`Uptime: ${status.uptime}ms`);
console.log(`Agents: ${status.agentCount}`);
```

**The AikoRyu system provides a comprehensive platform for autonomous software construction with full observability, security, and scalability!** 🎉 