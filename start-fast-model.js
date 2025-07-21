#!/usr/bin/env node

/**
 * AikoRyu Fast Model Startup
 */

// Load optimized environment
require('dotenv').config({ path: '.env.gpu' });

const { AikoRyuEnterprise } = require('./build/index.js');

async function startFastModel() {
  console.log('🚀 Starting AikoRyu with fast model...');
  
  try {
    const enterprise = new AikoRyuEnterprise();
    await enterprise.initialize();
    
    console.log('✅ Fast model AikoRyu ready!');
    console.log('🎯 Using gemma2:2b for optimal performance');
    
    // Test performance
    console.log('\n🧪 Testing performance...');
    const startTime = Date.now();
    
    const knowledge = await enterprise.getKnowledge('What is AI?', {
      domain: 'technology',
      priority: 'high'
    });
    
    const duration = Date.now() - startTime;
    console.log(`✅ Test completed in ${duration}ms`);
    
    if (duration < 5000) {
      console.log('🚀 Excellent performance!');
    } else if (duration < 10000) {
      console.log('⚡ Good performance');
    } else {
      console.log('⚠️ Performance could be better');
    }
    
    // Keep the process running
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down gracefully...');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Fast model startup failed:', error);
    process.exit(1);
  }
}

startFastModel();
