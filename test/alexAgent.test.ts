import { AlexAgent } from '../src/agents/AlexAgent';
import { ValidationEventPayload } from '../src/agents/AgentContract';

describe('AlexAgent - DAG Orchestrator', () => {
  let alex: AlexAgent;
  
  beforeEach(() => {
    alex = new AlexAgent({});
  });

  afterEach(async () => {
    // Clean up any active timers and async operations
    if (alex) {
      await alex.shutdown();
    }
    // Wait a bit to ensure all async operations complete
    await new Promise(resolve => setTimeout(resolve, 100));
  });
  
  describe('Initialization', () => {
    it('should have correct role and dependencies', () => {
      expect(alex.role).toBe('DAG Orchestrator');
      expect(alex.dependencies).toEqual(['aiko', 'ryu']);
    });
    
    it('should have correct id', () => {
      expect(alex.id).toBe('alex');
    });
  });
  
  describe('DAG Management', () => {
    it('should create DAGs', async () => {
      await alex.initialize();
      
      const dagSpec = {
        id: 'test-dag',
        name: 'Test DAG',
        version: '1.0.0',
        nodes: [
          {
            id: 'node-1',
            name: 'Test Node',
            type: 'task' as const,
            taskType: 'data-processing',
            dependencies: [],
            metadata: { input: 'test-data' }
          }
        ],
        edges: [
          {
            id: 'edge-1',
            source: 'node-1',
            target: 'node-2',
            type: 'success' as const,
            metadata: {}
          }
        ],
        metadata: {},
        executionPolicy: {
          maxConcurrency: 1,
          timeout: 30000,
          retryAttempts: 3,
          failureThreshold: 1
        },
        failureHandling: {
          strategy: 'stop' as const,
          compensationTasks: [],
          notificationChannels: []
        }
      };
      
      const dag = await alex.createDAG(dagSpec);
      expect(dag.id).toBe('test-dag');
      expect(dag.spec.nodes).toHaveLength(1);
      expect(dag.spec.edges).toHaveLength(1);
    });
    
    it('should validate DAGs', async () => {
      await alex.initialize();
      
      const dagSpec = {
        id: 'test-dag',
        name: 'Test DAG',
        version: '1.0.0',
        nodes: [
          {
            id: 'node-1',
            name: 'Test Node',
            type: 'task' as const,
            taskType: 'data-processing',
            dependencies: [],
            metadata: { input: 'test-data' }
          }
        ],
        edges: [],
        metadata: {},
        executionPolicy: {
          maxConcurrency: 1,
          timeout: 30000,
          retryAttempts: 3,
          failureThreshold: 1
        },
        failureHandling: {
          strategy: 'stop' as const,
          compensationTasks: [],
          notificationChannels: []
        }
      };
      
      const result = alex.validateDAG(dagSpec);
      expect(result.result).toBe(true);
    });
    
    it('should detect circular dependencies', async () => {
      await alex.initialize();
      
      const dagSpec = {
        id: 'test-dag',
        name: 'Test DAG',
        version: '1.0.0',
        nodes: [
          {
            id: 'node-1',
            name: 'Test Node 1',
            type: 'task' as const,
            dependencies: ['node-2'],
            metadata: {}
          },
          {
            id: 'node-2',
            name: 'Test Node 2',
            type: 'task' as const,
            dependencies: ['node-1'],
            metadata: {}
          }
        ],
        edges: [
          {
            id: 'edge-1',
            source: 'node-1',
            target: 'node-2',
            type: 'success' as const,
            metadata: {}
          },
          {
            id: 'edge-2',
            source: 'node-2',
            target: 'node-1',
            type: 'success' as const,
            metadata: {}
          }
        ],
        metadata: {},
        executionPolicy: {
          maxConcurrency: 1,
          timeout: 30000,
          retryAttempts: 3,
          failureThreshold: 1
        },
        failureHandling: {
          strategy: 'stop' as const,
          compensationTasks: [],
          notificationChannels: []
        }
      };
      
      const result = alex.validateDAG(dagSpec);
      expect(result.result).toBe(false);
      expect(result.reason).toContain('circular');
    });
  });
  
  describe('Workflow Execution', () => {
    it('should start workflows', async () => {
      await alex.initialize();
      
      const dagSpec = {
        id: 'test-workflow',
        name: 'Test Workflow',
        version: '1.0.0',
        nodes: [
          {
            id: 'node-1',
            name: 'Test Node',
            type: 'task' as const,
            taskType: 'data-processing',
            dependencies: [],
            metadata: { input: 'test-data' }
          }
        ],
        edges: [],
        metadata: {},
        executionPolicy: {
          maxConcurrency: 1,
          timeout: 30000,
          retryAttempts: 3,
          failureThreshold: 1
        },
        failureHandling: {
          strategy: 'stop' as const,
          compensationTasks: [],
          notificationChannels: []
        }
      };
      
      const dag = await alex.createDAG(dagSpec);
      const result = await alex.startWorkflow(dag.id);
      
      expect(result.success).toBe(true);
      expect(result.workflowId).toBe(dag.id);
    });
    
    it('should pause and resume workflows', async () => {
      await alex.initialize();
      
      const dagSpec = {
        id: 'test-workflow',
        name: 'Test Workflow',
        version: '1.0.0',
        nodes: [
          {
            id: 'node-1',
            name: 'Test Node',
            type: 'task' as const,
            taskType: 'data-processing',
            dependencies: [],
            metadata: { input: 'test-data' }
          }
        ],
        edges: [],
        metadata: {},
        executionPolicy: {
          maxConcurrency: 1,
          timeout: 30000,
          retryAttempts: 3,
          failureThreshold: 1
        },
        failureHandling: {
          strategy: 'stop' as const,
          compensationTasks: [],
          notificationChannels: []
        }
      };
      
      const dag = await alex.createDAG(dagSpec);
      await alex.startWorkflow(dag.id);
      
      const pauseResult = await alex.pauseWorkflow(dag.id);
      expect(pauseResult).toBe(true);
      
      const resumeResult = await alex.resumeWorkflow(dag.id);
      expect(resumeResult).toBe(true);
    });
    
    it('should cancel workflows', async () => {
      await alex.initialize();
      
      const dagSpec = {
        id: 'test-workflow',
        name: 'Test Workflow',
        version: '1.0.0',
        nodes: [
          {
            id: 'node-1',
            name: 'Test Node',
            type: 'task' as const,
            taskType: 'data-processing',
            dependencies: [],
            metadata: { input: 'test-data' }
          }
        ],
        edges: [],
        metadata: {},
        executionPolicy: {
          maxConcurrency: 1,
          timeout: 30000,
          retryAttempts: 3,
          failureThreshold: 1
        },
        failureHandling: {
          strategy: 'stop' as const,
          compensationTasks: [],
          notificationChannels: []
        }
      };
      
      const dag = await alex.createDAG(dagSpec);
      await alex.startWorkflow(dag.id);
      
      const cancelResult = await alex.cancelWorkflow(dag.id);
      expect(cancelResult).toBe(true);
    });
  });
  
  describe('Dependency Resolution', () => {
    it('should resolve dependencies correctly', async () => {
      await alex.initialize();
      
      const dependencies = ['dep-1', 'dep-2'];
      const result = await alex.resolveDependencies(dependencies);
      
      expect(result.success).toBe(true);
      expect(result.resolvedDependencies).toBeDefined();
      expect(result.executionOrder).toBeDefined();
    });
    
    it('should detect circular dependencies', async () => {
      await alex.initialize();
      
      const dependencies = ['dep-1', 'dep-2', 'dep-1']; // Circular
      const result = await alex.resolveDependencies(dependencies);
      
      expect(result.success).toBe(false);
      expect(result.circularDependencies).toBeDefined();
    });
  });
  
  describe('Task Management', () => {
    it('should schedule tasks', async () => {
      await alex.initialize();
      
      const task = {
        id: 'test-task',
        name: 'Test Task',
        type: 'data-processing',
        parameters: { input: 'test-data' },
        dependencies: [],
        timeout: 30000,
        metadata: {}
      };
      
      const taskId = await alex.scheduleTask(task);
      expect(taskId).toBeDefined();
    });
    
    it('should execute scheduled tasks', async () => {
      await alex.initialize();
      
      const task = {
        id: 'test-task',
        name: 'Test Task',
        type: 'data-processing',
        parameters: { input: 'test-data' },
        dependencies: [],
        timeout: 30000,
        metadata: {}
      };
      
      await alex.scheduleTask(task);
      const results = await alex.executeScheduledTasks();
      
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });
    
    it('should handle task failures', async () => {
      await alex.initialize();
      
      const error = new Error('Test error');
      const result = await alex.handleTaskFailure('test-task', error);
      
      expect(result.success).toBeDefined();
      expect(result.taskId).toBe('test-task');
      expect(result.error).toBe(error);
    });
  });
  
  describe('Monitoring and Observability', () => {
    it('should get workflow status', async () => {
      await alex.initialize();
      
      const status = await alex.getWorkflowStatus('test-workflow');
      expect(status).toBeDefined();
      expect(status.workflowId).toBe('test-workflow');
    });
    
    it('should get task status', async () => {
      await alex.initialize();
      
      const status = await alex.getTaskStatus('test-task');
      expect(status).toBeDefined();
      expect(status.taskId).toBe('test-task');
    });
    
    it('should get system metrics', async () => {
      await alex.initialize();
      
      const metrics = await alex.getSystemMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.activeWorkflows).toBeDefined();
      expect(metrics.completedWorkflows).toBeDefined();
    });
  });
  
  describe('Event Handling', () => {
    it('should handle workflow start events', async () => {
      await alex.initialize();
      
      const payload: ValidationEventPayload = {
        timestamp: new Date(),
        correlationId: 'test-correlation',
        sourceAgent: 'test-agent',
        ruleId: 'workflow-start',
        input: {
          workflowId: 'test-workflow'
        },
        result: { result: true, consensus: true },
        context: 'workflow-start'
      };
      
      await expect(alex.handleEvent('workflow.start', payload)).resolves.not.toThrow();
    });
    
    it('should handle task execution events', async () => {
      await alex.initialize();
      
      const payload: ValidationEventPayload = {
        timestamp: new Date(),
        correlationId: 'test-correlation',
        sourceAgent: 'test-agent',
        ruleId: 'task-execution',
        input: {
          taskId: 'test-task'
        },
        result: { result: true, consensus: true },
        context: 'task-execution'
      };
      
      await expect(alex.handleEvent('task.execute', payload)).resolves.not.toThrow();
    });
    
    it('should handle unknown events gracefully', async () => {
      await alex.initialize();
      
      const payload: ValidationEventPayload = {
        timestamp: new Date(),
        correlationId: 'test-correlation',
        sourceAgent: 'test-agent',
        ruleId: 'unknown-event',
        input: {},
        result: { result: true, consensus: true },
        context: 'unknown-event'
      };
      
      await expect(alex.handleEvent('unknown.event', payload)).resolves.not.toThrow();
    });
  });
  
  describe('Lifecycle Management', () => {
    it('should initialize correctly', async () => {
      await alex.initialize();
      const status = alex.getStatus();
      expect(status.status).toBe('ready');
    });
    
    it('should shutdown gracefully', async () => {
      await alex.initialize();
      await alex.shutdown();
      const status = alex.getStatus();
      expect(status.status).toBe('ready');
    });
    
    it('should maintain uptime tracking', async () => {
      await alex.initialize();
      // Add a small delay to ensure uptime is calculated
      await new Promise(resolve => setTimeout(resolve, 10));
      const status = alex.getStatus();
      expect(status.uptime).toBeGreaterThan(0);
    });
  });
  
  describe('Specification and Design', () => {
    it('should validate specifications', async () => {
      await alex.initialize();
      
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
      
      const result = alex.validateSpecification(spec);
      expect(result.result).toBe(true);
    });
    
    it('should generate design artifacts', async () => {
      await alex.initialize();
      
      const artifacts = alex.generateDesignArtifacts();
      expect(artifacts).toBeDefined();
      expect(artifacts.length).toBeGreaterThan(0);
      expect(artifacts[0].id).toBe('alex-dag-orchestrator');
    });
    
    it('should track user interactions', async () => {
      await alex.initialize();
      
      const interaction = {
        id: 'test-interaction',
        userId: 'test-user',
        sessionId: 'test-session',
        action: 'test-action',
        context: { test: 'data' },
        timestamp: new Date(),
        outcome: 'success' as const
      };
      
      expect(() => alex.trackUserInteraction(interaction)).not.toThrow();
    });
  });
  
  describe('Error Handling', () => {
    it('should handle invalid DAG creation gracefully', async () => {
      await alex.initialize();
      
      const invalidDagSpec = {
        id: '',
        name: '',
        version: '',
        nodes: [],
        edges: [],
        metadata: {},
        executionPolicy: {
          maxConcurrency: 1,
          timeout: 30000,
          retryAttempts: 3,
          failureThreshold: 1
        },
        failureHandling: {
          strategy: 'stop' as const,
          compensationTasks: [],
          notificationChannels: []
        }
      };
      
      const result = await alex.createDAG(invalidDagSpec);
      expect(result).toBeDefined();
    });
    
    it('should handle workflow execution errors', async () => {
      await alex.initialize();
      
      const result = await alex.startWorkflow('non-existent-workflow');
      expect(result.success).toBe(false);
    });
  });
}); 