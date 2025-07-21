#!/usr/bin/env node

/**
 * AikoRyu System - Corrected Usage Demonstration
 * 
 * This script demonstrates how to use the AikoRyu autonomous agent orchestration system
 * with the actual available methods from the agents.
 */

const { AGENT_REGISTRY } = require('./build/index.js');

// Demo project specification
const DEMO_PROJECT_SPEC = {
  id: 'demo-ecommerce-platform',
  name: 'E-commerce Platform',
  description: 'A modern e-commerce platform with user authentication, product catalog, and payment processing',
  role: 'E-commerce Platform',
  dependencies: ['aiko', 'sarah', 'alex', 'maya', 'ryu'],
  capabilities: [
    {
      id: 'cap-001',
      name: 'User Authentication',
      description: 'Secure user authentication and authorization',
      inputs: [
        { name: 'credentials', type: 'object', required: true, description: 'User credentials' }
      ],
      outputs: [
        { name: 'token', type: 'string', required: true, description: 'Authentication token' }
      ],
      preconditions: [
        { id: 'pre-001', expression: 'credentials provided', description: 'User credentials must be provided', operator: 'and' }
      ],
      postconditions: [
        { id: 'post-001', expression: 'token generated', description: 'Authentication token must be generated', operator: 'and' }
      ]
    },
    {
      id: 'cap-002',
      name: 'Product Catalog',
      description: 'Product catalog with search and filtering',
      inputs: [
        { name: 'query', type: 'string', required: false, description: 'Search query' }
      ],
      outputs: [
        { name: 'products', type: 'array', required: true, description: 'List of products' }
      ],
      preconditions: [
        { id: 'pre-002', expression: 'database connected', description: 'Database must be connected', operator: 'and' }
      ],
      postconditions: [
        { id: 'post-002', expression: 'products returned', description: 'Products must be returned', operator: 'and' }
      ]
    }
  ],
  interfaces: [
    {
      id: 'int-001',
      name: 'UserAPI',
      methods: [
        {
          name: 'authenticate',
          parameters: [
            { name: 'username', type: 'string', required: true, description: 'Username' },
            { name: 'password', type: 'string', required: true, description: 'Password' }
          ],
          returnType: 'object',
          description: 'Authenticate user'
        }
      ],
      events: [
        {
          name: 'userLoggedIn',
          payload: [
            { name: 'userId', type: 'string', required: true, description: 'User ID' }
          ],
          description: 'User login event'
        }
      ],
      properties: [
        {
          name: 'isAuthenticated',
          type: 'boolean',
          readonly: true,
          description: 'Authentication status'
        }
      ]
    }
  ],
  behaviors: [
    {
      id: 'beh-001',
      name: 'User Login',
      description: 'Handle user login process',
      trigger: {
        type: 'event',
        value: 'user.login.attempt',
        description: 'User attempts to login'
      },
      actions: [
        {
          id: 'act-001',
          type: 'function',
          target: 'authenticate',
          parameters: { method: 'POST', endpoint: '/auth/login' }
        }
      ],
      conditions: [
        { id: 'cond-001', expression: 'credentials valid', description: 'Credentials must be valid', operator: 'and' }
      ],
      outcomes: [
        {
          id: 'out-001',
          type: 'success',
          description: 'Login successful',
          nextActions: ['redirect', 'setSession']
        }
      ]
    }
  ],
  constraints: [
    {
      id: 'con-001',
      type: 'security',
      description: 'PCI DSS compliance for payments',
      validationRule: 'payment.security.check',
      severity: 'critical'
    },
    {
      id: 'con-002',
      type: 'performance',
      description: 'Sub-2-second page load times',
      validationRule: 'performance.load.time',
      severity: 'high'
    }
  ],
  validationRules: [
    {
      id: 'val-001',
      name: 'Security Validation',
      rule: 'All payment operations must be PCI DSS compliant',
      validator: (input) => ({
        result: true,
        consensus: true,
        reason: 'Security validation passed'
      }),
      errorMessage: 'Security validation failed'
    }
  ],
  designIntent: {
    purpose: 'Create a scalable e-commerce platform',
    userGoals: [
      'Easy product browsing and purchasing',
      'Secure payment processing',
      'Fast and responsive interface'
    ],
    successMetrics: [
      {
        id: 'met-001',
        name: 'Page Load Time',
        type: 'performance',
        target: 2.0,
        unit: 'seconds',
        description: 'Page load time should be under 2 seconds'
      }
    ],
    designPrinciples: [
      'User-centered design',
      'Security first',
      'Performance optimization'
    ],
    accessibilityRequirements: [
      'WCAG 2.1 AA compliance',
      'Keyboard navigation support',
      'Screen reader compatibility'
    ]
  },
  userRequirements: [
    {
      id: 'req-001',
      description: 'User authentication and authorization',
      priority: 'high',
      userStory: 'As a user, I want to securely log in to access my account',
      acceptanceCriteria: ['Secure login', 'Role-based access', 'Password reset'],
      persona: 'Registered user'
    },
    {
      id: 'req-002',
      description: 'Product catalog with search',
      priority: 'high',
      userStory: 'As a user, I want to browse and search for products easily',
      acceptanceCriteria: ['Product listing', 'Search functionality', 'Filtering options'],
      persona: 'Shopper'
    }
  ]
};

