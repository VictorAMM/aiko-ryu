# 🚀 AikoRyu System - Practical Usage Examples

## 📋 **Overview**

This guide shows practical examples of how to use the AikoRyu autonomous agent orchestration system with real responses from Ollama.

## 🎯 **Quick Start**

### 1. **Basic Knowledge Retrieval**

```javascript
const { AGENT_REGISTRY } = require('./build/index.js');

async function basicKnowledgeRetrieval() {
  const sarah = AGENT_REGISTRY.sarah;
  
  // Get knowledge about a topic
  const knowledge = await sarah.retrieveKnowledge('What is Domain-Driven Design?');
  
  console.log('Knowledge:', {
    content: knowledge.content.substring(0, 200) + '...',
    modelUsed: knowledge.modelUsed,
    tokensUsed: knowledge.tokensUsed,
    confidence: Math.round(knowledge.confidence * 100) + '%'
  });
}
```

### 2. **Response Generation with Context**

```javascript
async function generateResponseWithContext() {
  const sarah = AGENT_REGISTRY.sarah;
  
  // Generate a response with specific context
  const response = await sarah.generateResponse(
    'Explain the benefits of microservices architecture',
    {
      domain: 'software-architecture',
      temperature: 0.7,
      maxTokens: 500
    }
  );
  
  console.log('Generated Response:', {
    text: response.text.substring(0, 200) + '...',
    model: response.model,
    tokens: response.tokens,
    latency: response.latency + 'ms'
  });
}
```

### 3. **Specification Validation**

```javascript
async function validateSpecification() {
  const aiko = AGENT_REGISTRY.aiko;
  
  const spec = {
    id: 'ecommerce-platform',
    name: 'E-commerce Platform',
    description: 'A modern e-commerce platform',
    role: 'E-commerce Platform',
    dependencies: ['sarah', 'alex', 'maya'],
    capabilities: [
      {
        id: 'user-auth',
        name: 'User Authentication',
        description: 'Secure user authentication',
        inputs: [{ name: 'credentials', type: 'object', required: true }],
        outputs: [{ name: 'token', type: 'string', required: true }]
      }
    ],
    interfaces: [
      {
        name: 'auth-interface',
        description: 'Authentication interface',
        methods: [{ name: 'login', description: 'User login method' }]
      }
    ]
  };
  
  const validation = aiko.validateSpecification(spec);
  
  console.log('Validation Result:', {
    result: validation.result,
    consensus: validation.consensus,
    reason: validation.reason
  });
}
```

### 4. **System Status Monitoring**

```javascript
async function checkSystemStatus() {
  const ryu = AGENT_REGISTRY.ryu;
  const maya = AGENT_REGISTRY.maya;
  
  // Check system integrity
  const integrity = ryu.getStatus();
  console.log('System Integrity:', integrity);
  
  // Track user interaction
  await maya.trackUserInteraction({
    userId: 'user-123',
    action: 'knowledge-query',
    outcome: 'success',
    timestamp: new Date(),
    sessionDuration: 5000,
    context: { domain: 'software-development' }
  });
}
```

### 5. **Model Management**

```javascript
async function manageModels() {
  const sarah = AGENT_REGISTRY.sarah;
  
  // List available models
  const models = await sarah.listAvailableModels();
  console.log('Available Models:', models.map(m => m.name));
  
  // Load a specific model
  const loadResult = await sarah.loadModel('llama2:latest');
  console.log('Model Load Result:', loadResult);
}
```

## 🏗️ **Advanced Usage Patterns**

### **Pattern 1: Multi-Agent Workflow**

```javascript
async function multiAgentWorkflow() {
  const { AGENT_REGISTRY } = require('./build/index.js');
  
  // 1. Validate specification with AikoAgent
  const aiko = AGENT_REGISTRY.aiko;
  const spec = { /* your specification */ };
  const validation = aiko.validateSpecification(spec);
  
  if (!validation.result) {
    console.error('Specification validation failed:', validation.reason);
    return;
  }
  
  // 2. Retrieve knowledge with SarahAgent
  const sarah = AGENT_REGISTRY.sarah;
  const knowledge = await sarah.retrieveKnowledge('Your query here');
  
  // 3. Generate response with context
  const response = await sarah.generateResponse(
    'Generate implementation plan',
    {
      domain: 'software-development',
      temperature: 0.5,
      maxTokens: 1000
    }
  );
  
  // 4. Track interaction with MayaAgent
  const maya = AGENT_REGISTRY.maya;
  await maya.trackUserInteraction({
    userId: 'user-123',
    action: 'workflow-execution',
    outcome: 'success',
    timestamp: new Date(),
    sessionDuration: Date.now() - startTime,
    context: { workflow: 'multi-agent' }
  });
  
  return { validation, knowledge, response };
}
```

