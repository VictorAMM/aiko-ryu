import { OrchestrationManager } from '../src/agents/OrchestrationManager';

describe('OrchestrationManager', () => {
  let orchestrationManager: OrchestrationManager;

  beforeEach(() => {
    orchestrationManager = new OrchestrationManager();
  });

  describe('Basic Properties', () => {
    it('should have correct id and role', () => {
      expect(orchestrationManager.id).toBe('orchestration-manager');
      expect(orchestrationManager.role).toBe('Orchestration Manager');
    });

    it('should have required dependencies', () => {
      expect(orchestrationManager.dependencies).toContain('aiko');
      expect(orchestrationManager.dependencies).toContain('ryu');
      expect(orchestrationManager.dependencies).toContain('sarah');
    });
  });

  describe('Lifecycle', () => {
    it('should initialize successfully', async () => {
      await expect(orchestrationManager.initialize()).resolves.not.toThrow();
    });

    it('should shutdown gracefully', async () => {
      await orchestrationManager.initialize();
      await expect(orchestrationManager.shutdown()).resolves.not.toThrow();
    });

    it('should return valid status', () => {
      const status = orchestrationManager.getStatus();
      expect(status).toHaveProperty('status');
      expect(status).toHaveProperty('uptime');
      expect(status.uptime).toBeGreaterThan(0);
    });
  });

  describe('Core Orchestration', () => {
    beforeEach(async () => {
      await orchestrationManager.initialize();
    });

    it('should coordinate agents', async () => {
      const coordination = {
        id: 'test-coordination',
        agents: [
          { id: 'agent-1', role: 'processor', capabilities: ['process'], requirements: [], priority: 1 },
          { id: 'agent-2', role: 'validator', capabilities: ['validate'], requirements: [], priority: 2 },
          { id: 'agent-3', role: 'output', capabilities: ['output'], requirements: [], priority: 3 }
        ],
        coordinationType: 'sequential' as const,
        dependencies: [
          { from: 'agent-1', to: 'agent-2', type: 'required' as const },
          { from: 'agent-2', to: 'agent-3', type: 'required' as const }
        ],
        constraints: [],
        timeout: 5000
      };

      const result = await orchestrationManager.coordinateAgents(coordination);
      
      expect(result.success).toBe(true);
      expect(Array.isArray(result.coordinatedAgents)).toBe(true);
      expect(Array.isArray(result.executionOrder)).toBe(true);
      expect(Array.isArray(result.dependencies)).toBe(true);
      expect(result.metrics).toBeDefined();
    });

    it('should establish communication channel', async () => {
      const channel = {
        id: 'test-channel',
        type: 'direct' as const,
        participants: ['agent-1', 'agent-2'],
        protocol: 'http' as const,
        security: {
          encryption: 'tls' as const,
          authentication: 'jwt' as const,
          authorization: 'rbac' as const
        },
        reliability: {
          retryPolicy: { maxRetries: 3, backoffStrategy: 'exponential' as const, initialDelay: 1000, maxDelay: 5000 },
          circuitBreaker: { failureThreshold: 5, recoveryTimeout: 30000, halfOpenState: false },
          timeout: 10000,
          deadLetterQueue: true
        },
        performance: {
          maxConcurrentConnections: 100,
          messageSizeLimit: 1024,
          throughputLimit: 1000,
          latencyTarget: 100
        }
      };

      const result = await orchestrationManager.establishCommunicationChannel(channel);
      
      expect(result.success).toBe(true);
      expect(result.channelId).toBe('test-channel');
      expect(Array.isArray(result.participants)).toBe(true);
      expect(result.metrics).toBeDefined();
    });

    it('should route messages', async () => {
      const message = {
        id: 'test-message',
        sourceAgent: 'agent-1',
        targetAgents: ['agent-2', 'agent-3'],
        messageType: 'request' as const,
        payload: { data: 'test' },
        priority: 'normal' as const,
        correlationId: 'test-correlation',
        timestamp: new Date(),
        ttl: 30000
      };

      const result = await orchestrationManager.routeMessage(message);
      
      expect(result.success).toBe(true);
      expect(Array.isArray(result.routedTo)).toBe(true);
      expect(Array.isArray(result.routingPath)).toBe(true);
      expect(Array.isArray(result.deliveryStatus)).toBe(true);
      expect(result.metrics).toBeDefined();
    });

    it('should balance load', async () => {
      const loadBalancing = {
        id: 'test-load-balancer',
        agents: [
          { id: 'agent-1', weight: 1, maxConnections: 100, healthStatus: 'healthy' as const, currentConnections: 0 },
          { id: 'agent-2', weight: 1, maxConnections: 100, healthStatus: 'healthy' as const, currentConnections: 0 }
        ],
        strategy: 'round-robin' as const,
        healthCheck: {
          enabled: true,
          interval: 5000,
          timeout: 3000,
          threshold: 3,
          path: '/health'
        },
        failover: {
          enabled: true,
          strategy: 'automatic' as const,
          recoveryTime: 30000,
          maxFailures: 3
        }
      };

      const result = await orchestrationManager.balanceLoad(loadBalancing);
      
      expect(result.success).toBe(true);
      expect(Array.isArray(result.balancedAgents)).toBe(true);
      expect(Array.isArray(result.distribution)).toBe(true);
      expect(Array.isArray(result.healthStatus)).toBe(true);
      expect(result.metrics).toBeDefined();
    });
  });

  describe('Advanced Orchestration', () => {
    beforeEach(async () => {
      await orchestrationManager.initialize();
    });

    it('should orchestrate workflow', async () => {
      const workflow = {
        id: 'test-workflow',
        name: 'Test Workflow',
        steps: [
          { id: 'step-1', name: 'Step 1', agent: 'agent-1', action: 'process', parameters: {}, dependencies: [], timeout: 5000, retryCount: 0 },
          { id: 'step-2', name: 'Step 2', agent: 'agent-2', action: 'validate', parameters: {}, dependencies: ['step-1'], timeout: 5000, retryCount: 0 }
        ],
        triggers: [],
        conditions: [],
        timeout: 30000,
        retryPolicy: { maxRetries: 3, backoffStrategy: 'exponential' as const, initialDelay: 1000, maxDelay: 5000 }
      };

      const result = await orchestrationManager.orchestrateWorkflow(workflow);
      
      expect(result.success).toBe(true);
      expect(result.workflowId).toBe('test-workflow');
      expect(Array.isArray(result.completedSteps)).toBe(true);
      expect(Array.isArray(result.failedSteps)).toBe(true);
      expect(result.executionTime).toBeGreaterThanOrEqual(0);
      expect(result.metrics).toBeDefined();
    });

    it('should manage failover', async () => {
      const failover = {
        id: 'test-failover',
        primaryAgent: 'agent-1',
        backupAgents: ['agent-2', 'agent-3'],
        failoverStrategy: 'automatic' as const,
        healthCheck: {
          enabled: true,
          interval: 5000,
          timeout: 3000,
          threshold: 3,
          path: '/health'
        },
        recoveryPolicy: {
          automaticRecovery: true,
          recoveryTime: 30000,
          maxRecoveryAttempts: 3,
          backoffStrategy: 'exponential' as const
        }
      };

      const result = await orchestrationManager.manageFailover(failover);
      
      expect(result.success).toBe(true);
      expect(result.failoverId).toBe('test-failover');
      expect(result.activeAgent).toBeDefined();
      expect(result.previousAgent).toBeDefined();
      expect(result.failoverTime).toBeInstanceOf(Date);
      expect(result.recoveryStatus).toBeDefined();
      expect(result.metrics).toBeDefined();
    });

    it('should optimize communication', async () => {
      const optimization = {
        id: 'test-optimization',
        optimizationType: 'latency' as const,
        parameters: [
          { name: 'latency', value: 100, min: 50, max: 200, unit: 'ms' },
          { name: 'throughput', value: 1000, min: 500, max: 2000, unit: 'req/s' }
        ],
        constraints: [],
        targetMetrics: {
          latency: 100,
          throughput: 1000,
          reliability: 0.99,
          cost: 100
        }
      };

      const result = await orchestrationManager.optimizeCommunication(optimization);
      
      expect(result.success).toBe(true);
      expect(result.optimizationId).toBe('test-optimization');
      expect(Array.isArray(result.appliedOptimizations)).toBe(true);
      expect(result.beforeMetrics).toBeDefined();
      expect(result.afterMetrics).toBeDefined();
      expect(result.improvement).toBeDefined();
      expect(Array.isArray(result.recommendations)).toBe(true);
    });
  });

  describe('Event Handling', () => {
    beforeEach(async () => {
      await orchestrationManager.initialize();
    });

    it('should handle workflow events', async () => {
      await expect(orchestrationManager.handleEvent('workflow.start', {
        workflowId: 'test-workflow',
        steps: []
      })).resolves.not.toThrow();
    });

    it('should handle agent coordination events', async () => {
      await expect(orchestrationManager.handleEvent('agents.coordinate', {
        agents: ['agent-1', 'agent-2'],
        dependencies: []
      })).resolves.not.toThrow();
    });

    it('should handle optimization events', async () => {
      await expect(orchestrationManager.handleEvent('workflow.optimize', {
        workflowId: 'test-workflow',
        strategy: 'parallel'
      })).resolves.not.toThrow();
    });

    it('should handle unknown events gracefully', async () => {
      await expect(orchestrationManager.handleEvent('unknown.event', {})).resolves.not.toThrow();
    });
  });

  describe('DDD/SDD Compliance', () => {
    it('should validate specifications', () => {
      const spec = {
        id: 'test-spec',
        role: 'test-role',
        dependencies: [],
        capabilities: [{
          id: 'cap-1',
          name: 'orchestration',
          description: 'Workflow orchestration capability',
          inputs: [],
          outputs: [],
          preconditions: [],
          postconditions: []
        }],
        interfaces: [],
        behaviors: [],
        constraints: [],
        designIntent: {
          purpose: 'test',
          userGoals: [],
          successMetrics: [],
          designPrinciples: [],
          accessibilityRequirements: []
        },
        userRequirements: [],
        validationRules: []
      };

      const result = orchestrationManager.validateSpecification(spec);
      expect(result).toHaveProperty('result');
      expect(result).toHaveProperty('consensus');
    });

    it('should generate design artifacts', () => {
      const artifacts = orchestrationManager.generateDesignArtifacts();
      expect(Array.isArray(artifacts)).toBe(true);
    });

    it('should track user interactions', () => {
      const interaction = {
        id: 'test-interaction',
        userId: 'test-user',
        sessionId: 'test-session',
        action: 'orchestrate',
        context: { workflow: 'test-workflow' },
        timestamp: new Date(),
        outcome: 'success' as const
      };

      expect(() => orchestrationManager.trackUserInteraction(interaction)).not.toThrow();
    });
  });
}); 