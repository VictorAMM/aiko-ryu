import { MayaAgent } from '../src/agents/MayaAgent';
import { ValidationEventPayload, AgentStatus } from '../src/agents/AgentContract';

describe('MayaAgent - Context Manager', () => {
  let maya: MayaAgent;
  
  beforeEach(() => {
    maya = new MayaAgent({});
  });
  
  describe('Initialization', () => {
    it('should have correct role and dependencies', () => {
      expect(maya.role).toBe('Context Manager');
      expect(maya.dependencies).toEqual(['aiko', 'ryu', 'alex']);
    });
    
    it('should have correct id', () => {
      expect(maya.id).toBe('maya');
    });
  });
  
  describe('Context Management', () => {
    it('should propagate context', async () => {
      await maya.initialize();
      
      const contextSlice = {
        id: 'test-context',
        agentId: 'test-agent',
        timestamp: new Date(),
        data: { test: 'data' },
        metadata: {
          source: 'test-source',
          version: '1.0.0',
          tags: ['test'],
          confidence: 0.8,
          freshness: 1.0,
          relationships: []
        },
        priority: 'medium' as const
      };
      
      const result = await maya.propagateContext(contextSlice);
      expect(result.success).toBe(true);
      expect(result.contextId).toBeDefined();
    });
    
    it('should merge contexts', async () => {
      await maya.initialize();
      
      const contextSlices = [
        {
          id: 'context-1',
          agentId: 'agent-1',
          timestamp: new Date(),
          data: { data1: 'value1' },
          metadata: {
            source: 'test-source',
            version: '1.0.0',
            tags: ['test'],
            confidence: 0.8,
            freshness: 1.0,
            relationships: []
          },
          priority: 'medium' as const
        },
        {
          id: 'context-2',
          agentId: 'agent-2',
          timestamp: new Date(),
          data: { data2: 'value2' },
          metadata: {
            source: 'test-source',
            version: '1.0.0',
            tags: ['test'],
            confidence: 0.8,
            freshness: 1.0,
            relationships: []
          },
          priority: 'medium' as const
        }
      ];
      
      const result = await maya.mergeContexts(contextSlices);
      expect(result.id).toBeDefined();
      expect(result.contexts).toHaveLength(2);
      expect(result.mergedData).toBeDefined();
    });
    
    it('should validate context', async () => {
      await maya.initialize();
      
      const contextSlice = {
        id: 'test-context',
        agentId: 'test-agent',
        timestamp: new Date(),
        data: { test: 'data' },
        metadata: {
          source: 'test-source',
          version: '1.0.0',
          tags: ['test'],
          confidence: 0.8,
          freshness: 1.0,
          relationships: []
        },
        priority: 'medium' as const
      };
      
      const result = maya.validateContext(contextSlice);
      expect(result.result).toBe(true);
    });
  });
  
  describe('State Transition Management', () => {
    it('should handle state transitions', async () => {
      await maya.initialize();
      
      const contextSlice = {
        id: 'test-context',
        agentId: 'test-agent',
        timestamp: new Date(),
        data: { test: 'data' },
        metadata: {
          source: 'test-source',
          version: '1.0.0',
          tags: ['test'],
          confidence: 0.8,
          freshness: 1.0,
          relationships: []
        },
        priority: 'medium' as const
      };
      
      const result = await maya.handleStateTransition('initializing', 'ready', contextSlice);
      expect(result.success).toBe(true);
      expect(result.fromState).toBe('initializing');
      expect(result.toState).toBe('ready');
    });
    
    it('should track state history', async () => {
      await maya.initialize();
      
      await maya.trackStateHistory('test-agent', 'ready');
      const history = await maya.getStateHistory('test-agent');
      
      expect(history).toBeDefined();
      expect(history.length).toBeGreaterThan(0);
      expect(history[0].agentId).toBe('test-agent');
      expect(history[0].state).toBe('ready');
    });
  });
  
  describe('Cultural Transformation', () => {
    it('should initiate cultural transformation', async () => {
      await maya.initialize();
      
      const transformation = {
        id: 'test-transformation',
        type: 'workshop' as const,
        participants: ['agent-1', 'agent-2'],
        objectives: ['Improve collaboration', 'Enhance communication'],
        metrics: [
          {
            id: 'metric-1',
            name: 'Collaboration Score',
            type: 'quantitative' as const,
            target: 85,
            current: 70,
            unit: 'percentage'
          }
        ],
        timeline: {
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          milestones: [
            {
              id: 'milestone-1',
              name: 'Workshop Completion',
              date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
              objectives: ['Complete workshop'],
              status: 'pending' as const
            }
          ]
        }
      };
      
      const result = await maya.initiateCulturalTransformation(transformation);
      expect(result.success).toBe(true);
      expect(result.transformationId).toBe('test-transformation');
    });
    
    it('should track cultural metrics', async () => {
      await maya.initialize();
      
      const metrics = {
        timestamp: new Date(),
        metrics: [
          {
            id: 'metric-1',
            name: 'Collaboration Score',
            type: 'quantitative' as const,
            target: 85,
            current: 70,
            unit: 'percentage'
          }
        ],
        overallProgress: 70,
        successRate: 0.8,
        participantSatisfaction: 0.9
      };
      
      await expect(maya.trackCulturalMetrics(metrics)).resolves.not.toThrow();
    });
    
    it('should generate cultural insights', async () => {
      await maya.initialize();
      
      const insights = await maya.generateCulturalInsights();
      expect(insights).toBeDefined();
      expect(Array.isArray(insights)).toBe(true);
    });
  });
  
  describe('Context Enrichment and Synthesis', () => {
    it('should enrich context', async () => {
      await maya.initialize();
      
      const contextSlice = {
        id: 'test-context',
        agentId: 'test-agent',
        timestamp: new Date(),
        data: { test: 'data' },
        metadata: {
          source: 'test-source',
          version: '1.0.0',
          tags: ['test'],
          confidence: 0.8,
          freshness: 1.0,
          relationships: []
        },
        priority: 'medium' as const
      };
      
      const result = await maya.enrichContext(contextSlice);
      expect(result.originalContext).toBeDefined();
      expect(result.enrichments).toBeDefined();
      expect(result.confidence).toBeDefined();
    });
    
    it('should synthesize context', async () => {
      await maya.initialize();
      
      const contextSlices = [
        {
          id: 'context-1',
          agentId: 'agent-1',
          timestamp: new Date(),
          data: { data1: 'value1' },
          metadata: {
            source: 'test-source',
            version: '1.0.0',
            tags: ['test'],
            confidence: 0.8,
            freshness: 1.0,
            relationships: []
          },
          priority: 'medium' as const
        },
        {
          id: 'context-2',
          agentId: 'agent-2',
          timestamp: new Date(),
          data: { data2: 'value2' },
          metadata: {
            source: 'test-source',
            version: '1.0.0',
            tags: ['test'],
            confidence: 0.8,
            freshness: 1.0,
            relationships: []
          },
          priority: 'medium' as const
        }
      ];
      
      const result = await maya.synthesizeContext(contextSlices);
      expect(result.id).toBeDefined();
      expect(result.contexts).toHaveLength(2);
      expect(result.synthesis).toBeDefined();
    });
    
    it('should create context snapshot', async () => {
      await maya.initialize();
      
      const snapshot = await maya.createContextSnapshot();
      expect(snapshot.id).toBeDefined();
      expect(snapshot.timestamp).toBeDefined();
      expect(snapshot.contexts).toBeDefined();
    });
  });
  
  describe('Context Routing and Distribution', () => {
    it('should route context', async () => {
      await maya.initialize();
      
      const contextSlice = {
        id: 'test-context',
        agentId: 'test-agent',
        timestamp: new Date(),
        data: { test: 'data' },
        metadata: {
          source: 'test-source',
          version: '1.0.0',
          tags: ['test'],
          confidence: 0.8,
          freshness: 1.0,
          relationships: []
        },
        priority: 'medium' as const
      };
      
      const targetAgents = ['agent-1', 'agent-2'];
      const result = await maya.routeContext(contextSlice, targetAgents);
      
      expect(result.success).toBe(true);
      expect(result.contextId).toBe('test-context');
      expect(result.routedTo).toBeDefined();
    });
    
    it('should distribute context', async () => {
      await maya.initialize();
      
      const contextSlice = {
        id: 'test-context',
        agentId: 'test-agent',
        timestamp: new Date(),
        data: { test: 'data' },
        metadata: {
          source: 'test-source',
          version: '1.0.0',
          tags: ['test'],
          confidence: 0.8,
          freshness: 1.0,
          relationships: []
        },
        priority: 'medium' as const
      };
      
      const result = await maya.distributeContext(contextSlice);
      expect(result.success).toBe(true);
      expect(result.contextId).toBe('test-context');
      expect(result.distributedTo).toBeDefined();
    });
    
    it('should filter context', async () => {
      await maya.initialize();
      
      const contextSlice = {
        id: 'test-context',
        agentId: 'test-agent',
        timestamp: new Date(),
        data: { test: 'data', sensitive: 'secret' },
        metadata: {
          source: 'test-source',
          version: '1.0.0',
          tags: ['test'],
          confidence: 0.8,
          freshness: 1.0,
          relationships: []
        },
        priority: 'medium' as const
      };
      
      const filters = [
        {
          id: 'filter-1',
          type: 'semantic' as const,
          criteria: { exclude: ['sensitive'] },
          action: 'exclude' as const
        }
      ];
      
      const result = await maya.filterContext(contextSlice, filters);
      expect(result.originalContext).toBeDefined();
      expect(result.filters).toBeDefined();
      expect(result.filteredData).toBeDefined();
      expect(result.excludedData).toBeDefined();
    });
  });
  
  describe('Event Handling', () => {
    it('should handle context propagation events', async () => {
      await maya.initialize();
      
      const payload: ValidationEventPayload = {
        timestamp: new Date(),
        correlationId: 'test-correlation',
        sourceAgent: 'test-agent',
        ruleId: 'context-propagation',
        input: {
          context: {
            id: 'test-context',
            agentId: 'test-agent',
            timestamp: new Date(),
            data: { test: 'data' },
            metadata: {
              source: 'test-source',
              version: '1.0.0',
              tags: ['test'],
              confidence: 0.8,
              freshness: 1.0,
              relationships: []
            },
            priority: 'medium'
          }
        },
        result: { result: true, consensus: true },
        context: 'context-propagation'
      };
      
      await expect(maya.handleEvent('context.propagate', payload)).resolves.not.toThrow();
    });
    
    it('should handle state transition events', async () => {
      await maya.initialize();
      
      const payload: ValidationEventPayload = {
        timestamp: new Date(),
        correlationId: 'test-correlation',
        sourceAgent: 'test-agent',
        ruleId: 'state-transition',
        input: {
          fromState: 'initializing',
          toState: 'ready',
          context: {
            id: 'test-context',
            agentId: 'test-agent',
            timestamp: new Date(),
            data: { test: 'data' },
            metadata: {
              source: 'test-source',
              version: '1.0.0',
              tags: ['test'],
              confidence: 0.8,
              freshness: 1.0,
              relationships: []
            },
            priority: 'medium'
          }
        },
        result: { result: true, consensus: true },
        context: 'state-transition'
      };
      
      await expect(maya.handleEvent('state.transition', payload)).resolves.not.toThrow();
    });
    
    it('should handle cultural transformation events', async () => {
      await maya.initialize();
      
      const payload: ValidationEventPayload = {
        timestamp: new Date(),
        correlationId: 'test-correlation',
        sourceAgent: 'test-agent',
        ruleId: 'cultural-transformation',
        input: {
          transformation: {
            id: 'test-transformation',
            type: 'workshop',
            participants: ['agent-1'],
            objectives: ['Improve collaboration'],
            metrics: [],
            timeline: {
              startDate: new Date(),
              endDate: new Date(),
              milestones: []
            }
          }
        },
        result: { result: true, consensus: true },
        context: 'cultural-transformation'
      };
      
      await expect(maya.handleEvent('cultural.transformation.start', payload)).resolves.not.toThrow();
    });
    
    it('should handle unknown events gracefully', async () => {
      await maya.initialize();
      
      const payload: ValidationEventPayload = {
        timestamp: new Date(),
        correlationId: 'test-correlation',
        sourceAgent: 'test-agent',
        ruleId: 'unknown-event',
        input: {},
        result: { result: true, consensus: true },
        context: 'unknown-event'
      };
      
      await expect(maya.handleEvent('unknown.event', payload)).resolves.not.toThrow();
    });
  });
  
  describe('Lifecycle Management', () => {
    it('should initialize correctly', async () => {
      await maya.initialize();
      const status = maya.getStatus();
      expect(status.status).toBe('ready');
    });
    
    it('should shutdown gracefully', async () => {
      await maya.initialize();
      await maya.shutdown();
      const status = maya.getStatus();
      expect(status.status).toBe('ready');
    });
    
    it('should maintain uptime tracking', async () => {
      await maya.initialize();
      const status = maya.getStatus();
      expect(status.uptime).toBeGreaterThan(0);
    });
  });
  
  describe('Specification and Design', () => {
    it('should validate specifications', async () => {
      await maya.initialize();
      
      const spec = {
        id: 'test-spec',
        role: 'test-role',
        dependencies: [],
        capabilities: [],
        interfaces: [],
        behaviors: [],
        constraints: [],
        validationRules: [],
        designIntent: {
          purpose: 'test',
          userGoals: [],
          successMetrics: [],
          designPrinciples: [],
          accessibilityRequirements: []
        },
        userRequirements: [],
        name: 'Test Specification',
        description: 'Test description',
        version: '1.0.0',
        schema: 'test-schema'
      };
      
      const result = maya.validateSpecification(spec);
      expect(result.result).toBe(true);
    });
    
    it('should generate design artifacts', async () => {
      await maya.initialize();
      
      const artifacts = maya.generateDesignArtifacts();
      expect(artifacts).toBeDefined();
      expect(artifacts.length).toBeGreaterThan(0);
      expect(artifacts[0].id).toBe('maya-context-manager');
    });
    
    it('should track user interactions', async () => {
      await maya.initialize();
      
      const interaction = {
        id: 'test-interaction',
        userId: 'test-user',
        sessionId: 'test-session',
        action: 'test-action',
        context: { test: 'data' },
        timestamp: new Date(),
        outcome: 'success' as const
      };
      
      expect(() => maya.trackUserInteraction(interaction)).not.toThrow();
    });
  });
  
  describe('Error Handling', () => {
    it('should handle invalid context gracefully', async () => {
      await maya.initialize();
      
      const invalidContextSlice = {
        id: '',
        agentId: '',
        timestamp: new Date(),
        data: {},
        metadata: {
          source: '',
          version: '',
          tags: [],
          confidence: -1,
          freshness: -1,
          relationships: []
        },
        priority: 'medium' as const
      };
      
      const result = await maya.propagateContext(invalidContextSlice);
      expect(result.success).toBe(false);
    });
    
    it('should handle invalid state transitions gracefully', async () => {
      await maya.initialize();
      
      const contextSlice = {
        id: 'test-context',
        agentId: 'test-agent',
        timestamp: new Date(),
        data: { test: 'data' },
        metadata: {
          source: 'test-source',
          version: '1.0.0',
          tags: ['test'],
          confidence: 0.8,
          freshness: 1.0,
          relationships: []
        },
        priority: 'medium' as const
      };
      
      const result = await maya.handleStateTransition('invalid', 'also-invalid', contextSlice);
      expect(result.success).toBe(false);
    });
  });
}); 