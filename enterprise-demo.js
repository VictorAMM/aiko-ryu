#!/usr/bin/env node

/**
 * AikoRyu Enterprise Demo
 * 
 * Simple enterprise interface demonstration
 */

const { AikoRyuEnterprise } = require('./build/index.js');

async function enterpriseDemo() {
  console.log('🏢 **AikoRyu Enterprise System**');
  console.log('=' .repeat(50));
  console.log('🚀 Simple. Powerful. Self-Evolving.');
  console.log('=' .repeat(50));
  
  try {
    // Initialize enterprise system
    console.log('\n⏳ Initializing enterprise system...');
    const enterprise = new AikoRyuEnterprise();
    await enterprise.initialize();
    console.log('✅ Enterprise system ready!');
    
    // Example 1: Simple knowledge retrieval
    console.log('\n📚 **Example 1: Knowledge Retrieval**');
    console.log('=' .repeat(40));
    
    const knowledge = await enterprise.getKnowledge('What is microservices architecture?', {
      domain: 'software-architecture',
      priority: 'high'
    });
    
    console.log('✅ Knowledge Retrieved:');
    console.log(`📝 Content: ${knowledge.content.substring(0, 150)}...`);
    console.log(`🤖 Model: ${knowledge.model}`);
    console.log(`🎯 Confidence: ${Math.round(knowledge.confidence * 100)}%`);
    
    // Example 2: Response generation
    console.log('\n💬 **Example 2: Response Generation**');
    console.log('=' .repeat(40));
    
    const response = await enterprise.generateResponse(
      'Explain the benefits of autonomous agents in enterprise software',
      {
        domain: 'enterprise-software',
        temperature: 0.7,
        maxTokens: 300
      }
    );
    
    console.log('✅ Response Generated:');
    console.log(`📝 Text: ${response.text.substring(0, 150)}...`);
    console.log(`🤖 Model: ${response.model}`);
    console.log(`🔢 Tokens: ${response.tokens}`);
    console.log(`🎯 Confidence: ${Math.round(response.confidence * 100)}%`);
    
    // Example 3: System evolution
    console.log('\n🔄 **Example 3: System Evolution**');
    console.log('=' .repeat(40));
    
    const evolution = await enterprise.evolveSystem('performance');
    
    console.log('✅ Evolution Applied:');
    console.log(`🎯 Target: ${evolution.target}`);
    console.log(`📋 Applied: ${evolution.applied}`);
    console.log(`📊 Current Metrics:`, evolution.currentMetrics);
    
    // Example 4: System optimization
    console.log('\n⚡ **Example 4: System Optimization**');
    console.log('=' .repeat(40));
    
    const optimization = await enterprise.optimizeSystem();
    
    console.log('✅ Optimization Results:');
    console.log(`🔧 Optimizations: ${optimization.optimizations.length}`);
    console.log(`📊 Impact: ${optimization.estimatedImpact}`);
    console.log(`🎯 Priority: ${optimization.priority}`);
    
    // Example 5: Get system metrics
    console.log('\n📊 **Example 5: System Metrics**');
    console.log('=' .repeat(40));
    
    const metrics = await enterprise.getMetrics();
    
    console.log('✅ Current System Metrics:');
    console.log(`🚀 Throughput: ${metrics.throughput.toFixed(2)} req/s`);
    console.log(`⏱️  Latency: ${metrics.latency.toFixed(0)}ms`);
    console.log(`🎯 Accuracy: ${Math.round(metrics.accuracy * 100)}%`);
    console.log(`💚 Reliability: ${Math.round(metrics.reliability * 100)}%`);
    console.log(`📈 Scalability: ${Math.round(metrics.scalability * 100)}%`);
    console.log(`💰 Cost Efficiency: ${metrics.costEfficiency.toFixed(2)}`);
    console.log(`😊 User Satisfaction: ${Math.round(metrics.userSatisfaction * 100)}%`);
    
    // Example 6: Evolution history
    console.log('\n📜 **Example 6: Evolution History**');
    console.log('=' .repeat(40));
    
    const history = await enterprise.getEvolutionHistory();
    
    console.log('✅ Evolution History:');
    console.log(`📊 Total Evolutions: ${history.length}`);
    
    if (history.length > 0) {
      const latest = history[history.length - 1];
      console.log(`🔄 Latest Evolution: ${latest.type}`);
      console.log(`📋 Changes: ${latest.changes.length}`);
      console.log(`🎯 Impact: ${latest.impact}`);
      console.log(`✅ Applied: ${latest.applied}`);
    }
    
    // Summary
    console.log('\n🎉 **Enterprise Demo Complete!**');
    console.log('=' .repeat(50));
    console.log('✅ All operations successful');
    console.log('🚀 System is self-evolving');
    console.log('📊 Performance optimized');
    console.log('🔧 Enterprise ready');
    
    console.log('\n💡 **Enterprise Usage Summary:**');
    console.log('=' .repeat(50));
    console.log('📚 Get knowledge: enterprise.getKnowledge(query)');
    console.log('💬 Generate responses: enterprise.generateResponse(prompt)');
    console.log('🔄 Evolve system: enterprise.evolveSystem(target)');
    console.log('⚡ Optimize performance: enterprise.optimizeSystem()');
    console.log('📊 Monitor metrics: enterprise.getMetrics()');
    console.log('📜 Track evolution: enterprise.getEvolutionHistory()');
    
    console.log('\n🚀 **Ready for enterprise deployment!**');
    
  } catch (error) {
    console.error('❌ Enterprise demo failed:', error);
    process.exit(1);
  }
}

// Run the enterprise demo
enterpriseDemo().catch(error => {
  console.error('💥 Enterprise demo execution failed:', error);
  process.exit(1);
}); 