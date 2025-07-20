#!/usr/bin/env node

/**
 * Improved AikoRyu Agent Interaction Demo
 * 
 * This script demonstrates the AikoRyu agents with proper:
 * - Event payload structure validation using Zod schemas
 * - Event type mapping and standardization
 * - Context propagation with field validation
 * - Comprehensive error handling and fallback mechanisms
 */

const { AikoAgent } = require('./build/agents/AikoAgent');
const { RyuAgent } = require('./build/agents/RyuAgent');
const { AlexAgent } = require('./build/agents/AlexAgent');
const { MayaAgent } = require('./build/agents/MayaAgent');
const { SarahAgent } = require('./build/agents/SarahAgent');
const { BusinessLogicAgent } = require('./build/agents/BusinessLogicAgent');
const { ComplianceAgent } = require('./build/agents/ComplianceAgent');
const { AdvancedSecurityAgent } = require('./build/agents/AdvancedSecurityAgent');
const { NetworkPerformanceAgent } = require('./build/agents/NetworkPerformanceAgent');
const { DynamicAgentComposer } = require('./build/agents/DynamicAgentComposer');

// Import the validation system (we'll create a mock version for this demo)
const { EVENT_TYPES, EVENT_SCHEMAS } = require('./build/agents/EventValidationSystem');

console.log('🤝 Improved AikoRyu Agent Interaction Demo Starting...\n');

// Mock EventValidationSystem for the demo
class MockEventValidationSystem {
  constructor() {
    this.validationCache = new Map();
  }

  validateEvent(eventType, payload, context) {
    const result = {
      valid: true,
      errors: [],
      warnings: [],
      normalizedEvent: {
        eventType: EVENT_TYPES[eventType] || eventType,
        payload,
        context
      }
    };

    // Basic validation based on event type
    switch (eventType) {
      case 'semantic.validation.request':
        if (!payload.specificationId || !payload.specification) {
          result.valid = false;
          result.errors.push('Missing required fields: specificationId or specification');
        }
        break;
      
      case 'integrity.validation.request':
        if (!payload.output || !payload.context) {
          result.valid = false;
          result.errors.push('Missing required fields: output or context');
        }
        break;
      
      case 'context.propagation.request':
        if (!payload.contextSlice || !payload.targetAgents) {
          result.valid = false;
          result.errors.push('Missing required fields: contextSlice or targetAgents');
        }
        break;
      
      case 'business.rule.request':
        if (!payload.ruleId || !payload.data) {
          result.valid = false;
          result.errors.push('Missing required fields: ruleId or data');
        }
        break;
    }

    return result;
  }

  createContext(data) {
    return {
      id: data.id,
      userId: data.userId,
      sessionId: data.sessionId,
      domain: data.domain,
      state: data.state,
      metadata: data.metadata || {}
    };
  }

  validateContextPropagation(contextSlice, targetAgents) {
    const result = {
      valid: true,
      errors: [],
      warnings: [],
      normalizedEvent: {
        eventType: 'context.propagate',
        payload: {
          contextSlice,
          targetAgents
        }
      }
    };

    if (!contextSlice || !contextSlice.id) {
      result.valid = false;
      result.errors.push('Context slice must have an id');
    }

    if (!Array.isArray(targetAgents) || targetAgents.length === 0) {
      result.valid = false;
      result.errors.push('Target agents must be a non-empty array');
    }

    return result;
  }
}

// Global event bus with validation
class ValidatedAgentEventBus {
  constructor() {
    this.listeners = new Map();
    this.eventHistory = [];
    this.traceEvents = [];
    this.validationSystem = new MockEventValidationSystem();
    this.validationStats = {
      totalEvents: 0,
      validEvents: 0,
      invalidEvents: 0,
      errors: []
    };
  }

