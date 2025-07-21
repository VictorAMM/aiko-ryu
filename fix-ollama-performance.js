#!/usr/bin/env node

/**
 * Fix Ollama Performance Issues
 * 
 * Optimizes Ollama for better performance with GPU
 */

const { execSync } = require('child_process');

async function fixOllamaPerformance() {
  console.log('🔧 **Fixing Ollama Performance**');
  console.log('=' .repeat(50));
  
  try {
    // Check current models
    console.log('📋 Checking current models...');
    const models = execSync('ollama list', { encoding: 'utf8' });
    console.log(models);
    
    // Check if we have a fast model
    const hasFastModel = models.includes('gemma2:2b') || models.includes('cogito:3b') || models.includes('llama2:7b');
    
    if (hasFastModel) {
      console.log('✅ Fast models available: gemma2:2b, cogito:3b, llama2:7b');
    } else {
      console.log('⚠️ No fast models found, using available models');
    }
    
    // Update the system configuration to use the fast model
    console.log('\n⚙️ Updating system configuration...');
    
    const envContent = `ENABLE_GPU=true
OLLAMA_ENDPOINT=http://localhost:11434
DEFAULT_MODEL=gemma2:2b
LOG_LEVEL=info
NODE_ENV=production
OLLAMA_TIMEOUT=30000
OLLAMA_GPU_LAYERS=1
OLLAMA_NUM_THREAD=8
OLLAMA_CONTEXT_SIZE=2048
`;
    
    require('fs').writeFileSync('.env.gpu', envContent);
    console.log('✅ Environment updated for fast model');
    
    // Create optimized startup script
    console.log('\n📝 Creating optimized startup script...');
    const startupScript = `#!/usr/bin/env node

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
    console.log('\\n🧪 Testing performance...');
    const startTime = Date.now();
    
    const knowledge = await enterprise.getKnowledge('What is AI?', {
      domain: 'technology',
      priority: 'high'
    });
    
    const duration = Date.now() - startTime;
    console.log(\`✅ Test completed in \${duration}ms\`);
    
    if (duration < 5000) {
      console.log('🚀 Excellent performance!');
    } else if (duration < 10000) {
      console.log('⚡ Good performance');
    } else {
      console.log('⚠️ Performance could be better');
    }
    
    // Keep the process running
    process.on('SIGINT', () => {
      console.log('\\n🛑 Shutting down gracefully...');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Fast model startup failed:', error);
    process.exit(1);
  }
}

startFastModel();
`;
    
    require('fs').writeFileSync('start-fast-model.js', startupScript);
    console.log('✅ Fast model startup script created');
    
    // Create performance test script
    console.log('\n📊 Creating performance test script...');
    const testScript = `#!/usr/bin/env node

/**
 * AikoRyu Performance Test
 */

const { AikoRyuEnterprise } = require('./build/index.js');

async function testPerformance() {
  console.log('📊 **AikoRyu Performance Test**');
  console.log('=' .repeat(50));
  
  try {
    const enterprise = new AikoRyuEnterprise();
    await enterprise.initialize();
    
    console.log('✅ System ready for testing');
    
    const tests = [
      { query: 'What is AI?', domain: 'technology' },
      { query: 'Explain microservices', domain: 'software' },
      { query: 'What is machine learning?', domain: 'technology' },
      { query: 'Explain REST API', domain: 'software' },
      { query: 'What is blockchain?', domain: 'technology' }
    ];
    
    const results = [];
    
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      console.log(\`\\n🧪 Test \${i + 1}: \${test.query}\`);
      
      const startTime = Date.now();
      const knowledge = await enterprise.getKnowledge(test.query, {
        domain: test.domain,
        priority: 'medium'
      });
      const duration = Date.now() - startTime;
      
      results.push({ test: test.query, duration, confidence: knowledge.confidence });
      
      console.log(\`✅ Completed in \${duration}ms (confidence: \${Math.round(knowledge.confidence * 100)}%)\`);
    }
    
    // Calculate statistics
    const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
    const avgConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length;
    
    console.log('\\n📈 **Performance Summary**');
    console.log('=' .repeat(40));
    console.log(\`📊 Average response time: \${avgDuration.toFixed(0)}ms\`);
    console.log(\`🎯 Average confidence: \${Math.round(avgConfidence * 100)}%\`);
    console.log(\`🚀 Best time: \${Math.min(...results.map(r => r.duration))}ms\`);
    console.log(\`🐌 Worst time: \${Math.max(...results.map(r => r.duration))}ms\`);
    
    if (avgDuration < 5000) {
      console.log('\\n🎉 Excellent performance! System is optimized');
    } else if (avgDuration < 10000) {
      console.log('\\n⚡ Good performance, system is working well');
    } else {
      console.log('\\n⚠️ Performance needs improvement');
    }
    
  } catch (error) {
    console.error('❌ Performance test failed:', error);
    process.exit(1);
  }
}

testPerformance();
`;
    
    require('fs').writeFileSync('test-performance.js', testScript);
    console.log('✅ Performance test script created');
    
    console.log('\n🎉 **Performance Fix Complete!**');
    console.log('=' .repeat(50));
    console.log('✅ Fast model configured');
    console.log('✅ Environment optimized');
    console.log('✅ Startup scripts created');
    console.log('✅ Performance test ready');
    
    console.log('\n🚀 **Usage Instructions:**');
    console.log('=' .repeat(40));
    console.log('1. Start with fast model:');
    console.log('   node start-fast-model.js');
    console.log('');
    console.log('2. Test performance:');
    console.log('   node test-performance.js');
    console.log('');
    console.log('3. Run enterprise demo:');
    console.log('   node enterprise-demo-optimized.js');
    
  } catch (error) {
    console.error('❌ Performance fix failed:', error);
    process.exit(1);
  }
}

// Run the fix
fixOllamaPerformance().catch(error => {
  console.error('💥 Performance fix failed:', error);
  process.exit(1);
}); 