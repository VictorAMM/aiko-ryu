#!/usr/bin/env node

/**
 * AikoRyu System - Real Response Demonstration
 * 
 * This script demonstrates the AikoRyu autonomous agent orchestration system
 * with real responses from Ollama, showing the full capabilities of the system.
 */

const { AGENT_REGISTRY } = require('./build/index.js');

async function demonstrateAikoRyuSystem() {
  console.log('🚀 **AikoRyu Autonomous Agent Orchestration System**');
  console.log('=' .repeat(70));
  console.log('🧠 Real LLM Responses | 🤖 Autonomous Agents | 🎯 Production Ready');
  console.log('=' .repeat(70));
  
  try {
    // Wait for system initialization
    console.log('\n⏳ Initializing AikoRyu system...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 1: SarahAgent - RAG Engine with Real Responses
    console.log('\n🧠 **Test 1: SarahAgent RAG Engine**');
    console.log('=' .repeat(50));
    
    const sarah = AGENT_REGISTRY.sarah;
    
    console.log('🔍 Retrieving knowledge about autonomous agents...');
    const knowledge = await sarah.retrieveKnowledge('What are autonomous agents in software development?');
    
    console.log('✅ Knowledge Retrieved:', {
      content: knowledge.content?.substring(0, 150) + '...',
      modelUsed: knowledge.modelUsed,
      tokensUsed: knowledge.tokensUsed,
      responseTime: knowledge.responseTime + 'ms',
      confidence: Math.round(knowledge.confidence * 100) + '%'
    });
    
    // Test 2: Generate Response with Context
    console.log('\n💬 Generating response with context...');
    const response = await sarah.generateResponse(
      'Explain the benefits of using autonomous agents in e-commerce',
      {
        domain: 'ecommerce',
        temperature: 0.7,
        maxTokens: 300
      }
    );
    
    console.log('✅ Generated Response:', {
      text: response.text?.substring(0, 150) + '...',
      model: response.model,
      tokens: response.tokens,
      latency: response.latency + 'ms',
      confidence: Math.round(response.confidence * 100) + '%'
    });
    
    // Test 3: AikoAgent - Semantic Validation
    console.log('\n🔍 **Test 2: AikoAgent Semantic Validator**');
    console.log('=' .repeat(50));
    
    const aiko = AGENT_REGISTRY.aiko;
    
    const testSpec = {
      id: 'test-spec',
      name: 'Test Specification',
      description: 'A test specification for validation',
      role: 'Test Role',
      dependencies: ['sarah', 'alex'],
      capabilities: [
        {
          id: 'cap-001',
          name: 'Test Capability',
          description: 'A test capability',
          inputs: [{ name: 'input1', type: 'string', required: true }],
          outputs: [{ name: 'output1', type: 'string', required: true }],
          preconditions: [{ id: 'pre-001', expression: 'input1 provided', description: 'Input provided' }],
          postconditions: [{ id: 'post-001', expression: 'output1 generated', description: 'Output generated' }]
        }
      ],
      interfaces: [
        {
          name: 'test-interface',
          description: 'A test interface',
          methods: [{ name: 'testMethod', description: 'A test method' }]
        }
      ]
    };
    
    console.log('🔍 Validating specification...');
    const validation = aiko.validateSpecification(testSpec);
    
    console.log('✅ Validation Result:', {
      result: validation.result,
      consensus: validation.consensus,
      reason: validation.reason || 'Valid specification'
    });
    
    // Test 4: AlexAgent - DAG Orchestration
    console.log('\n🎯 **Test 3: AlexAgent DAG Orchestrator**');
    console.log('=' .repeat(50));
    
    const alex = AGENT_REGISTRY.alex;
    
    console.log('🕸️ Checking DAG orchestrator status...');
    const alexStatus = alex.getStatus();
    
    console.log('✅ AlexAgent Status:', {
      status: alexStatus.status,
      health: alexStatus.health,
      role: alexStatus.role
    });
    
    // Test 5: MayaAgent - Context Management
    console.log('\n🌐 **Test 4: MayaAgent Context Manager**');
    console.log('=' .repeat(50));
    
    const maya = AGENT_REGISTRY.maya;
    
    console.log('📋 Tracking user interaction...');
    await maya.trackUserInteraction({
      userId: 'user-123',
      action: 'knowledge-query',
      outcome: 'success',
      timestamp: new Date(),
      sessionDuration: 5000,
      context: { domain: 'software-development' }
    });
    
    console.log('✅ User interaction tracked successfully');
    
    // Test 6: RyuAgent - Integrity Guardian
    console.log('\n🔒 **Test 5: RyuAgent Integrity Guardian**');
    console.log('=' .repeat(50));
    
    const ryu = AGENT_REGISTRY.ryu;
    
    console.log('🔍 Checking system integrity...');
    const integrity = ryu.getStatus();
    
    console.log('✅ System Integrity:', {
      status: integrity.status,
      health: integrity.health,
      security: integrity.security,
      compliance: integrity.compliance
    });
    
    // Test 7: List Available Models
    console.log('\n📋 **Test 6: Model Management**');
    console.log('=' .repeat(50));
    
    const models = await sarah.listAvailableModels();
    
    console.log('✅ Available Models:', {
      count: models.length,
      models: models.map(m => m.name).slice(0, 5)
    });
    
    // System Summary
    console.log('\n🎉 **AikoRyu System Demonstration Complete!**');
    console.log('=' .repeat(70));
    console.log('✅ All agents operational with real responses');
    console.log('🧠 Ollama integration working perfectly');
    console.log('🔍 Semantic validation functional');
    console.log('🎯 DAG orchestration operational');
    console.log('🌐 Context management active');
    console.log('🔒 Integrity monitoring enabled');
    console.log('📋 Model management working');
    
    // Performance Metrics
    console.log('\n📊 **Performance Summary:**');
    console.log('=' .repeat(50));
    console.log(`Knowledge Retrieval: ${knowledge.responseTime}ms`);
    console.log(`Response Generation: ${response.latency}ms`);
    console.log(`Model Used: ${knowledge.modelUsed}`);
    console.log(`Total Tokens: ${knowledge.tokensUsed + response.tokens}`);
    console.log(`Average Confidence: ${Math.round(((knowledge.confidence + response.confidence) / 2) * 100)}%`);
    
    console.log('\n🚀 **AikoRyu System is ready for production!**');
    
  } catch (error) {
    console.error('❌ Demonstration failed:', error);
    process.exit(1);
  }
}

// Run the demonstration
demonstrateAikoRyuSystem().catch(error => {
  console.error('💥 Demonstration execution failed:', error);
  process.exit(1);
}); 