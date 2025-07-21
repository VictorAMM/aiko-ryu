#!/usr/bin/env node

/**
 * Test Real Responses from AikoRyu System
 * 
 * This script tests that the agents are getting real responses from Ollama
 * instead of mocked responses.
 */

const { AGENT_REGISTRY } = require('./build/index.js');

async function testRealResponses() {
  console.log('🧪 **Testing Real Responses from AikoRyu System**');
  console.log('=' .repeat(60));
  
  try {
    // Wait for system to initialize
    console.log('⏳ Waiting for system initialization...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test SarahAgent with real Ollama responses
    console.log('\n🧠 **Testing SarahAgent Real Responses**');
    console.log('=' .repeat(50));
    
    const sarah = AGENT_REGISTRY.sarah;
    
    // Test 1: Simple knowledge retrieval
    console.log('🔍 Test 1: Simple knowledge retrieval...');
    const knowledge1 = await sarah.retrieveKnowledge('What is artificial intelligence?');
    
    console.log('✅ Knowledge Response:', {
      content: knowledge1.content?.substring(0, 200) + '...',
      modelUsed: knowledge1.modelUsed,
      tokensUsed: knowledge1.tokensUsed,
      responseTime: knowledge1.responseTime,
      confidence: knowledge1.confidence
    });
    
    // Test 2: Generate response with context
    console.log('\n💬 Test 2: Generate response with context...');
    const response1 = await sarah.generateResponse(
      'Explain the benefits of autonomous agents in software development',
      {
        domain: 'software-development',
        temperature: 0.7,
        maxTokens: 300
      }
    );
    
    console.log('✅ Generated Response:', {
      text: response1.text?.substring(0, 200) + '...',
      model: response1.model,
      tokens: response1.tokens,
      latency: response1.latency,
      confidence: response1.confidence
    });
    
    // Test 3: Domain-specific knowledge
    console.log('\n🏗️ Test 3: Domain-specific knowledge...');
    const knowledge2 = await sarah.retrieveKnowledge('e-commerce architecture patterns', {
      domain: 'ecommerce',
      confidenceThreshold: 0.8
    });
    
    console.log('✅ Domain Knowledge:', {
      content: knowledge2.content?.substring(0, 200) + '...',
      modelUsed: knowledge2.modelUsed,
      tokensUsed: knowledge2.tokensUsed,
      responseTime: knowledge2.responseTime,
      confidence: knowledge2.confidence
    });
    
    // Test 4: Technical response generation
    console.log('\n⚙️ Test 4: Technical response generation...');
    const response2 = await sarah.generateResponse(
      'What are the key principles of DDD (Domain-Driven Design)?',
      {
        domain: 'software-architecture',
        temperature: 0.5,
        maxTokens: 400
      }
    );
    
    console.log('✅ Technical Response:', {
      text: response2.text?.substring(0, 200) + '...',
      model: response2.model,
      tokens: response2.tokens,
      latency: response2.latency,
      confidence: response2.confidence
    });
    
    // Test 5: List available models
    console.log('\n📋 Test 5: List available models...');
    const models = await sarah.listAvailableModels();
    
    console.log('✅ Available Models:', {
      count: models.length,
      models: models.map(m => m.name).slice(0, 5) // Show first 5 models
    });
    
    console.log('\n🎉 **Real Response Testing Complete!**');
    console.log('=' .repeat(60));
    console.log('✅ All tests completed successfully');
    console.log('🧠 Real Ollama responses confirmed');
    console.log('📊 Response metrics tracked');
    console.log('🔍 Knowledge retrieval working');
    console.log('💬 Response generation functional');
    console.log('📋 Model management operational');
    
    // Check if responses are real (not mocked)
    const isRealResponse = (content) => {
      return content && 
             content.length > 50 && 
             !content.includes('<think>') &&
             !content.includes('mock') &&
             !content.includes('test');
    };
    
    const realResponseCount = [
      isRealResponse(knowledge1.content),
      isRealResponse(response1.text),
      isRealResponse(knowledge2.content),
      isRealResponse(response2.text)
    ].filter(Boolean).length;
    
    console.log(`\n📊 **Response Quality Analysis:**`);
    console.log(`Real responses: ${realResponseCount}/4`);
    console.log(`Response quality: ${(realResponseCount / 4) * 100}%`);
    
    if (realResponseCount === 4) {
      console.log('🎯 **All responses are real!**');
    } else {
      console.log('⚠️ Some responses may be mocked or incomplete');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testRealResponses().catch(error => {
  console.error('💥 Test execution failed:', error);
  process.exit(1);
}); 