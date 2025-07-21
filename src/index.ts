#!/usr/bin/env node

/**
 * AikoRyu System - Production Entry Point
 * 
 * This is the main entry point for the AikoRyu autonomous agent orchestration system.
 * It initializes all agents, sets up the mesh network, and starts the system.
 */

import { AikoAgent } from './agents/AikoAgent';
import { SarahAgent } from './agents/SarahAgent';
import { RyuAgent } from './agents/RyuAgent';
import { AlexAgent } from './agents/AlexAgent';
import { MayaAgent } from './agents/MayaAgent';
import { SystemOperationsAgent } from './agents/SystemOperationsAgent';
import { SpecificationEngine } from './specifications/SpecificationEngine';
import { OrchestrationManager } from './agents/OrchestrationManager';
import { PerformanceOptimizer } from './agents/PerformanceOptimizer';
import { NeuralNetworkComposer } from './agents/NeuralNetworkComposer';
import { GPUAccelerator } from './agents/GPUAccelerator';
import { IntentAgent } from './agents/IntentAgent';
import { DevelopmentTeamAgent } from './agents/DevelopmentTeamAgent';

// System configuration
const SYSTEM_CONFIG = {
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || 'production',
  logLevel: process.env.LOG_LEVEL || 'info',
  enableGPU: process.env.ENABLE_GPU === 'true',
  enableStreaming: process.env.ENABLE_STREAMING === 'true'
};

// Enterprise interface
export { AikoRyuEnterprise } from './enterprise-interface';

// Agent registry
const AGENT_REGISTRY = {
  aiko: new AikoAgent('aiko-main'),
  sarah: new SarahAgent({
    ollamaEndpoint: process.env.OLLAMA_ENDPOINT || 'http://localhost:11434',
    defaultModel: process.env.DEFAULT_MODEL || 'gemma2:2b',
    gpuOptimization: SYSTEM_CONFIG.enableGPU
  }),
  ryu: new RyuAgent(),
  alex: new AlexAgent(),
  maya: new MayaAgent(),
  systemOperations: new SystemOperationsAgent({
    ollamaEndpoint: process.env.OLLAMA_ENDPOINT || 'http://localhost:11434',
    defaultModel: process.env.DEFAULT_MODEL || 'gemma2:2b'
  }),
  specificationEngine: new SpecificationEngine(),
  orchestrationManager: new OrchestrationManager(),
  performanceOptimizer: new PerformanceOptimizer(),
  neuralNetworkComposer: new NeuralNetworkComposer(),
  gpuAccelerator: new GPUAccelerator(),
  intent: new IntentAgent(),
  developmentTeam: new DevelopmentTeamAgent()
};

// Enterprise orchestrator
export { AikoRyuOrchestrator } from './agents/AikoRyuOrchestrator';

/**
 * Initialize the AikoRyu system
 */
async function initializeSystem(): Promise<void> {
  console.log('🚀 Initializing AikoRyu System...');
  console.log(`📊 Environment: ${SYSTEM_CONFIG.environment}`);
  console.log(`🔧 GPU Optimization: ${SYSTEM_CONFIG.enableGPU ? 'Enabled' : 'Disabled'}`);
  console.log(`🌊 Streaming: ${SYSTEM_CONFIG.enableStreaming ? 'Enabled' : 'Disabled'}`);

  try {
    // Initialize all agents
    const initPromises = Object.entries(AGENT_REGISTRY).map(async ([name, agent]) => {
      try {
        await agent.initialize();
        console.log(`✅ ${name} agent initialized`);
        return { name, success: true };
      } catch (error) {
        console.error(`❌ Failed to initialize ${name} agent:`, error);
        return { name, success: false, error };
      }
    });

    const results = await Promise.allSettled(initPromises);
    const successfulAgents = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const totalAgents = Object.keys(AGENT_REGISTRY).length;

    console.log(`📈 Agent initialization complete: ${successfulAgents}/${totalAgents} agents ready`);

    // Start system monitoring
    startSystemMonitoring();

    // Emit system ready event
    AGENT_REGISTRY.aiko.emitTrace({
      timestamp: new Date(),
      eventType: 'system.ready',
      metadata: {
        sourceAgent: 'aiko-main',
        correlationId: `system-ready-${Date.now()}`
      }
    });

    console.log('🎉 AikoRyu System is ready for production!');
    console.log(`🌐 System will be available on port ${SYSTEM_CONFIG.port}`);

  } catch (error) {
    console.error('❌ System initialization failed:', error);
    process.exit(1);
  }
}

/**
 * Start system monitoring and health checks
 */
function startSystemMonitoring(): void {
  setInterval(() => {
    const healthChecks = Object.entries(AGENT_REGISTRY).map(([name, agent]) => {
      // Check if agent has getStatus method
      if ('getStatus' in agent) {
        const status = (agent as unknown as { getStatus(): { status: string; uptime: number } }).getStatus();
        return { name, status: status.status, uptime: status.uptime };
      } else {
        return { name, status: 'unknown', uptime: 0 };
      }
    });

    const healthyAgents = healthChecks.filter(h => h.status === 'ready').length;
    const totalAgents = healthChecks.length;

    console.log(`💓 System Health: ${healthyAgents}/${totalAgents} agents healthy`);

    // Emit health check event
    AGENT_REGISTRY.aiko.emitTrace({
      timestamp: new Date(),
      eventType: 'system.health.check',
      metadata: {
        sourceAgent: 'aiko-main',
        correlationId: `health-check-${Date.now()}`
      }
    });
  }, 30000); // Check every 30 seconds
}

/**
 * Graceful shutdown handler
 */
function setupGracefulShutdown(): void {
  const shutdown = async (signal: string) => {
    console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

    // Shutdown all agents
    const shutdownPromises = Object.entries(AGENT_REGISTRY).map(async ([name, agent]) => {
      try {
        await agent.shutdown();
        console.log(`✅ ${name} agent shutdown complete`);
        return { name, success: true };
      } catch (error) {
        console.error(`❌ Failed to shutdown ${name} agent:`, error);
        return { name, success: false, error };
      }
    });

    await Promise.allSettled(shutdownPromises);
    console.log('👋 AikoRyu System shutdown complete');
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
    shutdown('uncaughtException');
  });
  process.on('unhandledRejection', (reason) => {
    console.error('💥 Unhandled Rejection:', reason);
    shutdown('unhandledRejection');
  });
}

/**
 * Main application entry point
 */
async function main(): Promise<void> {
  console.log('🎯 AikoRyu Autonomous Agent Orchestration System');
  console.log('🔬 Version: 1.0.0');
  console.log('🏗️  Architecture: DDD/SDD Aligned');
  console.log('🚀 GPU Optimization: Enabled');
  console.log('🧠 LLM Consistency: Deterministic Replay');
  console.log('');

  // Setup graceful shutdown
  setupGracefulShutdown();

  // Initialize the system
  await initializeSystem();

  // Keep the process alive
  process.stdin.resume();
}

// Start the application
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
if (typeof require !== 'undefined' && require.main === module) {
  main().catch((error) => {
    console.error('💥 Application startup failed:', error);
    process.exit(1);
  });
}

export { AGENT_REGISTRY, SYSTEM_CONFIG }; 