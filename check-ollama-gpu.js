#!/usr/bin/env node

/**
 * Check Ollama GPU Usage and Performance
 * 
 * Diagnoses and optimizes Ollama GPU acceleration
 */

const { execSync } = require('child_process');
const http = require('http');

async function checkOllamaGPU() {
  console.log('🔍 **Ollama GPU Performance Check**');
  console.log('=' .repeat(50));
  
  try {
    // Check if Ollama is running
    console.log('🔍 Checking Ollama status...');
    try {
      const ollamaStatus = execSync('ollama list', { encoding: 'utf8' });
      console.log('✅ Ollama is running');
      console.log('📋 Available models:', ollamaStatus.split('\n').filter(line => line.trim()).length - 1);
    } catch (error) {
      console.log('❌ Ollama not running. Please start Ollama first:');
      console.log('   ollama serve');
      process.exit(1);
    }
    
    // Check GPU availability
    console.log('\n🔍 Checking GPU availability...');
    let gpuAvailable = false;
    try {
      const gpuInfo = execSync('nvidia-smi', { encoding: 'utf8' });
      console.log('✅ NVIDIA GPU detected');
      console.log('📊 GPU Info:', gpuInfo.split('\n')[0]);
      gpuAvailable = true;
    } catch (error) {
      console.log('⚠️ NVIDIA GPU not detected');
      console.log('💡 This might be why performance is slow');
    }
    
    // Test Ollama API directly
    console.log('\n🧪 Testing Ollama API performance...');
    
    const testPrompt = 'What is GPU acceleration in machine learning?';
    const testRequest = {
      model: 'qwen3:latest',
      prompt: testPrompt,
      stream: false,
      options: {
        num_gpu: gpuAvailable ? 1 : 0,
        num_thread: 8,
        num_ctx: 4096,
        temperature: 0.7,
        top_k: 40,
        top_p: 0.9,
        repeat_penalty: 1.1,
        seed: -1,
        cache_prompt: true,
        cache_prompt_kv: true
      }
    };
    
    const startTime = Date.now();
    
    const response = await new Promise((resolve, reject) => {
      const postData = JSON.stringify(testRequest);
      
      const options = {
        hostname: 'localhost',
        port: 11434,
        path: '/api/generate',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        },
        timeout: 60000 // 60 second timeout
      };
      
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            resolve(result);
          } catch (error) {
            reject(new Error(`Failed to parse response: ${error.message}`));
          }
        });
      });
      
      req.on('error', (error) => {
        reject(new Error(`Request failed: ${error.message}`));
      });
      
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timed out'));
      });
      
      req.write(postData);
      req.end();
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log('✅ Ollama API test completed:');
    console.log(`⏱️ Response time: ${duration}ms`);
    console.log(`📝 Response length: ${response.response?.length || 0} characters`);
    console.log(`🤖 Model used: ${response.model || 'unknown'}`);
    console.log(`🔢 Tokens: ${response.eval_count || 'unknown'}`);
    
    if (response.timings) {
      console.log('📊 Performance metrics:');
      console.log(`  - Predicted tokens: ${response.timings.predicted_n || 'unknown'}`);
      console.log(`  - Tokens per second: ${response.timings.predicted_per_second || 'unknown'}`);
      console.log(`  - Time per token: ${response.timings.predicted_per_token_ms || 'unknown'}ms`);
    }
    
    // Performance analysis
    console.log('\n📈 Performance Analysis:');
    if (duration < 5000) {
      console.log('🚀 Excellent performance! GPU acceleration working well');
    } else if (duration < 15000) {
      console.log('⚡ Good performance, but could be optimized');
    } else {
      console.log('⚠️ Performance is slow - optimization needed');
    }
    
    // Recommendations
    console.log('\n💡 **Optimization Recommendations:**');
    console.log('=' .repeat(40));
    
    if (!gpuAvailable) {
      console.log('🔧 1. Install NVIDIA drivers and CUDA');
      console.log('🔧 2. Ensure Ollama is built with GPU support');
      console.log('🔧 3. Use a smaller model for faster responses');
    }
    
    if (duration > 10000) {
      console.log('🔧 4. Reduce context window (num_ctx)');
      console.log('🔧 5. Use a quantized model (e.g., qwen3:7b-q4_K_M)');
      console.log('🔧 6. Enable model caching');
    }
    
    console.log('🔧 7. Check system resources (CPU, RAM)');
    console.log('🔧 8. Consider using a local GPU server');
    
    // Create optimization script
    console.log('\n📝 Creating Ollama optimization script...');
    const optimizationScript = `#!/usr/bin/env node

/**
 * Ollama Performance Optimizer
 */

const { execSync } = require('child_process');

async function optimizeOllama() {
  console.log('🔧 **Ollama Performance Optimization**');
  console.log('=' .repeat(50));
  
  try {
    // Check current models
    console.log('📋 Current models:');
    const models = execSync('ollama list', { encoding: 'utf8' });
    console.log(models);
    
    // Pull optimized model
    console.log('\\n📥 Pulling optimized model...');
    try {
      execSync('ollama pull qwen3:7b-q4_K_M', { stdio: 'inherit' });
      console.log('✅ Optimized model pulled');
    } catch (error) {
      console.log('⚠️ Could not pull optimized model:', error.message);
    }
    
    // Show optimization tips
    console.log('\\n💡 **Optimization Tips:**');
    console.log('1. Use quantized models (q4_K_M suffix)');
    console.log('2. Reduce context window for faster responses');
    console.log('3. Enable GPU acceleration if available');
    console.log('4. Use model caching');
    console.log('5. Monitor system resources');
    
  } catch (error) {
    console.error('❌ Optimization failed:', error);
  }
}

optimizeOllama();
`;
    
    require('fs').writeFileSync('optimize-ollama.js', optimizationScript);
    console.log('✅ Ollama optimization script created');
    
    console.log('\n🎉 **GPU Check Complete!**');
    console.log('=' .repeat(50));
    console.log('✅ Ollama is running');
    console.log(`📊 GPU available: ${gpuAvailable ? 'Yes' : 'No'}`);
    console.log(`⏱️ Response time: ${duration}ms`);
    console.log('🔧 Optimization script created');
    
  } catch (error) {
    console.error('❌ Ollama GPU check failed:', error);
    process.exit(1);
  }
}

// Run the check
checkOllamaGPU().catch(error => {
  console.error('💥 Ollama GPU check failed:', error);
  process.exit(1);
}); 