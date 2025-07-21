#!/usr/bin/env node

/**
 * AikoRyu Performance Monitor
 */

const { AikoRyuEnterprise } = require('./build/index.js');

async function monitorPerformance() {
  console.log('📊 **AikoRyu Performance Monitor**');
  console.log('=' .repeat(50));
  
  try {
    const enterprise = new AikoRyuEnterprise();
    await enterprise.initialize();
    
    console.log('✅ Performance monitor ready');
    
    // Monitor performance every 30 seconds
    setInterval(async () => {
      try {
        const startTime = Date.now();
        const metrics = await enterprise.getMetrics();
        const endTime = Date.now();
        
        console.log('\n📈 Performance Metrics:');
        console.log(`🚀 Throughput: ${metrics.throughput.toFixed(2)} req/s`);
        console.log(`⏱️ Latency: ${metrics.latency.toFixed(0)}ms`);
        console.log(`🎯 Accuracy: ${Math.round(metrics.accuracy * 100)}%`);
        console.log(`💚 Reliability: ${Math.round(metrics.reliability * 100)}%`);
        console.log(`📊 Metrics query time: ${endTime - startTime}ms`);
        
        // Test knowledge retrieval performance
        const knowledgeStart = Date.now();
        const knowledge = await enterprise.getKnowledge('test query', { priority: 'low' });
        const knowledgeTime = Date.now() - knowledgeStart;
        
        console.log(`📚 Knowledge retrieval: ${knowledgeTime}ms`);
        
      } catch (error) {
        console.error('❌ Performance monitoring error:', error);
      }
    }, 30000);
    
  } catch (error) {
    console.error('❌ Performance monitor failed:', error);
    process.exit(1);
  }
}

monitorPerformance();