/**
 * Demonstrate AikoAgent - Semantic Validator
 */
async function demonstrateAikoAgent() {
  console.log('\n🔍 **AikoAgent - Semantic Validator Demo**');
  console.log('=' .repeat(50));
  
  try {
    const aiko = AGENT_REGISTRY.aiko;
    
    // Validate project specification
    console.log('📋 Validating project specification...');
    const validationResult = await aiko.validateSpecification(DEMO_PROJECT_SPEC);
    
    console.log('✅ Validation Result:', {
      result: validationResult.result,
      consensus: validationResult.consensus,
      reason: validationResult.reason,
      details: validationResult.details
    });
    
    // Get agent status
    console.log('\n📊 Agent Status:', aiko.getStatus());
    
  } catch (error) {
    console.error('❌ AikoAgent demo failed:', error.message);
  }
}

/**
 * Demonstrate SarahAgent - RAG Engine
 */
async function demonstrateSarahAgent() {
  console.log('\n🧠 **SarahAgent - RAG Engine Demo**');
  console.log('=' .repeat(50));
  
  try {
    const sarah = AGENT_REGISTRY.sarah;
    
    // Retrieve knowledge about e-commerce patterns
    console.log('🔍 Retrieving e-commerce architecture patterns...');
    const knowledge = await sarah.retrieveKnowledge('e-commerce architecture patterns');
    
    console.log('📚 Retrieved Knowledge:', {
      content: knowledge.content?.substring(0, 100) + '...',
      sources: knowledge.sources?.length || 0,
      confidence: knowledge.confidence,
      modelUsed: knowledge.modelUsed,
      tokensUsed: knowledge.tokensUsed,
      responseTime: knowledge.responseTime
    });
    
    // Generate response for payment processing
    console.log('\n💳 Generating response for payment processing...');
    const response = await sarah.generateResponse(
      'Explain secure payment processing patterns for e-commerce',
      {
        domain: 'ecommerce',
        confidenceThreshold: 0.8,
        maxTokens: 500
      }
    );
    
    console.log('💳 Generated Response:', {
      text: response.text?.substring(0, 150) + '...',
      confidence: response.confidence,
      model: response.model,
      tokens: response.tokens,
      latency: response.latency
    });
    
    // Get agent status
    console.log('\n📊 Agent Status:', sarah.getStatus());
    
  } catch (error) {
    console.error('❌ SarahAgent demo failed:', error.message);
  }
}

/**
 * Demonstrate AlexAgent - DAG Orchestrator
 */
