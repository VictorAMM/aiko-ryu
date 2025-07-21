#!/usr/bin/env node

/**
 * Simple Performance Test
 * 
 * Tests AikoRyu performance without auto-evolution interference
 */

const { AikoRyuEnterprise } = require('./build/index.js');

async function simplePerformanceTest() {
  console.log('📊 **Simple Performance Test**');
  console.log('=' .repeat(50));
  
  try {
    // Initialize enterprise system
    console.log('⏳ Initializing system...');
    const enterprise = new AikoRyuEnterprise();
    await enterprise.initialize();
    
    // Disable auto-evolution for clean test
    enterprise.setAutoEvolution(false);
    console.log('✅ Auto-evolution disabled for clean test');
    
    console.log('✅ System ready for testing');
    
    const tests = [
      { query: 'What is AI?', domain: 'technology' },
      { query: 'Explain microservices', domain: 'software' },
      { query: 'What is machine learning?', domain: 'technology' }
    ];
    
    const results = [];
    
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      console.log(`\n🧪 Test ${i + 1}: ${test.query}`);
      
      const startTime = Date.now();
      const knowledge = await enterprise.getKnowledge(test.query, {
        domain: test.domain,
        priority: 'medium'
      });
      const duration = Date.now() - startTime;
      
      results.push({ test: test.query, duration, confidence: knowledge.confidence });
      
      console.log(`✅ Completed in ${duration}ms (confidence: ${Math.round(knowledge.confidence * 100)}%)`);
      console.log(`📝 Response: ${knowledge.content.substring(0, 100)}...`);
    }
    
    // Calculate statistics
    const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
    const avgConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length;
    
    console.log('\n📈 **Performance Summary**');
    console.log('=' .repeat(40));
    console.log(`📊 Average response time: ${avgDuration.toFixed(0)}ms`);
    console.log(`🎯 Average confidence: ${Math.round(avgConfidence * 100)}%`);
    console.log(`🚀 Best time: ${Math.min(...results.map(r => r.duration))}ms`);
    console.log(`🐌 Worst time: ${Math.max(...results.map(r => r.duration))}ms`);
    
    if (avgDuration < 5000) {
      console.log('\n🎉 Excellent performance! System is optimized');
    } else if (avgDuration < 10000) {
      console.log('\n⚡ Good performance, system is working well');
    } else {
      console.log('\n⚠️ Performance needs improvement');
    }
    
    // Test model info
    console.log('\n🤖 **Model Information**');
    console.log('=' .repeat(40));
    const models = await enterprise.getMetrics();
    console.log(`📊 Current model: gemma2:2b`);
    console.log(`🚀 Throughput: ${models.throughput.toFixed(2)} req/s`);
    console.log(`⏱️ Latency: ${models.latency.toFixed(0)}ms`);
    
  } catch (error) {
    console.error('❌ Performance test failed:', error);
    process.exit(1);
  }
}

// Run the test
simplePerformanceTest().catch(error => {
  console.error('💥 Performance test failed:', error);
  process.exit(1);
}); 