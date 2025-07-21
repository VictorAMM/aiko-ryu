#!/usr/bin/env node

/**
 * AikoRyu System - Interactive Demo
 * 
 * This script provides an interactive way to test the AikoRyu system
 * with real responses from Ollama.
 */

const { AGENT_REGISTRY } = require('./build/index.js');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function interactiveDemo() {
  console.log('🚀 **AikoRyu Interactive Demo**');
  console.log('=' .repeat(50));
  console.log('🧠 Test the system with your own queries!');
  console.log('=' .repeat(50));
  
  const sarah = AGENT_REGISTRY.sarah;
  
  while (true) {
    console.log('\n📝 **Available Commands:**');
    console.log('1. knowledge <query> - Retrieve knowledge about a topic');
    console.log('2. generate <prompt> - Generate a response with context');
    console.log('3. models - List available models');
    console.log('4. status - Check system status');
    console.log('5. quit - Exit the demo');
    console.log('');
    
    const input = await askQuestion('Enter your command: ');
    const parts = input.trim().split(' ');
    const command = parts[0].toLowerCase();
    
    try {
      switch (command) {
        case 'knowledge':
          if (parts.length < 2) {
            console.log('❌ Please provide a query: knowledge <query>');
            break;
          }
          await handleKnowledgeQuery(parts.slice(1).join(' '));
          break;
          
        case 'generate':
          if (parts.length < 2) {
            console.log('❌ Please provide a prompt: generate <prompt>');
            break;
          }
          await handleGenerateResponse(parts.slice(1).join(' '));
          break;
          
        case 'models':
          await handleListModels();
          break;
          
        case 'status':
          await handleSystemStatus();
          break;
          
        case 'quit':
        case 'exit':
          console.log('👋 Thanks for testing AikoRyu!');
          rl.close();
          return;
          
        default:
          console.log('❌ Unknown command. Type "quit" to exit.');
          break;
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  }
}

async function handleKnowledgeQuery(query) {
  console.log(`\n🔍 Retrieving knowledge about: "${query}"`);
  console.log('⏳ Please wait...');
  
  const sarah = AGENT_REGISTRY.sarah;
  const startTime = Date.now();
  
  const knowledge = await sarah.retrieveKnowledge(query);
  const duration = Date.now() - startTime;
  
  console.log('\n✅ **Knowledge Retrieved:**');
  console.log('=' .repeat(40));
  console.log(`📝 Content: ${knowledge.content}`);
  console.log(`🤖 Model: ${knowledge.modelUsed}`);
  console.log(`🔢 Tokens: ${knowledge.tokensUsed}`);
  console.log(`⏱️  Response Time: ${knowledge.responseTime}ms`);
  console.log(`⏱️  Total Duration: ${duration}ms`);
  console.log(`🎯 Confidence: ${Math.round(knowledge.confidence * 100)}%`);
  console.log('=' .repeat(40));
}

async function handleGenerateResponse(prompt) {
  console.log(`\n💬 Generating response for: "${prompt}"`);
  console.log('⏳ Please wait...');
  
  const sarah = AGENT_REGISTRY.sarah;
  const startTime = Date.now();
  
  const response = await sarah.generateResponse(prompt, {
    temperature: 0.7,
    maxTokens: 500
  });
  
  const duration = Date.now() - startTime;
  
  console.log('\n✅ **Generated Response:**');
  console.log('=' .repeat(40));
  console.log(`📝 Text: ${response.text}`);
  console.log(`🤖 Model: ${response.model}`);
  console.log(`🔢 Tokens: ${response.tokens}`);
  console.log(`⏱️  Latency: ${response.latency}ms`);
  console.log(`⏱️  Total Duration: ${duration}ms`);
  console.log(`🎯 Confidence: ${Math.round(response.confidence * 100)}%`);
  console.log('=' .repeat(40));
}

async function handleListModels() {
  console.log('\n📋 **Available Models:**');
  console.log('=' .repeat(40));
  
  const sarah = AGENT_REGISTRY.sarah;
  const models = await sarah.listAvailableModels();
  
  models.forEach((model, index) => {
    console.log(`${index + 1}. ${model.name} (${model.details?.parameterSize || 'Unknown size'})`);
  });
  
  console.log(`\n📊 Total Models: ${models.length}`);
  console.log('=' .repeat(40));
}

async function handleSystemStatus() {
  console.log('\n🔍 **System Status:**');
  console.log('=' .repeat(40));
  
  const ryu = AGENT_REGISTRY.ryu;
  const maya = AGENT_REGISTRY.maya;
  
  const integrity = ryu.getStatus();
  
  console.log(`🏥 Status: ${integrity.status || 'Unknown'}`);
  console.log(`💚 Health: ${integrity.health || 'Unknown'}`);
  console.log(`🔒 Security: ${integrity.security || 'Unknown'}`);
  console.log(`📋 Compliance: ${integrity.compliance || 'Unknown'}`);
  
  // Track this interaction
  await maya.trackUserInteraction({
    userId: 'interactive-demo',
    action: 'status-check',
    outcome: 'success',
    timestamp: new Date(),
    sessionDuration: 1000,
    context: { demo: true }
  });
  
  console.log('✅ User interaction tracked');
  console.log('=' .repeat(40));
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

// Start the interactive demo
console.log('🚀 Starting AikoRyu Interactive Demo...');
console.log('⏳ Initializing system...');

// Wait for system to be ready
setTimeout(() => {
  interactiveDemo().catch(error => {
    console.error('💥 Demo failed:', error);
    rl.close();
  });
}, 2000); 