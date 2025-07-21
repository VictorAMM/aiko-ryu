#!/usr/bin/env node

/**
 * AikoRyu GPU-Optimized Startup Script
 */

// Load GPU-optimized environment
require('dotenv').config({ path: '.env.gpu' });

const { AikoRyuEnterprise } = require('./build/index.js');

async function startGPUOptimized() {
  console.log('🚀 Starting AikoRyu with GPU optimization...');
  
  try {
    const enterprise = new AikoRyuEnterprise();
    await enterprise.initialize();
    
    console.log('✅ GPU-optimized AikoRyu ready!');
    console.log('🎯 Performance optimized for enterprise use');
    
    // Keep the process running
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down gracefully...');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ GPU-optimized startup failed:', error);
    process.exit(1);
  }
}

startGPUOptimized();
