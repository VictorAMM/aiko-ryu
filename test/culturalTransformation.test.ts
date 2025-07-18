import { AgentSpecification, UserInteraction } from '../src/agents/AgentContract';
import { CulturalTransformationAgent, DesignThinkingWorkshop, CrossFunctionalTeam, InnovationMetrics, LearningPath } from '../src/design/CulturalTransformation';

describe('CulturalTransformationAgent', () => {
  let agent: CulturalTransformationAgent;

  beforeEach(() => {
    agent = new CulturalTransformationAgent('cultural-transformation-001');
  });

  describe('Initialization', () => {
    it('should initialize with correct properties', () => {
      expect(agent.id).toBe('cultural-transformation-001');
      expect(agent.role).toBe('CulturalTransformation');
      expect(agent.dependencies).toEqual(['AikoAgent', 'RyuAgent']);
    });

    it('should initialize cultural transformation components', async () => {
      await agent.initialize();
      const status = agent.getStatus();
      expect(status.workshops).toBeGreaterThan(0);
      expect(status.teams).toBeGreaterThan(0);
      expect(status.metrics).toBeGreaterThan(0);
      expect(status.learningFrameworks).toBeGreaterThan(0);
    });
  });

  describe('Design Thinking Workshops', () => {
    it('should create design thinking workshops', async () => {
      await agent.initialize();
      
      const workshop: DesignThinkingWorkshop = {
        id: 'workshop-test',
        title: 'Test Design Workshop',
        participants: ['Designers', 'Developers'],
        phases: [
          {
            name: 'Empathize',
            duration: 30,
            activities: ['User interviews'],
            deliverables: ['User personas']
          }
        ],
        outcomes: {
          insights: ['User needs identified'],
          prototypes: ['Wireframes'],
          userStories: ['As a user...'],
          nextSteps: ['Refine prototypes']
        },
        metrics: {
          participantSatisfaction: 8.0,
          ideaGeneration: 10,
          prototypeQuality: 7.0,
          userFeedback: 7.5
        }
      };

      await agent.handleEvent('workshop.create', {
        workshopId: workshop.id,
        operation: 'workshop',
        data: workshop,
        timestamp: new Date(),
        correlationId: workshop.id,
        sourceAgent: agent.id
      });
      const status = agent.getStatus();
      expect(status.workshops).toBeGreaterThan(1); // Should have default + new workshop
    });

    it('should validate workshop structure', () => {
      const workshop: DesignThinkingWorkshop = {
        id: 'workshop-valid',
        title: 'Valid Workshop',
        participants: ['Designers'],
        phases: [
          {
            name: 'Empathize',
            duration: 60,
            activities: ['User interviews'],
            deliverables: ['User personas']
          }
        ],
        outcomes: {
          insights: ['User needs'],
          prototypes: ['Wireframes'],
          userStories: ['As a user...'],
          nextSteps: ['Refine']
        },
        metrics: {
          participantSatisfaction: 8.0,
          ideaGeneration: 10,
          prototypeQuality: 7.0,
          userFeedback: 7.5
        }
      };

      expect(workshop.phases.length).toBeGreaterThan(0);
      expect(workshop.participants.length).toBeGreaterThan(0);
      expect(workshop.outcomes.insights.length).toBeGreaterThan(0);
    });
  });

  describe('Cross-Functional Teams', () => {
    it('should form cross-functional teams', async () => {
      await agent.initialize();
      
      const team: CrossFunctionalTeam = {
        id: 'team-test',
        name: 'Test Innovation Team',
        members: [
          {
            id: 'member-001',
            name: 'John Doe',
            role: 'Product Designer',
            expertise: ['UX Design', 'User Research'],
            availability: 40
          }
        ],
        roles: [
          {
            name: 'Design Lead',
            responsibilities: ['Design direction'],
            requiredSkills: ['UX Design'],
            reportingStructure: 'Reports to Product Manager'
          }
        ],
        communicationChannels: ['Slack', 'Zoom'],
        collaborationTools: ['Figma', 'GitHub']
      };

      await agent.handleEvent('team.form', {
        teamId: team.id,
        operation: 'team',
        data: team,
        timestamp: new Date(),
        correlationId: team.id,
        sourceAgent: agent.id
      });
      const status = agent.getStatus();
      expect(status.teams).toBeGreaterThan(1); // Should have default + new team
    });

    it('should validate team structure', () => {
      const team: CrossFunctionalTeam = {
        id: 'team-valid',
        name: 'Valid Team',
        members: [
          {
            id: 'member-001',
            name: 'Jane Smith',
            role: 'Developer',
            expertise: ['JavaScript', 'React'],
            availability: 40
          }
        ],
        roles: [
          {
            name: 'Tech Lead',
            responsibilities: ['Technical decisions'],
            requiredSkills: ['Programming'],
            reportingStructure: 'Reports to Engineering Manager'
          }
        ],
        communicationChannels: ['Slack'],
        collaborationTools: ['GitHub']
      };

      expect(team.members.length).toBeGreaterThan(0);
      expect(team.roles.length).toBeGreaterThan(0);
      expect(team.communicationChannels.length).toBeGreaterThan(0);
      expect(team.collaborationTools.length).toBeGreaterThan(0);
    });
  });

  describe('Innovation Metrics', () => {
    it('should track innovation metrics', async () => {
      await agent.initialize();
      
      const metric: InnovationMetrics = {
        id: 'metric-test',
        category: 'Design',
        metric: 'Design Workshop Participation',
        currentValue: 85,
        targetValue: 90,
        unit: 'percentage',
        frequency: 'monthly'
      };

      await agent.handleEvent('metrics.track', {
        metricId: metric.id,
        operation: 'metric',
        data: metric,
        timestamp: new Date(),
        correlationId: metric.id,
        sourceAgent: agent.id
      });
      const status = agent.getStatus();
      expect(status.metrics).toBeGreaterThan(4); // Should have default + new metric
    });

    it('should validate metric structure', () => {
      const metric: InnovationMetrics = {
        id: 'metric-valid',
        category: 'Technology',
        metric: 'Innovation Velocity',
        currentValue: 12,
        targetValue: 15,
        unit: 'features per sprint',
        frequency: 'sprint'
      };

      expect(metric.currentValue).toBeLessThanOrEqual(metric.targetValue);
      expect(metric.category).toMatch(/^(Design|Technology|Process|Culture)$/);
      expect(metric.frequency).toMatch(/^(daily|weekly|monthly|quarterly|sprint)$/);
    });
  });

  describe('Continuous Learning Framework', () => {
    it('should create learning paths', async () => {
      await agent.initialize();
      
      const learningPath: LearningPath = {
        id: 'path-test',
        title: 'Test Learning Path',
        description: 'Test description',
        modules: [
          {
            id: 'module-test',
            title: 'Test Module',
            content: 'Test content',
            exercises: ['Exercise 1'],
            assessment: {
              id: 'assessment-test',
              title: 'Test Assessment',
              questions: [
                {
                  id: 'q1',
                  question: 'Test question?',
                  type: 'multiple-choice',
                  options: ['Option A', 'Option B'],
                  correctAnswer: 'Option A'
                }
              ],
              passingScore: 80,
              timeLimit: 30
            }
          }
        ],
        duration: 4,
        difficulty: 'beginner'
      };

      await agent.handleEvent('learning.path.create', {
        learningPathId: learningPath.id,
        operation: 'learning',
        data: learningPath,
        timestamp: new Date(),
        correlationId: learningPath.id,
        sourceAgent: agent.id
      });
      const status = agent.getStatus();
      expect(status.learningFrameworks).toBeGreaterThan(0);
    });

    it('should validate learning path structure', () => {
      const learningPath: LearningPath = {
        id: 'path-valid',
        title: 'Valid Learning Path',
        description: 'Valid description',
        modules: [
          {
            id: 'module-valid',
            title: 'Valid Module',
            content: 'Valid content',
            exercises: ['Valid exercise'],
            assessment: {
              id: 'assessment-valid',
              title: 'Valid Assessment',
              questions: [
                {
                  id: 'q1',
                  question: 'Valid question?',
                  type: 'multiple-choice',
                  options: ['Option A'],
                  correctAnswer: 'Option A'
                }
              ],
              passingScore: 80,
              timeLimit: 30
            }
          }
        ],
        duration: 8,
        difficulty: 'beginner'
      };

      expect(learningPath.modules.length).toBeGreaterThan(0);
      expect(learningPath.duration).toBeGreaterThan(0);
      expect(learningPath.difficulty).toMatch(/^(beginner|intermediate|advanced)$/);
    });
  });

  describe('DDD/SDD Implementation', () => {
    it('should validate specifications', () => {
      const spec: AgentSpecification = {
        id: 'cultural-transformation-spec',
        role: 'CulturalTransformation',
        capabilities: [
          { 
            id: 'cap-1',
            name: 'Design Thinking Workshops', 
            description: 'Facilitate design thinking sessions',
            inputs: [],
            outputs: [],
            preconditions: [],
            postconditions: []
          },
          { 
            id: 'cap-2',
            name: 'Cross-Functional Team Formation', 
            description: 'Form and manage cross-functional teams',
            inputs: [],
            outputs: [],
            preconditions: [],
            postconditions: []
          },
          { 
            id: 'cap-3',
            name: 'Innovation Metrics Tracking', 
            description: 'Track innovation metrics',
            inputs: [],
            outputs: [],
            preconditions: [],
            postconditions: []
          },
          { 
            id: 'cap-4',
            name: 'Continuous Learning Framework', 
            description: 'Manage learning paths and resources',
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
        dependencies: ['AikoAgent', 'RyuAgent'],
        designIntent: {
          purpose: 'Implement organizational culture modeling',
          userGoals: ['Foster innovation culture', 'Enable cross-functional collaboration'],
          successMetrics: [],
          designPrinciples: ['User-centered design', 'Continuous improvement', 'Collaborative innovation'],
          accessibilityRequirements: []
        },
        userRequirements: [
          { id: 'req-1', description: 'Design thinking workshop facilitation', priority: 'high', userStory: 'As a facilitator', acceptanceCriteria: [], persona: 'Workshop Facilitator' },
          { id: 'req-2', description: 'Cross-functional team management', priority: 'high', userStory: 'As a team lead', acceptanceCriteria: [], persona: 'Team Leader' },
          { id: 'req-3', description: 'Innovation metrics tracking', priority: 'medium', userStory: 'As a manager', acceptanceCriteria: [], persona: 'Manager' },
          { id: 'req-4', description: 'Learning framework management', priority: 'medium', userStory: 'As a learner', acceptanceCriteria: [], persona: 'Learner' }
        ]
      };

      const result = agent.validateSpecification(spec);
      expect(result.result).toBe(true);
      expect(result.consensus).toBe(true);
    });

    it('should generate design artifacts', () => {
      const artifacts = agent.generateDesignArtifacts();
      expect(artifacts.length).toBe(4);
      
      const artifactTypes = artifacts.map(a => a.type);
      expect(artifactTypes).toContain('specification');
      expect(artifactTypes).toContain('prototype');
      
      // Should have 3 specifications and 1 prototype
      const specifications = artifacts.filter(a => a.type === 'specification');
      const prototypes = artifacts.filter(a => a.type === 'prototype');
      expect(specifications.length).toBe(3);
      expect(prototypes.length).toBe(1);
    });

    it('should track user interactions', () => {
      const interaction: UserInteraction = {
        id: 'interaction-001',
        userId: 'user-001',
        sessionId: 'session-001',
        action: 'workshop_participation',
        context: {
          workshopId: 'workshop-001',
          satisfaction: 8.5,
          feedback: 'Great workshop!'
        },
        timestamp: new Date(),
        outcome: 'success'
      };

      agent.trackUserInteraction(interaction);
      // Should not throw error and should emit trace
    });
  });

  describe('Event Handling', () => {
    it('should handle workshop creation events', async () => {
      await agent.initialize();
      
      const workshop: DesignThinkingWorkshop = {
        id: 'event-workshop',
        title: 'Event Workshop',
        participants: ['Designers'],
        phases: [
          {
            name: 'Empathize',
            duration: 30,
            activities: ['User interviews'],
            deliverables: ['User personas']
          }
        ],
        outcomes: {
          insights: ['User needs'],
          prototypes: ['Wireframes'],
          userStories: ['As a user...'],
          nextSteps: ['Refine']
        },
        metrics: {
          participantSatisfaction: 8.0,
          ideaGeneration: 10,
          prototypeQuality: 7.0,
          userFeedback: 7.5
        }
      };

      await agent.handleEvent('workshop.create', {
        workshopId: workshop.id,
        operation: 'workshop',
        data: workshop,
        timestamp: new Date(),
        correlationId: workshop.id,
        sourceAgent: agent.id
      });
      // Should not throw error
    });

    it('should handle team formation events', async () => {
      await agent.initialize();
      
      const team: CrossFunctionalTeam = {
        id: 'event-team',
        name: 'Event Team',
        members: [
          {
            id: 'member-001',
            name: 'Event Member',
            role: 'Developer',
            expertise: ['JavaScript'],
            availability: 40
          }
        ],
        roles: [
          {
            name: 'Developer',
            responsibilities: ['Coding'],
            requiredSkills: ['Programming'],
            reportingStructure: 'Reports to Manager'
          }
        ],
        communicationChannels: ['Slack'],
        collaborationTools: ['GitHub']
      };

      await agent.handleEvent('team.form', {
        teamId: team.id,
        operation: 'team',
        data: team,
        timestamp: new Date(),
        correlationId: team.id,
        sourceAgent: agent.id
      });
      // Should not throw error
    });

    it('should handle metrics tracking events', async () => {
      await agent.initialize();
      
      const metric: InnovationMetrics = {
        id: 'event-metric',
        category: 'Design',
        metric: 'Event Metric',
        currentValue: 80,
        targetValue: 90,
        unit: 'percentage',
        frequency: 'monthly'
      };

      await agent.handleEvent('metrics.track', {
        metricId: metric.id,
        operation: 'metric',
        data: metric,
        timestamp: new Date(),
        correlationId: metric.id,
        sourceAgent: agent.id
      });
      // Should not throw error
    });

    it('should handle learning path creation events', async () => {
      await agent.initialize();
      
      const learningPath: LearningPath = {
        id: 'event-path',
        title: 'Event Learning Path',
        description: 'Event description',
        modules: [
          {
            id: 'event-module',
            title: 'Event Module',
            content: 'Event content',
            exercises: ['Event exercise'],
            assessment: {
              id: 'event-assessment',
              title: 'Event Assessment',
              questions: [
                {
                  id: 'q1',
                  question: 'Event question?',
                  type: 'multiple-choice',
                  options: ['Option A'],
                  correctAnswer: 'Option A'
                }
              ],
              passingScore: 80,
              timeLimit: 30
            }
          }
        ],
        duration: 4,
        difficulty: 'beginner'
      };

      await agent.handleEvent('learning.path.create', {
        learningPathId: learningPath.id,
        operation: 'learning',
        data: learningPath,
        timestamp: new Date(),
        correlationId: learningPath.id,
        sourceAgent: agent.id
      });
      // Should not throw error
    });

    it('should handle unknown events gracefully', async () => {
      await agent.initialize();
      
      await agent.handleEvent('unknown.event', {
        operation: 'workshop',
        timestamp: new Date(),
        correlationId: 'unknown-event',
        sourceAgent: agent.id
      });
      // Should not throw error and should log unknown event
    });
  });

  describe('Status and Lifecycle', () => {
    it('should return correct status', async () => {
      await agent.initialize();
      
      const status = agent.getStatus();
      expect(status.status).toBe('ready');
      expect(status.uptime).toBeGreaterThan(0);
      expect(status.workshops).toBeGreaterThan(0);
      expect(status.teams).toBeGreaterThan(0);
      expect(status.metrics).toBeGreaterThan(0);
      expect(status.learningFrameworks).toBeGreaterThan(0);
    });

    it('should shutdown gracefully', async () => {
      await agent.initialize();
      
      await agent.shutdown();
      // Should not throw error
    });

    it('should emit traces', () => {
      const event = {
        timestamp: new Date(),
        eventType: 'test.event',
        payload: {
          operation: 'workshop' as const,
          timestamp: new Date(),
          correlationId: 'test-event',
          sourceAgent: agent.id
        },
        metadata: { sourceAgent: agent.id }
      };

      agent.emitTrace(event);
      // Should not throw error
    });
  });
}); 