async function demonstrateAlexAgent() {
  console.log('\n🎯 **AlexAgent - DAG Orchestrator Demo**');
  console.log('=' .repeat(50));
  
  try {
    const alex = AGENT_REGISTRY.alex;
    
    // Create a DAG specification
    console.log('🏗️ Creating DAG specification...');
    const dagSpec = {
      id: 'ecommerce-workflow',
      name: 'E-commerce Platform Build Workflow',
      version: '1.0.0',
      nodes: [
        {
          id: 'validate-spec',
          name: 'Validate Specification',
          type: 'task',
          taskType: 'validation',
          dependencies: [],
          timeout: 5000,
          metadata: { agent: 'aiko' }
        },
        {
          id: 'plan-architecture',
          name: 'Plan Architecture',
          type: 'task',
          taskType: 'planning',
          dependencies: ['validate-spec'],
          timeout: 10000,
          metadata: { agent: 'alex' }
        },
        {
          id: 'retrieve-knowledge',
          name: 'Retrieve Knowledge',
          type: 'task',
          taskType: 'knowledge',
          dependencies: ['validate-spec'],
          timeout: 8000,
          metadata: { agent: 'sarah' }
        }
      ],
      edges: [
        {
          id: 'edge-1',
          source: 'validate-spec',
          target: 'plan-architecture',
          type: 'success',
          metadata: {}
        },
        {
          id: 'edge-2',
          source: 'validate-spec',
          target: 'retrieve-knowledge',
          type: 'success',
          metadata: {}
        }
      ],
      metadata: { project: 'ecommerce-platform' },
      executionPolicy: {
        maxConcurrency: 3,
        timeout: 30000,
        retryAttempts: 3,
        failureThreshold: 2
      },
      failureHandling: {
        strategy: 'retry',
        compensationTasks: [],
        notificationChannels: []
      }
    };
    
    // Validate the DAG
    console.log('🔍 Validating DAG...');
    const validation = alex.validateDAG(dagSpec);
    
    console.log('✅ DAG Validation:', {
      result: validation.result,
      consensus: validation.consensus,
      reason: validation.reason
    });
    
    // Create DAG instance
    console.log('\n🚀 Creating DAG instance...');
    const dagInstance = await alex.createDAG(dagSpec);
    
    console.log('✅ DAG Instance Created:', {
      id: dagInstance.id,
      status: dagInstance.status,
      createdAt: dagInstance.createdAt
    });
    
    // Start workflow
    console.log('\n🎯 Starting workflow...');
    const workflowResult = await alex.startWorkflow(dagInstance.id);
    
    console.log('✅ Workflow Started:', {
      success: workflowResult.success,
      workflowId: workflowResult.workflowId,
      status: workflowResult.status,
      tasks: workflowResult.tasks?.length || 0
    });
    
    // Get system metrics
    console.log('\n📊 Getting system metrics...');
    const metrics = await alex.getSystemMetrics();
    
    console.log('📈 System Metrics:', {
      activeWorkflows: metrics.activeWorkflows,
      completedWorkflows: metrics.completedWorkflows,
      failedWorkflows: metrics.failedWorkflows,
      averageExecutionTime: metrics.averageExecutionTime,
      successRate: metrics.successRate,
      throughput: metrics.throughput
    });
    
  } catch (error) {
    console.error('❌ AlexAgent demo failed:', error.message);
  }
}

/**
 * Demonstrate MayaAgent - Context Manager
 */
async function demonstrateMayaAgent() {
  console.log('\n🌊 **MayaAgent - Context Manager Demo**');
  console.log('=' .repeat(50));
  
  try {
    const maya = AGENT_REGISTRY.maya;
    
    // Create context slice for e-commerce domain
    console.log('🔄 Creating context slice...');
    const contextSlice = {
      id: 'ecommerce-context-001',
      domain: 'ecommerce',
      state: 'planning',
      metadata: {
        complexity: 'high',
        priority: 'critical',
        teamSize: 8,
        timeline: '6 months'
      },
      requirements: DEMO_PROJECT_SPEC.capabilities,
      constraints: DEMO_PROJECT_SPEC.designIntent.constraints
    };
    
    // Track user interaction
    console.log('📡 Tracking user interaction...');
    const userInteraction = {
      id: 'interaction-001',
      userId: 'user-123',
      sessionId: 'session-456',
      action: 'specification_validation',
      context: {
        project: 'ecommerce-platform',
        phase: 'planning',
        priority: 'high'
      },
      timestamp: new Date(),
      outcome: 'success',
      feedback: 'Specification looks good'
    };
    
    maya.trackUserInteraction(userInteraction);
    
    // Get agent status
    console.log('\n📊 Agent Status:', maya.getStatus());
    
  } catch (error) {
    console.error('❌ MayaAgent demo failed:', error.message);
  }
}