### **Pattern 2: Domain-Specific Knowledge Retrieval**

```javascript
async function domainSpecificKnowledge(domain, query) {
  const sarah = AGENT_REGISTRY.sarah;
  
  const knowledge = await sarah.retrieveKnowledge(query, {
    domain: domain,
    confidenceThreshold: 0.8,
    maxTokens: 500
  });
  
  const response = await sarah.generateResponse(
    `Provide a comprehensive analysis of ${query} in the context of ${domain}`,
    {
      domain: domain,
      temperature: 0.7,
      maxTokens: 800
    }
  );
  
  return { knowledge, response };
}

// Usage examples:
// await domainSpecificKnowledge('ecommerce', 'payment processing');
// await domainSpecificKnowledge('healthcare', 'patient data security');
// await domainSpecificKnowledge('finance', 'risk management');
```

### **Pattern 3: Real-Time Response Generation**

```javascript
async function realTimeResponseGeneration(prompt, options = {}) {
  const sarah = AGENT_REGISTRY.sarah;
  
  const startTime = Date.now();
  
  try {
    const response = await sarah.generateResponse(prompt, {
      temperature: options.temperature || 0.7,
      maxTokens: options.maxTokens || 500,
      domain: options.domain || 'general',
      ...options
    });
    
    const duration = Date.now() - startTime;
    
    return {
      success: true,
      response: response.text,
      metadata: {
        model: response.model,
        tokens: response.tokens,
        latency: response.latency,
        confidence: response.confidence,
        totalDuration: duration
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      duration: Date.now() - startTime
    };
  }
}
```

## 📊 **Performance Monitoring**

```javascript
async function monitorPerformance() {
  const sarah = AGENT_REGISTRY.sarah;
  
  const metrics = {
    knowledgeRetrieval: [],
    responseGeneration: [],
    modelUsage: new Map()
  };
  
  // Monitor knowledge retrieval performance
  const startTime = Date.now();
  const knowledge = await sarah.retrieveKnowledge('Test query');
  const retrievalTime = Date.now() - startTime;
  
  metrics.knowledgeRetrieval.push({
    query: 'Test query',
    responseTime: knowledge.responseTime,
    tokens: knowledge.tokensUsed,
    confidence: knowledge.confidence,
    model: knowledge.modelUsed
  });
  
  // Monitor response generation performance
  const responseStart = Date.now();
  const response = await sarah.generateResponse('Test prompt');
  const generationTime = Date.now() - responseStart;
  
  metrics.responseGeneration.push({
    prompt: 'Test prompt',
    latency: response.latency,
    tokens: response.tokens,
    confidence: response.confidence,
    model: response.model
  });
  
  console.log('Performance Metrics:', metrics);
}
```

## 🔧 **Configuration Examples**

### **Environment Setup**

```bash
# Production configuration
export NODE_ENV=production
export OLLAMA_ENDPOINT=http://localhost:11434
export DEFAULT_MODEL=qwen3:latest
export ENABLE_GPU=true
export LOG_LEVEL=info

# Development configuration
export NODE_ENV=development
export OLLAMA_ENDPOINT=http://localhost:11434
export DEFAULT_MODEL=llama2:latest
export ENABLE_GPU=false
export LOG_LEVEL=debug
```

### **Agent Configuration**

```javascript
// Custom agent configuration
const sarah = new SarahAgent({
  ollamaEndpoint: 'http://localhost:11434',
  defaultModel: 'qwen3:latest',
  gpuOptimization: true,
  gpuConfig: {
    // GPU-specific configuration
  }
});

const aiko = new AikoAgent('aiko-main');
const ryu = new RyuAgent();
const alex = new AlexAgent();
const maya = new MayaAgent();
```

## 🎯 **Best Practices**

1. **Always handle errors gracefully**
2. **Monitor performance metrics**
3. **Use appropriate temperature settings for different tasks**
4. **Set reasonable token limits**
5. **Track user interactions for context**
6. **Validate specifications before processing**
7. **Monitor system integrity regularly**

## 🚀 **Production Deployment**

The AikoRyu system is production-ready with:
- ✅ Real LLM responses from Ollama
- ✅ Response cleaning and optimization
- ✅ Performance monitoring
- ✅ Error handling and recovery
- ✅ Multi-agent orchestration
- ✅ Context management
- ✅ Integrity monitoring

**Ready to deploy!** 🎉 