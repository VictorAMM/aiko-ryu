import { DynamicAgentComposer, WorkflowDefinition, AgentMutation, NegotiationProtocol, DAGState, MemoryfulAgentSpec } from '../src/agents/DynamicAgentComposer';
import { AgentSpecification, EventPayload } from '../src/agents/AgentContract';

/**
 * Dynamic Agent Composer Tests
 * 
 * Comprehensive test suite for advanced agent orchestration capabilities:
 * - Dynamic agent composition
 * - Runtime workflow orchestration
 * - Agent behavior mutation
 * - Cross-agent negotiation protocols
 * - Advanced DAG diffing and versioning
 * - Memoryful agent management
 */

describe('Dynamic Agent Composer Tests', () => {
  let composer: DynamicAgentComposer;
  
  const testAgentSpec: AgentSpecification = {
    id: 'test-agent',
    role: 'Test Agent',
    dependencies: ['aiko'],
    capabilities: [
      {
        id: 'cap-1',
        name: 'Test Capability',
        description: 'A test capability',
        inputs: [],
        outputs: [],
        preconditions: [],
        postconditions: []
      }
    ],
    interfaces: [],
    behaviors: [],
    constraints: [],
    validationRules: [],
    designIntent: {
      purpose: 'Testing',
      userGoals: ['Test functionality'],
      successMetrics: [],
      designPrinciples: [],
      accessibilityRequirements: []
    },
    userRequirements: []
  };

  const testWorkflow: WorkflowDefinition = {
    id: 'test-workflow',
    name: 'Test Workflow',
    agents: ['agent-1', 'agent-2'],
    dependencies: [
      {
        from: 'agent-1',
        to: 'agent-2',
        type: 'data'
      }
    ],
    triggers: [
      {
        type: 'event',
        value: 'workflow.start',
        target: 'agent-1'
      }
    ],
    outcomes: [
      {
        type: 'success',
        description: 'Workflow completed successfully',
        nextActions: []
      }
    ],
    validationRules: []
  };

  const testMutation: AgentMutation = {
    type: 'behavior',
    changes: {
      newBehavior: 'test-behavior',
      parameters: { param1: 'value1' }
    },
    validationRules: []
  };

  const testNegotiationProtocol: NegotiationProtocol = {
    id: 'test-protocol',
    participants: ['agent-1', 'agent-2'],
    rounds: [
      {
        round: 1,
        actions: [
          {
            type: 'propose',
            agent: 'agent-1',
            data: { proposal: 'test-proposal' }
          },
          {
            type: 'accept',
            agent: 'agent-2',
            data: { acceptance: true }
          }
        ],
        validations: []
      }
    ],
    consensusThreshold: 0.5,
    timeout: 5000
  };

  const testDAGState: DAGState = {
    version: 'v1.0',
    nodes: [
      {
        id: 'node-1',
        type: 'agent',
        data: { agentId: 'agent-1' },
        position: { x: 0, y: 0 }
      },
      {
        id: 'node-2',
        type: 'agent',
        data: { agentId: 'agent-2' },
        position: { x: 100, y: 0 }
      }
    ],
    edges: [
      {
        id: 'edge-1',
        source: 'node-1',
        target: 'node-2',
        type: 'data'
      }
    ],
    metadata: { description: 'Test DAG' }
  };

  const testMemoryfulAgentSpec: MemoryfulAgentSpec = {
    ...testAgentSpec,
    memoryConfig: {
      maxSize: 1000,
      retentionPolicy: 'lru',
      persistence: 'memory',
      encryption: false
    },
    statefulExecution: true,
    memoryRetention: 'session'
  };

  beforeEach(async () => {
    composer = new DynamicAgentComposer();
    await composer.initialize();
  });

  afterEach(async () => {
    await composer.shutdown();
  });

  describe('Agent Composition', () => {
    it('should compose agent from specification', async () => {
      const agentId = await composer.composeAgent(testAgentSpec);
      
      expect(agentId).toBeDefined();
      expect(typeof agentId).toBe('string');
      expect(agentId.length).toBeGreaterThan(0);
    });

    it('should validate agent specification before composition', async () => {
      const invalidSpec = { ...testAgentSpec, id: '' };
      
      await expect(composer.composeAgent(invalidSpec))
        .rejects.toThrow('Invalid agent specification');
    });

    it('should handle composition failures gracefully', async () => {
      const invalidSpec = { ...testAgentSpec, role: '' };
      
      await expect(composer.composeAgent(invalidSpec))
        .rejects.toThrow('Invalid agent specification');
    });
  });

  describe('Workflow Orchestration', () => {
    it('should orchestrate agents in workflow', async () => {
      // First compose some agents
      const agent1Id = await composer.composeAgent(testAgentSpec);
      const agent2Id = await composer.composeAgent({
        ...testAgentSpec,
        id: 'test-agent-2',
        role: 'Test Agent 2'
      });

      const workflow = {
        ...testWorkflow,
        agents: [agent1Id, agent2Id]
      };

      const result = await composer.orchestrateAgents([agent1Id, agent2Id], workflow);
      
      expect(result.workflowId).toBe(workflow.id);
      expect(result.status).toBe('completed');
      expect(result.startTime).toBeInstanceOf(Date);
      expect(result.endTime).toBeInstanceOf(Date);
      expect(result.results).toBeDefined();
      expect(result.errors).toEqual([]);
    });

    it('should handle workflow orchestration failures', async () => {
      const workflow = {
        ...testWorkflow,
        agents: ['non-existent-agent']
      };

      const result = await composer.orchestrateAgents(['non-existent-agent'], workflow);
      
      expect(result.status).toBe('failed');
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Agent Mutation', () => {
    it('should mutate agent behavior', async () => {
      const agentId = await composer.composeAgent(testAgentSpec);
      
      const result = await composer.mutateAgent(agentId, testMutation);
      
      expect(result).toBe(true);
    });

    it('should handle mutation failures', async () => {
      const result = await composer.mutateAgent('non-existent-agent', testMutation);
      
      expect(result).toBe(false);
    });

    it('should support different mutation types', async () => {
      const agentId = await composer.composeAgent(testAgentSpec);
      
      const capabilityMutation: AgentMutation = {
        type: 'capability',
        changes: { newCapability: 'test-capability' },
        validationRules: []
      };

      const result = await composer.mutateAgent(agentId, capabilityMutation);
      expect(result).toBe(true);
    });
  });

  describe('Negotiation Protocols', () => {
    it('should execute negotiation protocol', async () => {
      // First compose agents
      const agent1Id = await composer.composeAgent(testAgentSpec);
      const agent2Id = await composer.composeAgent({
        ...testAgentSpec,
        id: 'test-agent-2',
        role: 'Test Agent 2'
      });

      const protocol = {
        ...testNegotiationProtocol,
        participants: [agent1Id, agent2Id]
      };

      const result = await composer.negotiateProtocol([agent1Id, agent2Id], protocol);
      
      expect(result.protocolId).toBe(protocol.id);
      expect(result.participants).toEqual([agent1Id, agent2Id]);
      expect(result.rounds).toBeGreaterThan(0);
      expect(result.duration).toBeGreaterThanOrEqual(0);
    });

    it('should handle negotiation failures', async () => {
      const protocol = {
        ...testNegotiationProtocol,
        participants: ['non-existent-agent']
      };

      const result = await composer.negotiateProtocol(['non-existent-agent'], protocol);
      
      expect(result.consensus).toBe(false);
      expect(result.agreement).toEqual({});
    });
  });

  describe('DAG Diffing and Versioning', () => {
    it('should create DAG diff', async () => {
      const originalDAG = testDAGState;
      const newDAG: DAGState = {
        ...testDAGState,
        version: 'v1.1',
        nodes: [
          ...testDAGState.nodes,
          {
            id: 'node-3',
            type: 'agent',
            data: { agentId: 'agent-3' },
            position: { x: 200, y: 0 }
          }
        ]
      };

      const diff = await composer.createDAGDiff(originalDAG, newDAG);
      
      expect(diff.version).toBeDefined();
      expect(diff.changes).toBeDefined();
      expect(diff.changes.length).toBeGreaterThan(0);
      expect(diff.metadata).toBeDefined();
    });

    it('should apply DAG diff', async () => {
      const originalDAG = testDAGState;
      const newDAG: DAGState = {
        ...testDAGState,
        version: 'v1.1',
        nodes: [
          ...testDAGState.nodes,
          {
            id: 'node-3',
            type: 'agent',
            data: { agentId: 'agent-3' },
            position: { x: 200, y: 0 }
          }
        ]
      };

      const diff = await composer.createDAGDiff(originalDAG, newDAG);
      const result = await composer.applyDAGDiff(diff);
      
      expect(result).toBe(true);
    });

    it('should handle DAG rollback', async () => {
      const result = await composer.rollbackDAG('v1.0');
      
      // This should fail since we don't have stored versions
      expect(result).toBe(false);
    });
  });

  describe('Memoryful Agents', () => {
    it('should create memoryful agent', async () => {
      const agentId = await composer.createMemoryfulAgent(testMemoryfulAgentSpec);
      
      expect(agentId).toBeDefined();
      expect(typeof agentId).toBe('string');
    });

    it('should update agent memory', async () => {
      const agentId = await composer.createMemoryfulAgent(testMemoryfulAgentSpec);
      
      const memory = await composer.retrieveAgentMemory(agentId);
      const updatedMemory = {
        ...memory,
        data: { ...memory.data, newData: 'test-value' }
      };

      const result = await composer.updateAgentMemory(agentId, updatedMemory);
      
      expect(result).toBe(true);
    });

    it('should retrieve agent memory', async () => {
      const agentId = await composer.createMemoryfulAgent(testMemoryfulAgentSpec);
      
      const memory = await composer.retrieveAgentMemory(agentId);
      
      expect(memory.agentId).toBe(agentId);
      expect(memory.sessionId).toBeDefined();
      expect(memory.data).toBeDefined();
      expect(memory.context).toBeDefined();
      expect(memory.timestamp).toBeInstanceOf(Date);
      expect(memory.version).toBe(1);
    });

    it('should handle memory retrieval failures', async () => {
      await expect(composer.retrieveAgentMemory('non-existent-agent'))
        .rejects.toThrow('Agent non-existent-agent memory not found');
    });
  });

  describe('Event Handling', () => {
    it('should handle agent composition events', async () => {
      const event = {
        specification: testAgentSpec
      };

      await expect(composer.handleEvent('agent.compose', event as EventPayload))
        .resolves.not.toThrow();
    });

    it('should handle workflow orchestration events', async () => {
      const event = {
        workflow: testWorkflow
      };

      await expect(composer.handleEvent('workflow.orchestrate', event as EventPayload))
        .resolves.not.toThrow();
    });

    it('should handle agent mutation events', async () => {
      const event = {
        agentId: 'test-agent',
        mutation: testMutation
      };

      await expect(composer.handleEvent('agent.mutate', event as EventPayload))
        .resolves.not.toThrow();
    });

    it('should handle negotiation events', async () => {
      const event = {
        protocol: testNegotiationProtocol
      };

      await expect(composer.handleEvent('negotiation.start', event as EventPayload))
        .resolves.not.toThrow();
    });
  });

  describe('Status and Validation', () => {
    it('should return agent status', () => {
      const status = composer.getStatus();
      
      expect(status.status).toBe('ready');
      expect(status.uptime).toBeGreaterThan(0);
      expect(status.lastEvent).toBeDefined();
      expect(status.lastTrace).toBeDefined();
    });

    it('should validate specifications', () => {
      const result = composer.validateSpecification(testAgentSpec);
      
      expect(result.result).toBe(true);
      expect(result.consensus).toBe(true);
    });

    it('should generate design artifacts', () => {
      const artifacts = composer.generateDesignArtifacts();
      
      expect(Array.isArray(artifacts)).toBe(true);
    });

    it('should track user interactions', () => {
      const interaction = {
        id: 'test-interaction',
        sessionId: 'test-session',
        userId: 'test-user',
        action: 'test-action',
        timestamp: new Date(),
        context: {},
        outcome: 'success' as const
      };

      expect(() => composer.trackUserInteraction(interaction))
        .not.toThrow();
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle multiple agent compositions', async () => {
      const compositions = Array.from({ length: 10 }, (_, i) => ({
        ...testAgentSpec,
        id: `test-agent-${i}`,
        role: `Test Agent ${i}`
      }));

      const agentIds = await Promise.all(
        compositions.map(spec => composer.composeAgent(spec))
      );

      expect(agentIds.length).toBe(10);
      expect(agentIds.every(id => typeof id === 'string')).toBe(true);
    });

    it('should handle concurrent workflow orchestration', async () => {
      // Compose multiple agents
      const agentIds = await Promise.all(
        Array.from({ length: 5 }, (_, i) => 
          composer.composeAgent({
            ...testAgentSpec,
            id: `test-agent-${i}`,
            role: `Test Agent ${i}`
          })
        )
      );

      // Create multiple workflows
      const workflows = agentIds.map((agentId, i) => ({
        ...testWorkflow,
        id: `workflow-${i}`,
        agents: [agentId]
      }));

      const results = await Promise.all(
        workflows.map(workflow => 
          composer.orchestrateAgents(workflow.agents, workflow)
        )
      );

      expect(results.length).toBe(5);
      expect(results.every(result => result.status === 'completed')).toBe(true);
    });
  });

  describe('Error Handling and Resilience', () => {
    it('should handle invalid agent specifications', async () => {
      const invalidSpecs = [
        { ...testAgentSpec, id: '' },
        { ...testAgentSpec, role: '' },
        { ...testAgentSpec, capabilities: [] }
      ];

      for (const invalidSpec of invalidSpecs) {
        await expect(composer.composeAgent(invalidSpec))
          .rejects.toThrow('Invalid agent specification');
      }
    });

    it('should handle non-existent agents gracefully', async () => {
      const result = await composer.mutateAgent('non-existent-agent', testMutation);
      expect(result).toBe(false);
    });

    it('should handle workflow orchestration with missing agents', async () => {
      const result = await composer.orchestrateAgents(['non-existent-agent'], testWorkflow);
      expect(result.status).toBe('failed');
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
}); 