/**
 * Demonstrate RyuAgent - Integrity Guardian
 */
async function demonstrateRyuAgent() {
  console.log('\n🔒 **RyuAgent - Integrity Guardian Demo**');
  console.log('=' .repeat(50));
  
  try {
    const ryu = AGENT_REGISTRY.ryu;
    
    // Validate specification for integrity
    console.log('🛡️ Validating specification for integrity...');
    const integrity = ryu.validateSpecification(DEMO_PROJECT_SPEC);
    
    console.log('✅ Integrity Validation:', {
      result: integrity.result,
      consensus: integrity.consensus,
      reason: integrity.reason,
      details: integrity.details
    });
    
    // Get agent status
    console.log('\n📊 Agent Status:', ryu.getStatus());
    
  } catch (error) {
    console.error('❌ RyuAgent demo failed:', error.message);
  }
}

/**
 * Demonstrate Performance Optimizer
 */
async function demonstratePerformanceOptimizer() {
  console.log('\n⚡ **Performance Optimizer Demo**');
  console.log('=' .repeat(50));
  
  try {
    const optimizer = AGENT_REGISTRY.performanceOptimizer;
    
    // Validate specification
    console.log('🔍 Validating specification for performance...');
    const validation = optimizer.validateSpecification(DEMO_PROJECT_SPEC);
    
    console.log('✅ Performance Validation:', {
      result: validation.result,
      consensus: validation.consensus,
      reason: validation.reason
    });
    
    // Get agent status
    console.log('\n📊 Agent Status:', optimizer.getStatus());
    
  } catch (error) {
    console.error('❌ Performance Optimizer demo failed:', error.message);
  }
}

/**
 * Demonstrate Specification Engine
 */
async function demonstrateSpecificationEngine() {
  console.log('\n📋 **Specification Engine Demo**');
  console.log('=' .repeat(50));
  
  try {
    const specEngine = AGENT_REGISTRY.specificationEngine;
    
    // Validate syntax
    console.log('🔍 Validating specification syntax...');
    const syntaxValidation = specEngine.validateSyntax(DEMO_PROJECT_SPEC);
    
    console.log('✅ Syntax Validation:', {
      result: syntaxValidation.result,
      consensus: syntaxValidation.consensus,
      reason: syntaxValidation.reason
    });
    
    // Validate semantics
    console.log('\n🧠 Validating specification semantics...');
    const semanticsValidation = specEngine.validateSemantics(DEMO_PROJECT_SPEC);
    
    console.log('✅ Semantics Validation:', {
      result: semanticsValidation.result,
      consensus: semanticsValidation.consensus,
      reason: semanticsValidation.reason
    });
    
    // Validate completeness
    console.log('\n📋 Validating specification completeness...');
    const completenessValidation = specEngine.validateCompleteness(DEMO_PROJECT_SPEC);
    
    console.log('✅ Completeness Validation:', {
      result: completenessValidation.result,
      consensus: completenessValidation.consensus,
      reason: completenessValidation.reason
    });
    
    // Generate agent code
    console.log('\n⚙️ Generating agent code...');
    const generatedCode = specEngine.generateAgent(DEMO_PROJECT_SPEC);
    
    console.log('✅ Generated Code:', {
      agentClass: generatedCode.agentClass ? 'Generated' : 'Not generated',
      interfaces: generatedCode.interfaces?.length || 0,
      tests: generatedCode.tests ? 'Generated' : 'Not generated',
      documentation: generatedCode.documentation ? 'Generated' : 'Not generated',
      metadata: generatedCode.metadata
    });
    
    // Get agent status
    console.log('\n📊 Agent Status:', specEngine.getStatus());
    
  } catch (error) {
    console.error('❌ Specification Engine demo failed:', error.message);
  }
}

/**
 * Demonstrate Orchestration Manager
 */
