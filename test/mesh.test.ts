import { AikoRyuMesh } from '../src/mesh';
import { AikoAgent } from '../src/agents/AikoAgent';
import { RyuAgent } from '../src/agents/RyuAgent';
import { AlexAgent } from '../src/agents/AlexAgent';
import { MayaAgent } from '../src/agents/MayaAgent';
import { BusinessLogicAgent } from '../src/agents/BusinessLogicAgent';
import { ValidationEventPayload } from '../src/agents/AgentContract';

describe('AikoRyuMesh - Autonomous Agent Orchestration System', () => {
  let mesh: AikoRyuMesh;
  
  beforeEach(() => {
    const config = {
      maxConcurrency: 10,
      eventTimeout: 30000,
      workflowTimeout: 300000,
      retryAttempts: 3,
      enableTracing: true,
      enableMetrics: true,
      logLevel: 'info' as const,
      agents: []
    };
    mesh = new AikoRyuMesh(config);
  });
  
  describe('Initialization', () => {
    it('should initialize with configuration', () => {
      expect(mesh).toBeDefined();
      expect(mesh.id).toBe('aikoryu-mesh');
      expect(mesh.version).toBe('1.0.0');
    });
    
    it('should initialize the mesh system', async () => {
      await mesh.initialize();
      const status = mesh.getStatus();
      expect(status.status).toBe('ready');
    });
  });
  
  describe('Agent Management', () => {
    it('should register agents', async () => {
      await mesh.initialize();
      
      const aiko = new AikoAgent('aiko');
      const ryu = new RyuAgent({});
      const alex = new AlexAgent({});
      const maya = new MayaAgent({});
      const businessLogic = new BusinessLogicAgent({});
      
      const result1 = await mesh.registerAgent(aiko);
      const result2 = await mesh.registerAgent(ryu);
      const result3 = await mesh.registerAgent(alex);
      const result4 = await mesh.registerAgent(maya);
      const result5 = await mesh.registerAgent(businessLogic);
      
      expect(result1).toBe(true);
      expect(result2).toBe(true);
      expect(result3).toBe(true);
      expect(result4).toBe(true);
      expect(result5).toBe(true);
      
      const agents = mesh.getAllAgents();
      expect(agents.size).toBe(5);
      expect(agents.has('aiko')).toBe(true);
      expect(agents.has('ryu')).toBe(true);
      expect(agents.has('alex')).toBe(true);
      expect(agents.has('maya')).toBe(true);
      expect(agents.has('business-logic')).toBe(true);
    });
    
    it('should get agent by id', async () => {
      await mesh.initialize();
      
      const aiko = new AikoAgent('aiko');
      await mesh.registerAgent(aiko);
      
      const agent = mesh.getAgent('aiko');
      expect(agent).toBeDefined();
      expect(agent?.id).toBe('aiko');
    });
    
    it('should return null for non-existent agent', async () => {
      await mesh.initialize();
      
      const agent = mesh.getAgent('non-existent');
      expect(agent).toBeNull();
    });
    
    it('should unregister agents', async () => {
      await mesh.initialize();
      
      const aiko = new AikoAgent('aiko');
      await mesh.registerAgent(aiko);
      
      const result = await mesh.unregisterAgent('aiko');
      expect(result).toBe(true);
      
      const agent = mesh.getAgent('aiko');
      expect(agent).toBeNull();
    });
  });
  
  describe('Event Communication', () => {
    it('should route events to specific agents', async () => {
      await mesh.initialize();
      
      const aiko = new AikoAgent('aiko');
      const ryu = new RyuAgent({});
      await mesh.registerAgent(aiko);
      await mesh.registerAgent(ryu);
      
      const payload: ValidationEventPayload = {
        timestamp: new Date(),
        correlationId: 'test-correlation',
        sourceAgent: 'test-agent',
        ruleId: 'test-rule',
        input: { test: 'data' },
        result: { result: true, consensus: true },
        context: 'test-context'
      };
      
      const result = await mesh.routeEvent('test.event', payload, 'aiko');
      expect(result.success).toBe(true);
      expect(result.routedTo).toBeDefined();
    });
    
    it('should broadcast events to all agents', async () => {
      await mesh.initialize();
      
      const aiko = new AikoAgent('aiko');
      const ryu = new RyuAgent({});
      await mesh.registerAgent(aiko);
      await mesh.registerAgent(ryu);
      
      const payload: ValidationEventPayload = {
        timestamp: new Date(),
        correlationId: 'test-correlation',
        sourceAgent: 'test-agent',
        ruleId: 'test-rule',
        input: { test: 'data' },
        result: { result: true, consensus: true },
        context: 'test-context'
      };
      
      const result = await mesh.broadcastEvent('test.event', payload, 'aiko');
      expect(result.success).toBe(true);
      expect(result.broadcastTo).toBeDefined();
    });
    
    it('should handle event subscription', async () => {
      await mesh.initialize();
      
      const aiko = new AikoAgent('aiko');
      await mesh.registerAgent(aiko);
      
      const result = await mesh.subscribeToEvents('aiko', ['test.event']);
      expect(result).toBe(true);
      
      const unsubscribeResult = await mesh.unsubscribeFromEvents('aiko', ['test.event']);
      expect(unsubscribeResult).toBe(true);
    });
  });
  
  describe('Workflow Orchestration', () => {
    it('should orchestrate workflows', async () => {
      await mesh.initialize();
      
      const aiko = new AikoAgent('aiko');
      const ryu = new RyuAgent({});
      await mesh.registerAgent(aiko);
      await mesh.registerAgent(ryu);
      
      const workflow = {
        id: 'test-workflow',
        name: 'Test Workflow',
        description: 'A test workflow',
        agents: ['aiko', 'ryu'],
        steps: [
          {
            id: 'step-1',
            agentId: 'aiko',
            action: 'test-action',
            parameters: { test: 'data' },
            dependencies: [],
            timeout: 30000,
            metadata: {}
          },
          {
            id: 'step-2',
            agentId: 'ryu',
            action: 'test-action',
            parameters: { test: 'data' },
            dependencies: ['step-1'],
            timeout: 30000,
            metadata: {}
          }
        ],
        dependencies: [],
        timeout: 300000,
        retryPolicy: {
          maxAttempts: 3,
          backoffStrategy: 'linear' as const,
          initialDelay: 1000,
          maxDelay: 10000
        },
        metadata: {}
      };
      
      const result = await mesh.orchestrateWorkflow(workflow);
      expect(result.success).toBeDefined();
      expect(result.workflowId).toBe('test-workflow');
      expect(result.status).toBeDefined();
    });
  });
  
  describe('System Integrity', () => {
    it('should validate system integrity', async () => {
      await mesh.initialize();
      
      const result = await mesh.validateSystemIntegrity();
      expect(result.result).toBeDefined();
    });
    
    it('should create system snapshots', async () => {
      await mesh.initialize();
      
      const aiko = new AikoAgent('aiko');
      await mesh.registerAgent(aiko);
      
      const snapshot = await mesh.createSystemSnapshot();
      expect(snapshot.id).toBeDefined();
      expect(snapshot.timestamp).toBeDefined();
      expect(snapshot.agents).toBeDefined();
    });
    
    it('should restore system snapshots', async () => {
      await mesh.initialize();
      
      const aiko = new AikoAgent({});
      await mesh.registerAgent(aiko);
      
      const snapshot = await mesh.createSystemSnapshot();
      const result = await mesh.restoreSystemSnapshot(snapshot.id);
      expect(result.success).toBeDefined();
    });
  });
  
  describe('Monitoring and Observability', () => {
    it('should get system metrics', async () => {
      await mesh.initialize();
      
      const metrics = await mesh.getSystemMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.totalAgents).toBeDefined();
      expect(metrics.activeAgents).toBeDefined();
      expect(metrics.totalWorkflows).toBeDefined();
    });
    
    it('should get event history', async () => {
      await mesh.initialize();
      
      const history = await mesh.getEventHistory(10);
      expect(history).toBeDefined();
      expect(Array.isArray(history)).toBe(true);
    });
    
    it('should get agent interactions', async () => {
      await mesh.initialize();
      
      const aiko = new AikoAgent({});
      await mesh.registerAgent(aiko);
      
      const interactions = await mesh.getAgentInteractions('aiko');
      expect(interactions).toBeDefined();
      expect(Array.isArray(interactions)).toBe(true);
    });
  });
  
  describe('Configuration Management', () => {
    it('should update configuration', async () => {
      await mesh.initialize();
      
      const newConfig = {
        maxConcurrency: 20,
        eventTimeout: 60000,
        workflowTimeout: 600000,
        retryAttempts: 5,
        enableTracing: true,
        enableMetrics: true,
        logLevel: 'debug' as const,
        agents: []
      };
      
      const result = await mesh.updateConfiguration(newConfig);
      expect(result).toBe(true);
    });
    
    it('should get current configuration', async () => {
      await mesh.initialize();
      
      const config = mesh.getConfiguration();
      expect(config).toBeDefined();
      expect(config.maxConcurrency).toBeDefined();
      expect(config.eventTimeout).toBeDefined();
    });
    
    it('should validate configuration', async () => {
      await mesh.initialize();
      
      const config = {
        maxConcurrency: 10,
        eventTimeout: 30000,
        workflowTimeout: 300000,
        retryAttempts: 3,
        enableTracing: true,
        enableMetrics: true,
        logLevel: 'info' as const,
        agents: []
      };
      
      const result = mesh.validateConfiguration(config);
      expect(result.result).toBeDefined();
    });
  });
  
  describe('Error Handling', () => {
    it('should handle agent registration errors gracefully', async () => {
      await mesh.initialize();
      
      // Try to register the same agent twice
      const aiko = new AikoAgent({});
      await mesh.registerAgent(aiko);
      
      const result = await mesh.registerAgent(aiko);
      expect(result).toBe(false);
    });
    
    it('should handle event routing errors gracefully', async () => {
      await mesh.initialize();
      
      const payload: ValidationEventPayload = {
        timestamp: new Date(),
        correlationId: 'test-correlation',
        sourceAgent: 'test-agent',
        ruleId: 'test-rule',
        input: { test: 'data' },
        result: { result: true, consensus: true },
        context: 'test-context'
      };
      
      const result = await mesh.routeEvent('test.event', payload, 'non-existent');
      expect(result.success).toBe(false);
    });
    
    it('should handle workflow orchestration errors gracefully', async () => {
      await mesh.initialize();
      
      const workflow = {
        id: 'invalid-workflow',
        name: 'Invalid Workflow',
        description: 'An invalid workflow',
        agents: ['non-existent'],
        steps: [
          {
            id: 'step-1',
            agentId: 'non-existent',
            action: 'test-action',
            parameters: {},
            dependencies: [],
            timeout: 30000,
            metadata: {}
          }
        ],
        dependencies: [],
        timeout: 300000,
        retryPolicy: {
          maxAttempts: 3,
          backoffStrategy: 'linear' as const,
          initialDelay: 1000,
          maxDelay: 10000
        },
        metadata: {}
      };
      
      const result = await mesh.orchestrateWorkflow(workflow);
      expect(result.success).toBe(false);
    });
  });
  
  describe('Lifecycle Management', () => {
    it('should shutdown gracefully', async () => {
      await mesh.initialize();
      
      const aiko = new AikoAgent({});
      await mesh.registerAgent(aiko);
      
      await mesh.shutdown();
      const status = mesh.getStatus();
      expect(status.status).toBe('shutting-down');
    });
    
    it('should handle shutdown with no agents gracefully', async () => {
      await mesh.initialize();
      await expect(mesh.shutdown()).resolves.not.toThrow();
    });
  });
  
  describe('Integration Tests', () => {
    it('should orchestrate a complete agent workflow', async () => {
      await mesh.initialize();
      
      // Register all agents
      const aiko = new AikoAgent({});
      const ryu = new RyuAgent({});
      const alex = new AlexAgent({});
      const maya = new MayaAgent({});
      const businessLogic = new BusinessLogicAgent({});
      
      await mesh.registerAgent(aiko);
      await mesh.registerAgent(ryu);
      await mesh.registerAgent(alex);
      await mesh.registerAgent(maya);
      await mesh.registerAgent(businessLogic);
      
      // Verify all agents are registered
      const agents = mesh.getAllAgents();
      expect(agents.size).toBe(5);
      
      // Test communication between agents
      const payload: ValidationEventPayload = {
        timestamp: new Date(),
        correlationId: 'integration-test',
        sourceAgent: 'aiko',
        ruleId: 'test-rule',
        input: { test: 'integration-data' },
        result: { result: true, consensus: true },
        context: 'integration-test'
      };
      
      const result = await mesh.broadcastEvent('integration.event', payload, 'aiko');
      expect(result.success).toBe(true);
      
      // Verify system status
      const status = mesh.getStatus();
      expect(status.status).toBe('ready');
      expect(status.agentCount).toBe(5);
    });
    
    it('should handle agent failures gracefully', async () => {
      await mesh.initialize();
      
      const aiko = new AikoAgent({});
      await mesh.registerAgent(aiko);
      
      // Simulate agent failure by trying to communicate with a non-existent agent
      const payload: ValidationEventPayload = {
        timestamp: new Date(),
        correlationId: 'failure-test',
        sourceAgent: 'aiko',
        ruleId: 'test-rule',
        input: { test: 'failure-data' },
        result: { result: true, consensus: true },
        context: 'failure-test'
      };
      
      const result = await mesh.routeEvent('failure.event', payload, 'non-existent');
      expect(result.success).toBe(false);
      
      // System should still be functional
      const status = mesh.getStatus();
      expect(status.status).toBe('ready');
    });
  });
}); 