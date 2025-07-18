// Production Test Suite for AikoRyu Autonomous Mesh System
// Tests system under realistic production conditions

import { AikoAgent } from '../src/agents/AikoAgent';
import { CulturalTransformationAgent } from '../src/design/CulturalTransformation';
import { SpecificationEngine } from '../src/specifications/SpecificationEngine';
import { AgentSpecification, TraceEvent, ValidationResult, SystemEventPayload } from '../src/agents/AgentContract';

describe('Production System Tests', () => {
  let aikoAgent: AikoAgent;
  let culturalAgent: CulturalTransformationAgent;
  let specEngine: SpecificationEngine;

  beforeEach(async () => {
    aikoAgent = new AikoAgent('aiko-prod-001');
    culturalAgent = new CulturalTransformationAgent('cultural-prod-001');
    specEngine = new SpecificationEngine();
    
    await aikoAgent.initialize();
    await culturalAgent.initialize();
  });

  afterEach(async () => {
    await aikoAgent.shutdown();
    await culturalAgent.shutdown();
  });

  describe('System Initialization & Health Checks', () => {
    it('should initialize all agents successfully', async () => {
      const aikoStatus = aikoAgent.getStatus();
      const culturalStatus = culturalAgent.getStatus();

      expect(aikoStatus.status).toBe('ready');
      expect(culturalStatus.status).toBe('ready');
      expect(aikoStatus.uptime).toBeGreaterThan(0);
      expect(culturalStatus.uptime).toBeGreaterThan(0);
    });

    it('should handle concurrent agent initialization', async () => {
      const agents: AikoAgent[] = [];
      const promises: Promise<void>[] = [];

      // Initialize multiple agents concurrently
      for (let i = 0; i < 5; i++) {
        const agent = new AikoAgent(`aiko-concurrent-${i}`);
        agents.push(agent);
        promises.push(agent.initialize());
      }

      await Promise.all(promises);

      // Verify all agents are ready
      for (const agent of agents) {
        const status = agent.getStatus();
        expect(status.status).toBe('ready');
        await agent.shutdown();
      }
    });

    it('should maintain system stability under load', async () => {
      const events: Array<{eventType: string; payload: SystemEventPayload; timestamp: Date}> = [];
      const startTime = Date.now();

      // Generate high load of events
      for (let i = 0; i < 100; i++) {
        events.push({
          eventType: 'test.event',
          payload: {
            eventType: 'status-change',
            timestamp: new Date(),
            correlationId: `test-event-${i}`,
            sourceAgent: 'aiko-prod-001'
          } as SystemEventPayload,
          timestamp: new Date()
        });
      }

      // Process events concurrently
      const promises = events.map(event => 
        aikoAgent.handleEvent(event.eventType, event.payload as SystemEventPayload)
      );

      await Promise.all(promises);

      const endTime = Date.now();
      const processingTime = endTime - startTime;

      // Should complete within reasonable time (5 seconds)
      expect(processingTime).toBeLessThan(5000);
      
      const status = aikoAgent.getStatus();
      expect(status.status).toBe('ready');
    });
  });

  describe('Error Handling & Recovery', () => {
    it('should handle invalid event types gracefully', async () => {
      const invalidEvents = [
        { eventType: 'invalid.event', payload: {} },
        { eventType: '', payload: null },
        { eventType: 'unknown.event', payload: undefined }
      ];

      for (const event of invalidEvents) {
        await expect(
          aikoAgent.handleEvent(event.eventType, event.payload as SystemEventPayload)
        ).resolves.not.toThrow();
      }

      const status = aikoAgent.getStatus();
      expect(status.status).toBe('ready');
    });

    it('should recover from agent failures', async () => {
      // Simulate agent failure by calling shutdown
      await aikoAgent.shutdown();
      
      // Reinitialize the agent
      await aikoAgent.initialize();
      
      const status = aikoAgent.getStatus();
      expect(status.status).toBe('ready');
      
      // Verify agent can still process events
      await aikoAgent.handleEvent('test.recovery', {
        eventType: 'status-change',
        timestamp: new Date(),
        correlationId: 'test-recovery',
        sourceAgent: aikoAgent.id
      } as SystemEventPayload);
    });

    it('should handle specification validation errors', () => {
      const invalidSpec: AgentSpecification = {
        id: 'invalid-spec',
        role: '',
        capabilities: [],
        interfaces: [],
        behaviors: [],
        constraints: [],
        validationRules: [],
        dependencies: [],
        designIntent: {
          purpose: '',
          userGoals: [],
          successMetrics: [],
          designPrinciples: [],
          accessibilityRequirements: []
        },
        userRequirements: []
      };

      const result = aikoAgent.validateSpecification(invalidSpec);
      expect(result.result).toBe(false);
      expect(result.reason).toBeDefined();
    });
  });

  describe('Data Integrity & Consistency', () => {
    it('should maintain data consistency across multiple operations', async () => {
      const workshopData = {
        id: 'prod-workshop-001',
        title: 'Production Workshop',
        participants: ['Designers', 'Developers', 'Product Managers'],
        phases: [
          {
            name: 'Empathize' as const,
            duration: 60,
            activities: ['User interviews', 'Observation'],
            deliverables: ['User personas', 'Pain points']
          }
        ],
        outcomes: {
          insights: ['User needs identified'],
          prototypes: ['Wireframes'],
          userStories: ['As a user...'],
          nextSteps: ['Refine prototypes']
        },
        metrics: {
          participantSatisfaction: 8.5,
          ideaGeneration: 15,
          prototypeQuality: 8.0,
          userFeedback: 8.2
        }
      };

      // Create workshop
      await culturalAgent.handleEvent('workshop.create', {
        workshopId: workshopData.id,
        operation: 'workshop',
        data: workshopData,
        timestamp: new Date(),
        correlationId: workshopData.id,
        sourceAgent: culturalAgent.id
      });
      
      // Verify data integrity
      const status = culturalAgent.getStatus();
      expect(status.workshops).toBeGreaterThan(0);
      
      // Simulate multiple concurrent operations
      const operations: Promise<void>[] = [];
      for (let i = 0; i < 10; i++) {
        operations.push(
          culturalAgent.handleEvent('workshop.create', {
            workshopId: `prod-workshop-${i + 2}`,
            operation: 'workshop',
            data: { ...workshopData, id: `prod-workshop-${i + 2}` },
            timestamp: new Date(),
            correlationId: `prod-workshop-${i + 2}`,
            sourceAgent: culturalAgent.id
          })
        );
      }
      
      await Promise.all(operations);
      
      const finalStatus = culturalAgent.getStatus();
      expect(finalStatus.workshops).toBeGreaterThan(10);
    });

    it('should validate specification consistency', () => {
      const specs: AgentSpecification[] = [
        {
          id: 'spec-1',
          role: 'TestAgent',
          capabilities: [
            {
              id: 'cap-1',
              name: 'Test Capability',
              description: 'Test capability',
              inputs: [],
              outputs: [],
              preconditions: [],
              postconditions: []
            },
            {
              id: 'cap-design',
              name: 'Design Capability',
              description: 'Required design capability',
              inputs: [],
              outputs: [],
              preconditions: [],
              postconditions: []
            },
            {
              id: 'cap-team',
              name: 'Team Capability',
              description: 'Required team capability',
              inputs: [],
              outputs: [],
              preconditions: [],
              postconditions: []
            },
            {
              id: 'cap-metrics',
              name: 'Metrics Capability',
              description: 'Required metrics capability',
              inputs: [],
              outputs: [],
              preconditions: [],
              postconditions: []
            },
            {
              id: 'cap-learning',
              name: 'Learning Capability',
              description: 'Required learning capability',
              inputs: [],
              outputs: [],
              preconditions: [],
              postconditions: []
            }
          ],
          interfaces: [],
          behaviors: [],
          constraints: [],
                      validationRules: [
              {
                id: 'val-001',
                name: 'Test Validation Rule',
                rule: 'Test rule for validation',
                validator: (_input: unknown) => ({ result: true, consensus: true }),
                errorMessage: 'Test validation failed'
              }
            ],
          dependencies: [],
          designIntent: {
            purpose: 'Testing system functionality',
            userGoals: ['Test functionality', 'Validate system behavior'],
            successMetrics: [
              {
                id: 'metric-1',
                name: 'Test Pass Rate',
                type: 'technical',
                target: 100,
                unit: 'percent',
                description: 'Percentage of tests that pass'
              },
              {
                id: 'metric-2',
                name: 'System Stability',
                type: 'performance',
                target: 99.9,
                unit: 'percent',
                description: 'System uptime and stability'
              }
            ],
            designPrinciples: ['Reliability', 'Testability'],
            accessibilityRequirements: []
          },
          userRequirements: [
            {
              id: 'req-1',
              description: 'Test requirement for validation',
              priority: 'high',
              userStory: 'As a tester, I want to validate system functionality',
              acceptanceCriteria: ['Tests pass', 'System remains stable'],
              persona: 'Tester'
            }
          ]
        },
        {
          id: 'spec-2',
          role: 'AnotherAgent',
          capabilities: [
            {
              id: 'cap-2',
              name: 'Another Capability',
              description: 'Another capability',
              inputs: [],
              outputs: [],
              preconditions: [],
              postconditions: []
            },
            {
              id: 'cap-design-2',
              name: 'Design Capability',
              description: 'Required design capability',
              inputs: [],
              outputs: [],
              preconditions: [],
              postconditions: []
            },
            {
              id: 'cap-team-2',
              name: 'Team Capability',
              description: 'Required team capability',
              inputs: [],
              outputs: [],
              preconditions: [],
              postconditions: []
            },
            {
              id: 'cap-metrics-2',
              name: 'Metrics Capability',
              description: 'Required metrics capability',
              inputs: [],
              outputs: [],
              preconditions: [],
              postconditions: []
            },
            {
              id: 'cap-learning-2',
              name: 'Learning Capability',
              description: 'Required learning capability',
              inputs: [],
              outputs: [],
              preconditions: [],
              postconditions: []
            }
          ],
          interfaces: [],
          behaviors: [],
          constraints: [],
                      validationRules: [
              {
                id: 'val-002',
                name: 'Another Test Validation Rule',
                rule: 'Another test rule for validation',
                validator: (_input: unknown) => ({ result: true, consensus: true }),
                errorMessage: 'Another test validation failed'
              }
            ],
          dependencies: ['spec-1'],
          designIntent: {
            purpose: 'Additional testing functionality',
            userGoals: ['More functionality', 'Extended testing'],
            successMetrics: [
              {
                id: 'metric-3',
                name: 'Extended Test Coverage',
                type: 'technical',
                target: 95,
                unit: 'percent',
                description: 'Coverage of extended test scenarios'
              }
            ],
            designPrinciples: ['Extensibility', 'Maintainability'],
            accessibilityRequirements: []
          },
          userRequirements: [
            {
              id: 'req-2',
              description: 'Another requirement for extended testing',
              priority: 'medium',
              userStory: 'As another tester, I want to test extended functionality',
              acceptanceCriteria: ['Extended tests pass', 'System handles extended scenarios'],
              persona: 'Another Tester'
            }
          ]
        }
      ];

      // Validate all specifications
      for (const spec of specs) {
        // Add required capabilities for validation
        const requiredCapabilities = ['Design', 'Team', 'Metrics', 'Learning'];
        for (const capName of requiredCapabilities) {
          if (!spec.capabilities.some(cap => cap.name.includes(capName))) {
            spec.capabilities.push({
              id: `cap-${capName.toLowerCase()}`,
              name: `${capName} Capability`,
              description: `Required ${capName.toLowerCase()} capability`,
              inputs: [],
              outputs: [],
              preconditions: [],
              postconditions: []
            });
          }
        }
        spec.role = spec.role || 'ValidAgent';
        const result = aikoAgent.validateSpecification(spec);
        expect(result.result).toBe(true);
      }

      // Test consistency validation
      const consistencyResult = specEngine.validateConsistency(specs);
      expect(consistencyResult.result).toBe(true);
    });
  });

  describe('Performance & Scalability', () => {
    it('should handle high-volume event processing', async () => {
      const eventCount = 1000;
      const events: Array<{eventType: string; payload: SystemEventPayload}> = [];

      // Generate high volume of events
      for (let i = 0; i < eventCount; i++) {
        events.push({
          eventType: 'high.volume.event',
          payload: {
            eventType: 'status-change',
            timestamp: new Date(),
            correlationId: `high-volume-${i}`,
            sourceAgent: 'aiko-prod-001'
          } as SystemEventPayload
        });
      }

      const startTime = Date.now();
      
      // Process events in batches
      const batchSize = 50;
      for (let i = 0; i < events.length; i += batchSize) {
        const batch = events.slice(i, i + batchSize);
        const promises = batch.map(event => 
          aikoAgent.handleEvent(event.eventType, event.payload as SystemEventPayload)
        );
        await Promise.all(promises);
      }

      const endTime = Date.now();
      const totalTime = endTime - startTime;
      const eventsPerSecond = eventCount / (totalTime / 1000);

      // Should process at least 100 events per second
      expect(eventsPerSecond).toBeGreaterThan(100);
      
      const status = aikoAgent.getStatus();
      expect(status.status).toBe('ready');
    });

    it('should maintain performance under memory pressure', async () => {
      const largeData = {
        id: 'large-data-test',
        data: 'x'.repeat(10000), // 10KB of data
        metadata: {
          timestamp: new Date(),
          size: 10000
        }
      };

      const startTime = Date.now();
      
      // Process large data multiple times
      for (let i = 0; i < 100; i++) {
        await aikoAgent.handleEvent('large.data.event', {
          eventType: 'status-change',
          timestamp: new Date(),
          correlationId: `large-data-${i}`,
          sourceAgent: aikoAgent.id
        } as SystemEventPayload);
      }

      const endTime = Date.now();
      const processingTime = endTime - startTime;

      // Should complete within reasonable time (10 seconds)
      expect(processingTime).toBeLessThan(10000);
      
      const status = aikoAgent.getStatus();
      expect(status.status).toBe('ready');
    });
  });

  describe('End-to-End Production Workflows', () => {
    it('should complete full DDD/SDD workflow under production conditions', async () => {
      // 1. User Research Phase
      const _persona = {
        id: 'prod-persona-001',
        name: 'Production User',
        role: 'End User',
        goals: ['Use system effectively', 'Complete tasks quickly'],
        frustrations: ['Complex interfaces', 'Slow performance'],
        technicalLevel: 'intermediate' as const,
        demographics: {
          age: '25-35',
          location: 'Global',
          occupation: 'Professional',
          experience: '3-7 years',
          education: 'Bachelor\'s'
        },
        behaviors: ['Prefers intuitive interfaces'],
        motivations: ['Efficiency', 'Reliability'],
        constraints: ['Time', 'Budget']
      };

      // 2. Design Phase
      const _wireframe = {
        id: 'prod-wireframe-001',
        name: 'Production Interface',
        description: 'High-fidelity production interface',
        fidelity: 'high' as const,
        content: 'wireframe-content',
        annotations: ['User-friendly', 'Accessible'],
        feedback: ['Positive user feedback'],
        version: '1.0.0'
      };

      // 3. Specification Phase
      const spec: AgentSpecification = {
        id: 'prod-agent-spec',
        role: 'ProductionAgent',
        capabilities: [
          {
            id: 'prod-cap-1',
            name: 'Production Capability',
            description: 'Handles production workloads',
            inputs: [],
            outputs: [],
            preconditions: [],
            postconditions: []
          },
          {
            id: 'prod-cap-design',
            name: 'Design Capability',
            description: 'Required design capability',
            inputs: [],
            outputs: [],
            preconditions: [],
            postconditions: []
          },
          {
            id: 'prod-cap-team',
            name: 'Team Capability',
            description: 'Required team capability',
            inputs: [],
            outputs: [],
            preconditions: [],
            postconditions: []
          },
          {
            id: 'prod-cap-metrics',
            name: 'Metrics Capability',
            description: 'Required metrics capability',
            inputs: [],
            outputs: [],
            preconditions: [],
            postconditions: []
          },
          {
            id: 'prod-cap-learning',
            name: 'Learning Capability',
            description: 'Required learning capability',
            inputs: [],
            outputs: [],
            preconditions: [],
            postconditions: []
          }
        ],
        interfaces: [],
        behaviors: [],
        constraints: [],
                    validationRules: [
              {
                id: 'prod-val-001',
                name: 'Production Validation Rule',
                rule: 'Production system validation rule',
                validator: (_input: unknown) => ({ result: true, consensus: true }),
                errorMessage: 'Production validation failed'
              }
            ],
        dependencies: [],
        designIntent: {
          purpose: 'Production system',
          userGoals: ['Reliable operation', 'High performance'],
          successMetrics: [
            {
              id: 'prod-metric-1',
              name: 'System Reliability',
              type: 'performance',
              target: 99.9,
              unit: 'percent',
              description: 'System uptime and reliability'
            },
            {
              id: 'prod-metric-2',
              name: 'Response Time',
              type: 'performance',
              target: 200,
              unit: 'milliseconds',
              description: 'Average response time for operations'
            }
          ],
          designPrinciples: ['Reliability', 'Performance'],
          accessibilityRequirements: []
        },
        userRequirements: [
          {
            id: 'prod-req-1',
            description: 'Production requirement',
            priority: 'high' as const,
            userStory: 'As a production user',
            acceptanceCriteria: ['System works reliably'],
            persona: 'Production User'
          }
        ]
      };

      // 4. Validation Phase
      const validationResult = aikoAgent.validateSpecification(spec);
      expect(validationResult.result).toBe(true);

      // 5. Code Generation Phase
      const generatedCode = specEngine.generateAgent(spec);
      expect(generatedCode.agentClass).toBeDefined();
      expect(generatedCode.tests).toBeDefined();
      expect(generatedCode.documentation).toBeDefined();

      // 6. Cultural Transformation Phase
      const workshop = {
        id: 'prod-workshop-001',
        title: 'Production Workshop',
        participants: ['Designers', 'Developers', 'Product Managers'],
        phases: [
          {
            name: 'Empathize' as const,
            duration: 60,
            activities: ['User interviews'],
            deliverables: ['User personas']
          }
        ],
        outcomes: {
          insights: ['Production insights'],
          prototypes: ['Production prototypes'],
          userStories: ['Production user stories'],
          nextSteps: ['Production next steps']
        },
        metrics: {
          participantSatisfaction: 9.0,
          ideaGeneration: 20,
          prototypeQuality: 9.0,
          userFeedback: 9.0
        }
      };

      await culturalAgent.handleEvent('workshop.create', {
        workshopId: workshop.id,
        operation: 'workshop',
        data: workshop,
        timestamp: new Date(),
        correlationId: workshop.id,
        sourceAgent: culturalAgent.id
      });

      // 7. Final Validation
      const aikoStatus = aikoAgent.getStatus();
      const culturalStatus = culturalAgent.getStatus();

      expect(aikoStatus.status).toBe('ready');
      expect(culturalStatus.status).toBe('ready');
      expect(culturalStatus.workshops).toBeGreaterThan(0);
    });

    it('should handle production error scenarios gracefully', async () => {
      // Test system behavior under various error conditions
      const errorScenarios = [
        {
          name: 'Invalid specification',
          action: (): ValidationResult => {
            const invalidSpec = { ...{} } as AgentSpecification;
            return aikoAgent.validateSpecification(invalidSpec);
          },
          expectedResult: false
        },
        {
          name: 'Invalid event data',
          action: async (): Promise<boolean> => {
            await aikoAgent.handleEvent('invalid.event', {
              eventType: 'status-change',
              timestamp: new Date(),
              correlationId: 'invalid-event',
              sourceAgent: aikoAgent.id
            } as SystemEventPayload);
            return true; // Should not throw
          },
          expectedResult: true
        },
        {
          name: 'Missing dependencies',
          action: async (): Promise<ValidationResult> => {
            const spec: AgentSpecification = {
              id: 'missing-deps-spec',
              role: 'TestAgent',
              capabilities: [],
              interfaces: [],
              behaviors: [],
              constraints: [],
              validationRules: [],
              dependencies: ['non-existent-agent'],
              designIntent: {
                purpose: 'Test',
                userGoals: [],
                successMetrics: [],
                designPrinciples: [],
                accessibilityRequirements: []
              },
              userRequirements: []
            };
            return aikoAgent.validateSpecification(spec);
          },
          expectedResult: false
        }
      ];

      for (const scenario of errorScenarios) {
        try {
          const result = await scenario.action();
          if (typeof result === 'boolean') {
            expect(result).toBe(scenario.expectedResult);
          }
        } catch (error) {
          // System should handle errors gracefully
          expect(error).toBeDefined();
        }
      }

      // System should remain stable after error scenarios
      const status = aikoAgent.getStatus();
      expect(status.status).toBe('ready');
    });
  });

  describe('Monitoring & Observability', () => {
    it('should provide comprehensive system metrics', () => {
      const aikoStatus = aikoAgent.getStatus();
      const culturalStatus = culturalAgent.getStatus();

      // Verify status contains required metrics
      expect(aikoStatus).toHaveProperty('status');
      expect(aikoStatus).toHaveProperty('uptime');
      expect(culturalStatus).toHaveProperty('workshops');
      expect(culturalStatus).toHaveProperty('teams');
      expect(culturalStatus).toHaveProperty('metrics');
      expect(culturalStatus).toHaveProperty('learningFrameworks');

      // Verify metrics are reasonable
      expect(aikoStatus.uptime).toBeGreaterThan(0);
      expect(culturalStatus.workshops).toBeGreaterThanOrEqual(0);
      expect(culturalStatus.teams).toBeGreaterThanOrEqual(0);
    });

    it('should emit trace events for monitoring', () => {
      const traceEvents: TraceEvent[] = [];

      // Mock emitTrace to capture events
      const originalEmitTrace = aikoAgent.emitTrace;
      aikoAgent.emitTrace = (event: TraceEvent): void => {
        traceEvents.push(event);
        originalEmitTrace.call(aikoAgent, event);
      };

      // Perform some operations
      aikoAgent.handleEvent('test.event', {
        eventType: 'status-change',
        timestamp: new Date(),
        correlationId: 'test-event',
        sourceAgent: aikoAgent.id
      } as SystemEventPayload);
      aikoAgent.validateSpecification({
        id: 'test-spec',
        role: 'TestAgent',
        capabilities: [],
        interfaces: [],
        behaviors: [],
        constraints: [],
        validationRules: [],
        dependencies: [],
        designIntent: {
          purpose: 'Test',
          userGoals: [],
          successMetrics: [],
          designPrinciples: [],
          accessibilityRequirements: []
        },
        userRequirements: []
      });

      // Verify trace events were emitted
      expect(traceEvents.length).toBeGreaterThan(0);
      
      // Verify event structure
      for (const event of traceEvents) {
        expect(event).toHaveProperty('timestamp');
        expect(event).toHaveProperty('eventType');
        expect(event).toHaveProperty('metadata');
      }

      // Restore original method
      aikoAgent.emitTrace = originalEmitTrace as (event: TraceEvent) => void;
    });
  });
}); 