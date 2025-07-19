import { RyuAgent } from '../src/agents/RyuAgent';
import { ValidationEventPayload, AgentStatus } from '../src/agents/AgentContract';

describe('RyuAgent - Integrity Guardian', () => {
  let ryu: RyuAgent;
  
  beforeEach(() => {
    ryu = new RyuAgent({});
  });
  
  describe('Initialization', () => {
    it('should have correct role and dependencies', () => {
      expect(ryu.role).toBe('Integrity Guardian');
      expect(ryu.dependencies).toEqual(['aiko', 'sarah']);
    });
    
    it('should have correct id', () => {
      expect(ryu.id).toBe('ryu');
    });
  });
  
  describe('Integrity Validation', () => {
    it('should validate integrity of valid output', async () => {
      await ryu.initialize();
      
      const validOutput = {
        timestamp: new Date(),
        data: { test: 'data' },
        integrityHash: 'abc123'
      };
      
      const result = ryu.validateIntegrity(validOutput);
      expect(result.result).toBe(true);
      expect(result.consensus).toBe(true);
    });
    
    it('should reject null output', async () => {
      await ryu.initialize();
      
      const result = ryu.validateIntegrity(null);
      expect(result.result).toBe(false);
      expect(result.reason).toContain('null or undefined');
    });
    
    it('should reject non-object output', async () => {
      await ryu.initialize();
      
      const result = ryu.validateIntegrity('string output');
      expect(result.result).toBe(false);
      expect(result.reason).toContain('must be an object');
    });
    
    it('should reject output missing required fields', async () => {
      await ryu.initialize();
      
      const invalidOutput = {
        data: { test: 'data' }
        // Missing timestamp
      };
      
      const result = ryu.validateIntegrity(invalidOutput);
      expect(result.result).toBe(false);
      expect(result.reason).toContain('missing required fields');
    });
  });
  
  describe('DAG Metadata Management', () => {
    it('should store and retrieve DAG metadata', async () => {
      await ryu.initialize();
      
      const metadata = {
        id: 'test-dag',
        version: '1.0.0',
        nodes: [
          {
            id: 'node-1',
            type: 'agent' as const,
            role: 'test-role',
            status: 'active' as const,
            dependencies: [],
            metadata: {}
          }
        ],
        edges: [],
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        integrityHash: '',
        validationStatus: 'pending' as const
      };
      
      const hash = await ryu.storeDAGMetadata(metadata);
      expect(hash).toBeDefined();
      
      const retrieved = await ryu.retrieveDAGMetadata(hash);
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe('test-dag');
    });
    
    it('should validate DAG metadata', async () => {
      await ryu.initialize();
      
      const validMetadata = {
        id: 'test-dag',
        version: '1.0.0',
        nodes: [
          {
            id: 'node-1',
            type: 'agent' as const,
            role: 'test-role',
            status: 'active' as const,
            dependencies: [],
            metadata: {}
          }
        ],
        edges: [],
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        integrityHash: '',
        validationStatus: 'pending' as const
      };
      
      const result = ryu.validateDAGMetadata(validMetadata);
      expect(result.result).toBe(true);
    });
    
    it('should reject invalid DAG metadata', async () => {
      await ryu.initialize();
      
      const invalidMetadata = {
        id: 'test-dag',
        version: '1.0.0',
        nodes: [
          {
            id: '', // Invalid: empty id
            type: 'agent' as const,
            role: 'test-role',
            status: 'active' as const,
            dependencies: [],
            metadata: {}
          }
        ],
        edges: [],
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        integrityHash: '',
        validationStatus: 'pending' as const
      };
      
      const result = ryu.validateDAGMetadata(invalidMetadata);
      expect(result.result).toBe(false);
    });
  });
  
  describe('Snapshot Management', () => {
    it('should create snapshots', async () => {
      await ryu.initialize();
      
      const agents: AgentStatus[] = [
        {
          status: 'ready',
          lastEvent: 'test',
          lastTrace: {
            timestamp: new Date(),
            eventType: 'test',
            metadata: { sourceAgent: 'test' }
          },
          uptime: 1000
        }
      ];
      
      const snapshot = await ryu.createSnapshot(agents);
      expect(snapshot.id).toBeDefined();
      expect(snapshot.agents).toHaveLength(1);
      expect(snapshot.validationStatus).toBe('valid');
    });
    
    it('should restore snapshots', async () => {
      await ryu.initialize();
      
      const agents: AgentStatus[] = [
        {
          status: 'ready',
          lastEvent: 'test',
          lastTrace: {
            timestamp: new Date(),
            eventType: 'test',
            metadata: { sourceAgent: 'test' }
          },
          uptime: 1000
        }
      ];
      
      const snapshot = await ryu.createSnapshot(agents);
      const result = await ryu.restoreSnapshot(snapshot.id);
      
      expect(result.success).toBe(true);
      expect(result.snapshotId).toBe(snapshot.id);
    });
    
    it('should handle non-existent snapshot restoration', async () => {
      await ryu.initialize();
      
      const result = await ryu.restoreSnapshot('non-existent');
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Snapshot not found');
    });
  });
  
  describe('Compliance Checking', () => {
    it('should check system compliance', async () => {
      await ryu.initialize();
      
      const report = await ryu.checkSystemCompliance();
      expect(report.timestamp).toBeDefined();
      expect(report.overallStatus).toBeDefined();
      expect(report.checks).toBeDefined();
      expect(report.recommendations).toBeDefined();
    });
    
    it('should validate agent outputs', async () => {
      await ryu.initialize();
      
      const validOutput = {
        timestamp: new Date(),
        data: { test: 'data' }
      };
      
      const result = ryu.validateAgentOutput('test-agent', validOutput);
      expect(result.result).toBe(true);
    });
    
    it('should enforce integrity policies', async () => {
      await ryu.initialize();
      
      const policies = [
        {
          id: 'test-policy',
          name: 'Test Policy',
          type: 'validation' as const,
          rules: [
            {
              id: 'test-rule',
              condition: 'true',
              action: 'allow' as const,
              description: 'Test rule'
            }
          ],
          severity: 'medium' as const
        }
      ];
      
      const result = await ryu.enforceIntegrityPolicies(policies);
      expect(result.success).toBe(true);
      expect(result.enforcedPolicies).toContain('test-policy');
    });
  });
  
  describe('Event Handling', () => {
    it('should handle integrity validation events', async () => {
      await ryu.initialize();
      
      const payload: ValidationEventPayload = {
        timestamp: new Date(),
        correlationId: 'test-correlation',
        sourceAgent: 'test-agent',
        ruleId: 'integrity-validation',
        input: { output: { timestamp: new Date(), data: { test: 'data' } } },
        result: { result: true, consensus: true },
        context: 'integrity-validation'
      };
      
      await expect(ryu.handleEvent('integrity.validate', payload)).resolves.not.toThrow();
    });
    
    it('should handle unknown events gracefully', async () => {
      await ryu.initialize();
      
      const payload: ValidationEventPayload = {
        timestamp: new Date(),
        correlationId: 'test-correlation',
        sourceAgent: 'test-agent',
        ruleId: 'unknown-event',
        input: {},
        result: { result: true, consensus: true },
        context: 'unknown-event'
      };
      
      await expect(ryu.handleEvent('unknown.event', payload)).resolves.not.toThrow();
    });
  });
  
  describe('Lifecycle Management', () => {
    it('should initialize correctly', async () => {
      await ryu.initialize();
      const status = ryu.getStatus();
      expect(status.status).toBe('ready');
    });
    
    it('should shutdown gracefully', async () => {
      await ryu.initialize();
      await ryu.shutdown();
      const status = ryu.getStatus();
      expect(status.status).toBe('ready');
    });
    
    it('should maintain uptime tracking', async () => {
      await ryu.initialize();
      const status = ryu.getStatus();
      expect(status.uptime).toBeGreaterThan(0);
    });
  });
  
  describe('Specification and Design', () => {
    it('should validate specifications', async () => {
      await ryu.initialize();
      
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
      
      const result = ryu.validateSpecification(spec);
      expect(result.result).toBe(true);
    });
    
    it('should generate design artifacts', async () => {
      await ryu.initialize();
      
      const artifacts = ryu.generateDesignArtifacts();
      expect(artifacts).toBeDefined();
      expect(artifacts.length).toBeGreaterThan(0);
      expect(artifacts[0].id).toBe('ryu-integrity-guardian');
    });
    
    it('should track user interactions', async () => {
      await ryu.initialize();
      
      const interaction = {
        id: 'test-interaction',
        userId: 'test-user',
        sessionId: 'test-session',
        action: 'test-action',
        context: { test: 'data' },
        timestamp: new Date(),
        outcome: 'success' as const
      };
      
      expect(() => ryu.trackUserInteraction(interaction)).not.toThrow();
    });
  });
  
  describe('Error Handling', () => {
    it('should handle validation errors gracefully', async () => {
      await ryu.initialize();
      
      const result = ryu.validateIntegrity(undefined);
      expect(result.result).toBe(false);
      expect(result.reason).toContain('null or undefined');
    });
    
    it('should handle DAG metadata validation errors', async () => {
      await ryu.initialize();
      
      const invalidMetadata = {
        id: '',
        version: '',
        nodes: [],
        edges: [],
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        integrityHash: '',
        validationStatus: 'pending' as const
      };
      
      const result = ryu.validateDAGMetadata(invalidMetadata);
      expect(result.result).toBe(false);
    });
  });
}); 