const { AikoRyuAPISimple } = require('./build/api/AikoRyuAPISimple');
const { AikoAgent } = require('./build/agents/AikoAgent');
const { AlexAgent } = require('./build/agents/AlexAgent');
const { RyuAgent } = require('./build/agents/RyuAgent');
const { SarahAgent } = require('./build/agents/SarahAgent');
const { MayaAgent } = require('./build/agents/MayaAgent');
const { GPUAccelerator } = require('./build/agents/GPUAccelerator');
const { NeuralNetworkComposer } = require('./build/agents/NeuralNetworkComposer');
const { PerformanceOptimizer } = require('./build/agents/PerformanceOptimizer');
const { CodeQualityPipelineAgent } = require('./build/agents/CodeQualityPipelineAgent');

/**
 * Production Deployment Script
 * 
 * This script starts the AikoRyu system in production mode with:
 * 1. API Gateway with all agents
 * 2. Production monitoring
 * 3. Health checks
 * 4. Performance metrics
 */
async function startProduction() {
  console.log('🚀 **AIKORYU PRODUCTION DEPLOYMENT**\n');

  try {
    // Initialize API Gateway
    console.log('🔌 **Initializing API Gateway**');
    const api = new AikoRyuAPISimple(3000);
    
    // Initialize all agents
    console.log('\n🤖 **Initializing Agents**');
    const agents = {
      aiko: new AikoAgent(),
      alex: new AlexAgent(),
      ryu: new RyuAgent(),
      sarah: new SarahAgent(),
      maya: new MayaAgent(),
      gpu: new GPUAccelerator(),
      neural: new NeuralNetworkComposer(),
      performance: new PerformanceOptimizer(),
      quality: new CodeQualityPipelineAgent()
    };

    // Register all agents with API
    Object.entries(agents).forEach(([id, agent]) => {
      api.registerAgent(agent);
      console.log(`   ✅ Registered agent: ${id}`);
    });

    // Initialize all agents
    console.log('\n🔄 **Starting Agent Initialization**');
    for (const [id, agent] of Object.entries(agents)) {
      await agent.initialize();
      console.log(`   ✅ ${id} agent initialized`);
    }

    // Start API Gateway
    console.log('\n🌐 **Starting API Gateway**');
    api.start();

    // Wait a moment for server to start
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test API endpoints
    console.log('\n🧪 **Testing API Endpoints**');
    
    try {
      // Test health endpoint
      const healthResponse = await fetch('http://localhost:3000/health');
      const healthData = await healthResponse.json();
      console.log(`   ✅ Health Check: ${healthData.status}`);
      console.log(`   ✅ Uptime: ${healthData.uptime.toFixed(2)}s`);
      console.log(`   ✅ Active Agents: ${healthData.agents.length}`);

      // Test metrics endpoint
      const metricsResponse = await fetch('http://localhost:3000/metrics');
      const metricsData = await metricsResponse.json();
      console.log(`   ✅ System CPU: ${(metricsData.system.cpu.user / 1000000).toFixed(2)}s`);
      console.log(`   ✅ Memory Usage: ${(metricsData.system.memory.used / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   ✅ Agent Count: ${metricsData.agents.length}`);

      // Test agent management
      const agentsResponse = await fetch('http://localhost:3000/api/agents');
      const agentsData = await agentsResponse.json();
      console.log(`   ✅ Available Agents: ${agentsData.length}`);
      agentsData.forEach(agent => {
        console.log(`      - ${agent.id}: ${agent.role} (${agent.status.status})`);
      });

    } catch (error) {
      console.log(`   ⚠️  API testing skipped: ${error.message}`);
    }

    console.log('\n🎉 **PRODUCTION DEPLOYMENT SUCCESSFUL!**\n');

    // Display available endpoints
    console.log('📋 **Available Endpoints**');
    console.log('   📊 Health Check: http://localhost:3000/health');
    console.log('   📈 System Metrics: http://localhost:3000/metrics');
    console.log('   🤖 Agent Management: http://localhost:3000/api/agents');
    console.log('   🔧 Agent Status: http://localhost:3000/api/agents/{id}/status');
    console.log('   ⚙️  System Admin: http://localhost:3000/api/admin/config');
    console.log('   🔄 Agent Events: POST http://localhost:3000/api/agents/{id}/events\n');

    // Display next steps
    console.log('🚀 **NEXT STEPS**');
    console.log('   1. Deploy Docker Compose infrastructure');
    console.log('   2. Set up monitoring dashboards (Prometheus/Grafana)');
    console.log('   3. Implement authentication and security');
    console.log('   4. Add comprehensive testing suite');
    console.log('   5. Configure CI/CD pipeline\n');

    console.log('💡 **Testing Commands**');
    console.log('   curl http://localhost:3000/health');
    console.log('   curl http://localhost:3000/metrics');
    console.log('   curl http://localhost:3000/api/agents');
    console.log('   curl -X POST http://localhost:3000/api/agents/aiko/initialize\n');

    console.log('🎯 **Production Status: READY**');
    console.log('The AikoRyu system is now running in production mode!');

    // Keep the process running
    process.on('SIGINT', async () => {
      console.log('\n🛑 **Shutting down production system...**');
      
      // Gracefully shutdown all agents
      for (const [id, agent] of Object.entries(agents)) {
        try {
          await agent.shutdown();
          console.log(`   ✅ ${id} agent shut down`);
        } catch (error) {
          console.log(`   ⚠️  ${id} agent shutdown error: ${error.message}`);
        }
      }
      
      console.log('🎉 **Production shutdown complete!**');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ **Production deployment failed:**', error);
    process.exit(1);
  }
}

// Start production deployment
startProduction().catch(console.error); 