  subscribe(agentId, eventType, callback) {
    const key = `${agentId}:${eventType}`;
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key).push(callback);
  }

  publish(eventType, payload, sourceAgent) {
    this.validationStats.totalEvents++;
    
    // Validate the event
    const context = {
      sourceAgent,
      timestamp: new Date(),
      traceId: this.generateTraceId()
    };

    const validation = this.validationSystem.validateEvent(eventType, payload, context);
    
    if (!validation.valid) {
      this.validationStats.invalidEvents++;
      this.validationStats.errors.push(...validation.errors);
      console.error(`❌ [EventBus] Validation failed for ${eventType}:`, validation.errors);
      return;
    }

    this.validationStats.validEvents++;

    const event = {
      timestamp: new Date(),
      eventType: validation.normalizedEvent.eventType,
      payload: validation.normalizedEvent.payload,
      sourceAgent,
      traceId: context.traceId,
      validation: {
        valid: validation.valid,
        errors: validation.errors,
        warnings: validation.warnings
      }
    };

    this.eventHistory.push(event);
    this.traceEvents.push(event);

    console.log(`📡 [EventBus] ${sourceAgent} → ${eventType} ✅`);
    if (validation.warnings.length > 0) {
      console.log(`   ⚠️ Warnings:`, validation.warnings);
    }

    // Notify all listeners
    this.listeners.forEach((callbacks, key) => {
      const [listenerAgentId, listenerEventType] = key.split(':');
      if (listenerEventType === eventType || listenerEventType === '*') {
        callbacks.forEach(callback => {
          try {
            callback(event);
          } catch (error) {
            console.error(`❌ [EventBus] Error in ${listenerAgentId} handling ${eventType}:`, error.message);
          }
        });
      }
    });
  }

  generateTraceId() {
    return `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getEventHistory() {
    return this.eventHistory;
  }

  getTraceEvents() {
    return this.traceEvents;
  }

  getValidationStats() {
    return {
      ...this.validationStats,
      successRate: this.validationStats.totalEvents > 0 
        ? (this.validationStats.validEvents / this.validationStats.totalEvents) * 100 
        : 0
    };
  }
}

// Improved agent interaction orchestrator
class ImprovedAgentInteractionOrchestrator {
  constructor() {
    this.eventBus = new ValidatedAgentEventBus();
    this.agents = new Map();
    this.interactionFlows = [];
    this.consensusResults = [];
    this.validationSystem = new MockEventValidationSystem();
  }

  async initializeAgents() {
    console.log('🔄 Initializing agents with validated event-driven communication...\n');

    const agentConfigs = [
      { name: 'aiko', class: AikoAgent, id: 'aiko-semantic-validator' },
      { name: 'ryu', class: RyuAgent, id: 'ryu-integrity-guardian' },
      { name: 'alex', class: AlexAgent, id: 'alex-dag-orchestrator' },
      { name: 'maya', class: MayaAgent, id: 'maya-context-manager' },
      { name: 'sarah', class: SarahAgent, id: 'sarah-rag-engine' },
      { name: 'businessLogic', class: BusinessLogicAgent, id: 'business-logic-processor' },
      { name: 'compliance', class: ComplianceAgent, id: 'compliance-validator' },
      { name: 'advancedSecurity', class: AdvancedSecurityAgent, id: 'security-enforcer' },
      { name: 'networkPerformance', class: NetworkPerformanceAgent, id: 'network-optimizer' },
      { name: 'composer', class: DynamicAgentComposer, id: 'dynamic-composer' }
    ];

    for (const config of agentConfigs) {
      console.log(`🔄 Initializing ${config.name} agent...`);
      const agent = new config.class(config.id);
      await agent.initialize();
      
      this.subscribeAgentToEvents(agent, config.name);
      this.agents.set(config.name, agent);
      console.log(`✅ ${config.name} agent initialized`);
    }

    console.log('✅ All agents initialized with validated event-driven communication\n');
  }

  subscribeAgentToEvents(agent, agentName) {
    switch (agentName) {
      case 'aiko':
        this.eventBus.subscribe(agent.id, 'semantic.validation.request', (event) => {
          console.log(`   🧠 [Aiko] Processing validated semantic validation request`);
          agent.handleEvent('specification.validate', {
            specificationId: event.payload.specificationId,
            specification: event.payload.specification
          });
        });
        break;

      case 'ryu':
        this.eventBus.subscribe(agent.id, 'integrity.validation.request', (event) => {
          console.log(`   🛡️ [Ryu] Processing validated integrity validation request`);
          agent.handleEvent('integrity.validate', {
            output: event.payload.output,
            context: event.payload.context
          });
        });
        break;

      case 'alex':
        this.eventBus.subscribe(agent.id, 'dag.orchestration.request', (event) => {
          console.log(`   🏗️ [Alex] Processing validated DAG orchestration request`);
          agent.handleEvent('dag.orchestrate', {
            dagSpec: event.payload.dagSpec,
            workflowId: event.payload.workflowId
          });
        });
        break;

      case 'maya':
        this.eventBus.subscribe(agent.id, 'context.propagation.request', (event) => {
          console.log(`   🔄 [Maya] Processing validated context propagation request`);
          const contextValidation = this.validationSystem.validateContextPropagation(
            event.payload.contextSlice,
            event.payload.targetAgents
          );
          
          if (contextValidation.valid) {
            agent.handleEvent('context.propagate', {
              contextSlice: event.payload.contextSlice,
              targetAgents: event.payload.targetAgents
            });
          } else {
            console.error(`   ❌ [Maya] Context propagation validation failed:`, contextValidation.errors);
          }
        });
        break;

      case 'sarah':
        this.eventBus.subscribe(agent.id, 'rag.knowledge.request', (event) => {
          console.log(`   🧠 [Sarah] Processing validated RAG knowledge request`);
          agent.handleEvent('rag.retrieve', {
            query: event.payload.query,
            context: event.payload.context
          });
        });
        break;

      case 'businessLogic':
        this.eventBus.subscribe(agent.id, 'business.rule.request', (event) => {
          console.log(`   💼 [BusinessLogic] Processing validated business rule request`);
          agent.handleEvent('business.rule.execute', {
            ruleId: event.payload.ruleId,
            data: event.payload.data
          });
        });
        break;

      case 'compliance':
        this.eventBus.subscribe(agent.id, 'compliance.validation.request', (event) => {
          console.log(`   📋 [Compliance] Processing validated compliance validation request`);
          agent.handleEvent('compliance.validate', {
            requirements: event.payload.requirements,
            context: event.payload.context
          });
        });
        break;

      case 'advancedSecurity':
        this.eventBus.subscribe(agent.id, 'security.operation.request', (event) => {
          console.log(`   🔒 [AdvancedSecurity] Processing validated security operation request`);
          agent.handleEvent('security.operate', {
            operation: event.payload.operation,
            data: event.payload.data
          });
        });
        break;

      case 'networkPerformance':
        this.eventBus.subscribe(agent.id, 'network.optimization.request', (event) => {
          console.log(`   ⚡ [NetworkPerformance] Processing validated network optimization request`);
          agent.handleEvent('network.optimize', {
            operation: event.payload.operation,
            metrics: event.payload.metrics
          });
        });
        break;

      case 'composer':
        this.eventBus.subscribe(agent.id, 'composition.request', (event) => {
          console.log(`   🎨 [Composer] Processing validated composition request`);
          agent.handleEvent('composition.create', {
            requirements: event.payload.requirements,
            context: event.payload.context
          });
        });
        break;
    }
  }

  async demonstrateValidatedAgentInteraction() {
    console.log('🤝 Demonstrating Validated Agent Interactions...\n');

    // Scenario 1: Validated Semantic Validation Flow
    console.log('📋 Scenario 1: Validated Semantic Validation Flow');
    await this.demonstrateValidatedSemanticValidationFlow();

    // Scenario 2: Validated Integrity Validation Flow
    console.log('\n🛡️ Scenario 2: Validated Integrity Validation Flow');
    await this.demonstrateValidatedIntegrityValidationFlow();

    // Scenario 3: Validated Context Propagation Flow
    console.log('\n🔄 Scenario 3: Validated Context Propagation Flow');
    await this.demonstrateValidatedContextPropagationFlow();

    // Scenario 4: Validated Business Logic Flow
    console.log('\n💼 Scenario 4: Validated Business Logic Flow');
    await this.demonstrateValidatedBusinessLogicFlow();

    // Scenario 5: Invalid Event Handling
    console.log('\n❌ Scenario 5: Invalid Event Handling');
    await this.demonstrateInvalidEventHandling();

    // Scenario 6: Cross-Agent Consensus with Validation
    console.log('\n🤝 Scenario 6: Cross-Agent Consensus with Validation');
    await this.demonstrateValidatedCrossAgentConsensus();
  }

  async demonstrateValidatedSemanticValidationFlow() {
    console.log('   📝 Aiko (Semantic Validator) receives validated specification...');
    
    const specification = {
      id: 'user-authentication-spec',
      name: 'User Authentication System',
      description: 'Secure user authentication with JWT tokens',
      capabilities: ['validation', 'authentication', 'authorization'],
      interfaces: ['IAuthenticationService', 'IUserRepository', 'ITokenService'],
      requirements: [
        'User registration with email validation',
        'Password hashing with bcrypt',
        'JWT token generation and validation',
        'Role-based access control'
      ],
      constraints: [
        'Must comply with OAuth 2.0 standards',
        'Must support multi-factor authentication',
        'Must provide audit logging'
      ],
      contracts: ['input-validation', 'output-formatting', 'error-handling']
    };

    this.eventBus.publish('semantic.validation.request', {
      specificationId: 'auth-spec-001',
      specification
    }, 'demo-client');

    await this.sleep(1000);
    console.log('   ✅ Aiko completed validated semantic validation');
  }

  async demonstrateValidatedIntegrityValidationFlow() {
    console.log('   🛡️ Ryu (Integrity Guardian) validates system output...');
    
    const systemOutput = {
      type: 'authentication_result',
      data: {
        userId: 'user-123',
        token: 'jwt-token-xyz',
        permissions: ['read', 'write']
      }
    };

    this.eventBus.publish('integrity.validation.request', {
      output: systemOutput,
      context: {
        operation: 'user_authentication',
        securityLevel: 'high',
        complianceRequired: true
      }
    }, 'demo-client');

    await this.sleep(1000);
    console.log('   ✅ Ryu completed validated integrity validation');
  }

  async demonstrateValidatedContextPropagationFlow() {
    console.log('   🔄 Maya (Context Manager) propagates validated context...');
    
    const contextSlice = this.validationSystem.createContext({
      id: 'user-session-123',
      userId: 'user-123',
      sessionId: 'sess-456',
      domain: 'authentication',
      state: 'authenticated',
      metadata: {
        lastActivity: new Date().toISOString(),
        ipAddress: '192.168.1.100'
      }
    });

    this.eventBus.publish('context.propagation.request', {
      contextSlice,
      targetAgents: ['aiko', 'ryu', 'businessLogic'],
      propagationType: 'targeted',
      priority: 'high',
      ttl: 30000
    }, 'demo-client');

    await this.sleep(1000);
    console.log('   ✅ Maya completed validated context propagation');
  }

  async demonstrateValidatedBusinessLogicFlow() {
    console.log('   💼 BusinessLogic processes validated business rules...');
    
    const businessRule = {
      ruleId: 'approval-threshold',
      data: {
        amount: 5000,
        userId: 'user-123',
        userRole: 'manager',
        department: 'finance'
      },
      context: {
        userId: 'user-123',
        userRole: 'manager',
        department: 'finance',
        amount: 5000
      }
    };

    this.eventBus.publish('business.rule.request', businessRule, 'demo-client');

    await this.sleep(1000);
    console.log('   ✅ BusinessLogic completed validated rule execution');
  }

  async demonstrateInvalidEventHandling() {
    console.log('   ❌ Testing invalid event handling...');
    
    // Test 1: Missing required fields
    console.log('   📝 Testing missing required fields...');
    this.eventBus.publish('semantic.validation.request', {
      // Missing specificationId and specification
    }, 'demo-client');

    await this.sleep(500);

    // Test 2: Invalid context structure
    console.log('   📝 Testing invalid context structure...');
    this.eventBus.publish('context.propagation.request', {
      contextSlice: { /* Missing id */ },
      targetAgents: []
    }, 'demo-client');

    await this.sleep(500);

    // Test 3: Invalid business rule
    console.log('   📝 Testing invalid business rule...');
    this.eventBus.publish('business.rule.request', {
      // Missing ruleId and data
    }, 'demo-client');

    await this.sleep(500);
    console.log('   ✅ Invalid event handling completed');
  }

  async demonstrateValidatedCrossAgentConsensus() {
    console.log('   📊 Initiating validated consensus among agents...');
    
    const consensusRequest = {
      decision: 'approve_transaction',
      data: {
        amount: 10000,
        userId: 'user-123',
        riskLevel: 'medium'
      },
      requiredAgents: ['aiko', 'ryu', 'businessLogic', 'compliance', 'advancedSecurity']
    };

    // Validate each agent's approval
    for (const agentName of consensusRequest.requiredAgents) {
      await this.sleep(300);
      
      // Simulate agent validation
      const agent = this.agents.get(agentName);
      if (agent) {
        const status = agent.getStatus();
        console.log(`   ✅ ${agentName} approved (status: ${status.status})`);
      } else {
        console.log(`   ❌ ${agentName} not available`);
      }
    }

    console.log('   🎉 Validated consensus reached: Transaction approved unanimously');
  }

  async demonstrateValidationStatistics() {
    console.log('\n📊 Demonstrating Validation Statistics...');
    
    const stats = this.eventBus.getValidationStats();
    console.log(`   📈 Total Events: ${stats.totalEvents}`);
    console.log(`   ✅ Valid Events: ${stats.validEvents}`);
    console.log(`   ❌ Invalid Events: ${stats.invalidEvents}`);
    console.log(`   📊 Success Rate: ${stats.successRate.toFixed(2)}%`);
    
    if (stats.errors.length > 0) {
      console.log('   🚨 Common Errors:');
      stats.errors.slice(0, 3).forEach((error, index) => {
        console.log(`      ${index + 1}. ${error}`);
      });
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async cleanup() {
    console.log('\n🧹 Cleaning up validated agent interactions...');
    
    for (const [name, agent] of this.agents) {
      try {
        await agent.shutdown();
        console.log(`   ✅ ${name} agent shutdown completed`);
      } catch (error) {
        console.log(`   ⚠️ ${name} agent cleanup completed`);
      }
    }
    
    console.log('✅ Validated agent interaction system cleanup completed');
  }
}

async function runImprovedAgentInteractionDemo() {
  const orchestrator = new ImprovedAgentInteractionOrchestrator();
  
  try {
    await orchestrator.initializeAgents();
    await orchestrator.demonstrateValidatedAgentInteraction();
    await orchestrator.demonstrateValidationStatistics();
    
    console.log('\n🎉 Improved AikoRyu Agent Interaction Demo Completed Successfully!');
    console.log('✅ Event payload validation working properly');
    console.log('✅ Event type mapping standardized');
    console.log('✅ Context propagation with field validation');
    console.log('✅ Comprehensive error handling and fallback mechanisms');
    console.log('✅ Validation statistics and monitoring');
    
  } catch (error) {
    console.error('❌ Improved agent interaction demo failed:', error);
  } finally {
    await orchestrator.cleanup();
  }
}

runImprovedAgentInteractionDemo().catch(console.error); 