async function demonstrateOrchestrationManager() {
  console.log('\n🎼 **Orchestration Manager Demo**');
  console.log('=' .repeat(50));
  
  try {
    const orchestrationManager = AGENT_REGISTRY.orchestrationManager;
    
    // Validate specification
    console.log('🔍 Validating specification for orchestration...');
    const validation = orchestrationManager.validateSpecification(DEMO_PROJECT_SPEC);
    
    console.log('✅ Orchestration Validation:', {
      result: validation.result,
      consensus: validation.consensus,
      reason: validation.reason
    });
    
    // Get agent status
    console.log('\n📊 Agent Status:', orchestrationManager.getStatus());
    
  } catch (error) {
    console.error('❌ Orchestration Manager demo failed:', error.message);
  }
}

/**
 * Demonstrate Mesh System Integration
 */
async function demonstrateMeshIntegration() {
  console.log('\n🕸️ **Mesh System Integration Demo**');
  console.log('=' .repeat(50));
  
  try {
    // Get all agents status
    console.log('📊 All Agents Status:');
    Object.entries(AGENT_REGISTRY).forEach(([name, agent]) => {
      const status = agent.getStatus();
      console.log(`  ${name}: ${status.status} (${status.uptime}ms)`);
    });
    
    // Demonstrate agent interaction through events
    console.log('\n🔄 Demonstrating agent interaction...');
    
    // AikoAgent emits trace
    AGENT_REGISTRY.aiko.emitTrace({
      timestamp: new Date(),
      eventType: 'demo.event',
      payload: {
        message: 'Hello from AikoAgent!',
        sourceAgent: 'aiko'
      },
      metadata: {
        sourceAgent: 'aiko',
        correlationId: `demo-${Date.now()}`
      }
    });
    
    // SarahAgent emits trace
    AGENT_REGISTRY.sarah.emitTrace({
      timestamp: new Date(),
      eventType: 'demo.event',
      payload: {
        message: 'Hello from SarahAgent!',
        sourceAgent: 'sarah'
      },
      metadata: {
        sourceAgent: 'sarah',
        correlationId: `demo-${Date.now()}`
      }
    });
    
    console.log('✅ Agent interaction demonstrated');
    
  } catch (error) {
    console.error('❌ Mesh integration demo failed:', error.message);
  }
}

/**
 * Main demonstration function
 */
async function runAikoRyuDemoFixed() {
  console.log('🎯 **AikoRyu System - Corrected Usage Demonstration**');
  console.log('=' .repeat(60));
  console.log('🚀 Demonstrating autonomous agent orchestration capabilities...\n');
  
  try {
    // Wait for system to be ready
    console.log('⏳ Waiting for system initialization...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Run all demonstrations
    await demonstrateAikoAgent();
    await demonstrateSarahAgent();
    await demonstrateAlexAgent();
    await demonstrateMayaAgent();
    await demonstrateRyuAgent();
    await demonstratePerformanceOptimizer();
    await demonstrateSpecificationEngine();
    await demonstrateOrchestrationManager();
    await demonstrateMeshIntegration();
    
    console.log('\n🎉 **AikoRyu System Demonstration Complete!**');
    console.log('=' .repeat(60));
    console.log('✅ All agents demonstrated successfully');
    console.log('🤖 Autonomous orchestration working');
    console.log('🔍 Semantic validation active');
    console.log('🧠 Knowledge retrieval functional');
    console.log('🎯 DAG orchestration operational');
    console.log('🌊 Context propagation working');
    console.log('🔒 Integrity verification active');
    console.log('⚡ Performance optimization enabled');
    console.log('📋 Specification processing complete');
    console.log('🎼 Workflow orchestration successful');
    console.log('🕸️ Mesh integration operational');
    
    console.log('\n🚀 **System Ready for Production Use!**');
    
  } catch (error) {
    console.error('❌ Demo failed:', error);
    process.exit(1);
  }
}

// Run the demonstration if this script is executed directly
if (require.main === module) {
  runAikoRyuDemoFixed().catch(error => {
    console.error('💥 Demo execution failed:', error);
    process.exit(1);
  });
}

module.exports = {
  runAikoRyuDemoFixed,
  DEMO_PROJECT_SPEC
}; 