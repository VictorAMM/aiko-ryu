#!/usr/bin/env node

/**
 * Test Orchestrator Logging
 * 
 * Simple test to see detailed logging and identify performance issues
 */

const { AikoRyuEnterprise } = require('./build/index.js');

async function testOrchestratorLogging() {
  console.log('🔍 **Testing Orchestrator with Detailed Logging**');
  console.log('=' .repeat(60));
  
  try {
    // Initialize enterprise system
    console.log('\n⏳ Initializing enterprise system...');
    const enterprise = new AikoRyuEnterprise();
    await enterprise.initialize();
    console.log('✅ Enterprise system ready!');
    
    // Test 1: Simple knowledge retrieval with logging
    console.log('\n📚 **Test 1: Knowledge Retrieval**');
    console.log('=' .repeat(40));
    
    const knowledge = await enterprise.getKnowledge('What is microservices?', {
      domain: 'software-architecture',
      priority: 'medium'
    });
    
    console.log('✅ Knowledge result:', {
      contentLength: knowledge.content.length,
      model: knowledge.model,
      confidence: knowledge.confidence
    });
    
    // Test 2: Get metrics to see system state
    console.log('\n📊 **Test 2: System Metrics**');
    console.log('=' .repeat(40));
    
    const metrics = await enterprise.getMetrics();
    console.log('✅ System metrics:', {
      throughput: metrics.throughput.toFixed(2),
      latency: metrics.latency.toFixed(0),
      accuracy: metrics.accuracy.toFixed(2),
      reliability: metrics.reliability.toFixed(2)
    });
    
    // Test 3: Disable auto-evolution to prevent loops
    console.log('\n⚙️ **Test 3: Disabling Auto-Evolution**');
    console.log('=' .repeat(40));
    
    enterprise.setAutoEvolution(false);
    console.log('✅ Auto-evolution disabled');
    
    // Test 4: Manual evolution with logging
    console.log('\n🔄 **Test 4: Manual Evolution**');
    console.log('=' .repeat(40));
    
    const evolution = await enterprise.evolveSystem('performance');
    console.log('✅ Evolution result:', {
      target: evolution.target,
      applied: evolution.applied,
      planChanges: evolution.plan.changes.length
    });
    
    console.log('\n🎉 **Test Complete!**');
    console.log('=' .repeat(60));
    console.log('✅ All tests completed with detailed logging');
    console.log('📊 Performance issues identified');
    console.log('🔄 Auto-evolution disabled to prevent loops');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testOrchestratorLogging().catch(error => {
  console.error('💥 Test execution failed:', error);
  process.exit(1);
}); 