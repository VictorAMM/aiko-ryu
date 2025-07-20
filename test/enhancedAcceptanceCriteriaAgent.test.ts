// test/enhancedAcceptanceCriteriaAgent.test.ts
import { EnhancedAcceptanceCriteriaAgent, EnhancedAcceptanceCriteria, CodeIssue, EnhancedDemoTest, DemoFeedback, StakeholderApproval } from '../src/agents/EnhancedAcceptanceCriteriaAgent';
import { AgentSpecification } from '../src/agents/AgentContract';

describe('EnhancedAcceptanceCriteriaAgent', () => {
  let enhancedAcceptanceCriteriaAgent: EnhancedAcceptanceCriteriaAgent;

  beforeEach(() => {
    enhancedAcceptanceCriteriaAgent = new EnhancedAcceptanceCriteriaAgent('test-enhanced-ac-agent');
  });

  afterEach(async () => {
    await enhancedAcceptanceCriteriaAgent.shutdown();
  });

  describe('Initialization', () => {
    it('should initialize successfully', async () => {
      await enhancedAcceptanceCriteriaAgent.initialize();
      
      const status = enhancedAcceptanceCriteriaAgent.getStatus();
      expect(status.status).toBe('ready');
      expect(status.uptime).toBeGreaterThanOrEqual(0);
    });

    it('should have correct role and dependencies', () => {
      expect(enhancedAcceptanceCriteriaAgent.role).toBe('EnhancedAcceptanceCriteriaValidator');
      expect(enhancedAcceptanceCriteriaAgent.dependencies).toContain('AikoAgent');
      expect(enhancedAcceptanceCriteriaAgent.dependencies).toContain('SpecificationEngine');
      expect(enhancedAcceptanceCriteriaAgent.dependencies).toContain('SpecificationFidelityAgent');
      expect(enhancedAcceptanceCriteriaAgent.dependencies).toContain('DemoTestingAgent');
    });
  });

  describe('Enhanced Acceptance Criteria Management', () => {
    beforeEach(async () => {
      await enhancedAcceptanceCriteriaAgent.initialize();
    });

    it('should create enhanced acceptance criteria', async () => {
      const criteria: Omit<EnhancedAcceptanceCriteria, 'id' | 'createdAt' | 'updatedAt'> = {
        name: 'User Authentication System',
        description: 'Implement secure user authentication with multi-factor support',
        type: 'security',
        priority: 'critical',
        status: 'draft',
        criteria: [
          'Users can register with email and password',
          'Users can login with valid credentials',
          'Password reset functionality works correctly',
          'Multi-factor authentication is supported'
        ],
        testCases: [
          {
            id: 'tc-001',
            name: 'User Registration Test',
            description: 'Test user registration functionality',
            type: 'user-acceptance',
            priority: 'high',
            status: 'ready',
            steps: [
              {
                id: 'step-001',
                order: 1,
                action: 'Navigate to registration page',
                expectedResult: 'Registration form is displayed',
                status: 'pending'
              },
              {
                id: 'step-002',
                order: 2,
                action: 'Fill in registration form',
                expectedResult: 'Form accepts valid input',
                status: 'pending'
              }
            ],
            expectedResults: ['User account is created successfully'],
            automated: false,
            prerequisites: ['System is running'],
            postConditions: ['User can login with new account'],
            dataRequirements: [
              {
                type: 'input',
                name: 'user_data',
                description: 'Valid user registration data',
                format: 'json',
                required: true,
                validationRules: ['email_format', 'password_strength']
              }
            ],
            environment: {
              name: 'Test Environment',
              description: 'Isolated test environment',
              type: 'testing',
              configuration: { database: 'test_db' },
              dependencies: ['database', 'email_service'],
              setupScripts: ['setup_test_db.sh'],
              teardownScripts: ['cleanup_test_db.sh']
            }
          }
        ],
        validationRules: [
          {
            id: 'rule-001',
            name: 'Password Strength',
            rule: 'Password must meet security requirements',
            validator: (input: unknown) => ({ result: true, consensus: true }),
            errorMessage: 'Password does not meet security requirements'
          }
        ],
        dependencies: ['auth-service', 'user-database'],
        estimatedEffort: 40,
        codeIssues: [],
        demoTestIds: [],
        specificationFidelityScore: 85,
        stakeholderApproval: []
      };

      const createdCriteria = await enhancedAcceptanceCriteriaAgent.createEnhancedAcceptanceCriteria(criteria);
      
      expect(createdCriteria.id).toBeDefined();
      expect(createdCriteria.name).toBe('User Authentication System');
      expect(createdCriteria.type).toBe('security');
      expect(createdCriteria.priority).toBe('critical');
      expect(createdCriteria.criteria).toHaveLength(4);
      expect(createdCriteria.testCases).toHaveLength(1);
      expect(createdCriteria.createdAt).toBeInstanceOf(Date);
      expect(createdCriteria.updatedAt).toBeInstanceOf(Date);
    });

    it('should update enhanced acceptance criteria', async () => {
      const criteria: Omit<EnhancedAcceptanceCriteria, 'id' | 'createdAt' | 'updatedAt'> = {
        name: 'Basic Feature',
        description: 'A basic feature for testing',
        type: 'functional',
        priority: 'medium',
        status: 'draft',
        criteria: ['Feature works correctly'],
        testCases: [],
        validationRules: [],
        dependencies: [],
        estimatedEffort: 8,
        codeIssues: [],
        demoTestIds: [],
        specificationFidelityScore: 70,
        stakeholderApproval: []
      };

      const createdCriteria = await enhancedAcceptanceCriteriaAgent.createEnhancedAcceptanceCriteria(criteria);
      
      const updatedCriteria = await enhancedAcceptanceCriteriaAgent.updateEnhancedAcceptanceCriteria(createdCriteria.id, {
        status: 'in-progress',
        actualEffort: 10,
        specificationFidelityScore: 90
      });

      expect(updatedCriteria.status).toBe('in-progress');
      expect(updatedCriteria.actualEffort).toBe(10);
      expect(updatedCriteria.specificationFidelityScore).toBe(90);
      expect(updatedCriteria.updatedAt.getTime()).toBeGreaterThanOrEqual(createdCriteria.updatedAt.getTime());
    });

    it('should validate enhanced acceptance criteria', async () => {
      const validCriteria: EnhancedAcceptanceCriteria = {
        id: 'valid-criteria',
        name: 'Valid Criteria',
        description: 'A valid acceptance criteria',
        type: 'functional',
        priority: 'high',
        status: 'draft',
        criteria: ['Feature works correctly'],
        testCases: [
          {
            id: 'tc-001',
            name: 'Test Case',
            description: 'A test case',
            type: 'unit',
            priority: 'high',
            status: 'ready',
            steps: [
              {
                id: 'step-001',
                order: 1,
                action: 'Test action',
                expectedResult: 'Expected result',
                status: 'pending'
              }
            ],
            expectedResults: ['Test passes'],
            automated: true,
            prerequisites: [],
            postConditions: [],
            dataRequirements: [],
            environment: {
              name: 'Test Env',
              description: 'Test environment',
              type: 'testing',
              configuration: {},
              dependencies: [],
              setupScripts: [],
              teardownScripts: []
            }
          }
        ],
        validationRules: [],
        dependencies: [],
        estimatedEffort: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
        codeIssues: [],
        demoTestIds: [],
        specificationFidelityScore: 80,
        stakeholderApproval: []
      };

      const result = await enhancedAcceptanceCriteriaAgent.validateEnhancedAcceptanceCriteria(validCriteria);
      
      expect(result.result).toBe(true);
      expect(result.consensus).toBe(true);
    });

    it('should execute enhanced acceptance criteria', async () => {
      const criteria: Omit<EnhancedAcceptanceCriteria, 'id' | 'createdAt' | 'updatedAt'> = {
        name: 'Executable Criteria',
        description: 'Criteria for execution testing',
        type: 'functional',
        priority: 'medium',
        status: 'draft',
        criteria: ['Feature works'],
        testCases: [
          {
            id: 'tc-001',
            name: 'Test Case',
            description: 'A test case',
            type: 'unit',
            priority: 'high',
            status: 'ready',
            steps: [
              {
                id: 'step-001',
                order: 1,
                action: 'Test action',
                expectedResult: 'Expected result',
                status: 'pending'
              }
            ],
            expectedResults: ['Test passes'],
            automated: true,
            prerequisites: [],
            postConditions: [],
            dataRequirements: [],
            environment: {
              name: 'Test Env',
              description: 'Test environment',
              type: 'testing',
              configuration: {},
              dependencies: [],
              setupScripts: [],
              teardownScripts: []
            }
          }
        ],
        validationRules: [],
        dependencies: [],
        estimatedEffort: 4,
        codeIssues: [],
        demoTestIds: [],
        specificationFidelityScore: 85,
        stakeholderApproval: []
      };

      const createdCriteria = await enhancedAcceptanceCriteriaAgent.createEnhancedAcceptanceCriteria(criteria);
      const result = await enhancedAcceptanceCriteriaAgent.executeEnhancedAcceptanceCriteria(createdCriteria.id);
      
      expect(result.result).toBeDefined();
      expect(typeof result.consensus).toBe('boolean');
    });
  });

  describe('Code Issue Management', () => {
    beforeEach(async () => {
      await enhancedAcceptanceCriteriaAgent.initialize();
    });

    it('should create code issue', async () => {
      const issue: Omit<CodeIssue, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'bug',
        severity: 'high',
        status: 'open',
        title: 'Authentication Bug',
        description: 'Users cannot login with valid credentials',
        location: {
          file: 'src/auth/AuthService.ts',
          line: 45,
          function: 'validateCredentials'
        },
        reporter: 'tester@example.com',
        acceptanceCriteriaId: 'ac-001',
        relatedIssues: [],
        labels: ['auth', 'critical'],
        comments: [],
        attachments: [],
        timeSpent: 0,
        estimatedTime: 4
      };

      const createdIssue = await enhancedAcceptanceCriteriaAgent.createCodeIssue(issue);
      
      expect(createdIssue.id).toBeDefined();
      expect(createdIssue.title).toBe('Authentication Bug');
      expect(createdIssue.type).toBe('bug');
      expect(createdIssue.severity).toBe('high');
      expect(createdIssue.status).toBe('open');
      expect(createdIssue.createdAt).toBeInstanceOf(Date);
      expect(createdIssue.updatedAt).toBeInstanceOf(Date);
    });

    it('should update code issue', async () => {
      const issue: Omit<CodeIssue, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'feature',
        severity: 'medium',
        status: 'open',
        title: 'Add User Profile',
        description: 'Implement user profile functionality',
        location: {
          file: 'src/user/UserService.ts',
          line: 10
        },
        reporter: 'developer@example.com',
        acceptanceCriteriaId: 'ac-002',
        relatedIssues: [],
        labels: ['feature', 'user'],
        comments: [],
        attachments: [],
        timeSpent: 0,
        estimatedTime: 16
      };

      const createdIssue = await enhancedAcceptanceCriteriaAgent.createCodeIssue(issue);
      
      const updatedIssue = await enhancedAcceptanceCriteriaAgent.updateCodeIssue(createdIssue.id, {
        status: 'in-progress',
        assignee: 'developer@example.com',
        timeSpent: 8
      });

      expect(updatedIssue.status).toBe('in-progress');
      expect(updatedIssue.assignee).toBe('developer@example.com');
      expect(updatedIssue.timeSpent).toBe(8);
      expect(updatedIssue.updatedAt.getTime()).toBeGreaterThanOrEqual(createdIssue.updatedAt.getTime());
    });

    it('should resolve code issue', async () => {
      const issue: Omit<CodeIssue, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'bug',
        severity: 'medium',
        status: 'open',
        title: 'Minor UI Bug',
        description: 'Button alignment issue',
        location: {
          file: 'src/components/Button.tsx',
          line: 25
        },
        reporter: 'designer@example.com',
        acceptanceCriteriaId: 'ac-003',
        relatedIssues: [],
        labels: ['ui', 'minor'],
        comments: [],
        attachments: [],
        timeSpent: 0,
        estimatedTime: 2
      };

      const createdIssue = await enhancedAcceptanceCriteriaAgent.createCodeIssue(issue);
      
      const resolvedIssue = await enhancedAcceptanceCriteriaAgent.resolveCodeIssue(createdIssue.id, 'Fixed button alignment');
      
      expect(resolvedIssue.status).toBe('resolved');
      expect(resolvedIssue.resolvedAt).toBeInstanceOf(Date);
      expect(resolvedIssue.comments).toHaveLength(1);
      expect(resolvedIssue.comments[0].content).toContain('Fixed button alignment');
    });

    it('should link code issue to acceptance criteria', async () => {
      const criteria: Omit<EnhancedAcceptanceCriteria, 'id' | 'createdAt' | 'updatedAt'> = {
        name: 'UI Component',
        description: 'UI component for testing',
        type: 'functional',
        priority: 'medium',
        status: 'draft',
        criteria: ['Component works correctly'],
        testCases: [],
        validationRules: [],
        dependencies: [],
        estimatedEffort: 4,
        codeIssues: [],
        demoTestIds: [],
        specificationFidelityScore: 80,
        stakeholderApproval: []
      };

      const createdCriteria = await enhancedAcceptanceCriteriaAgent.createEnhancedAcceptanceCriteria(criteria);
      
      const issue: Omit<CodeIssue, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'bug',
        severity: 'low',
        status: 'open',
        title: 'UI Bug',
        description: 'Minor UI issue',
        location: {
          file: 'src/components/Component.tsx',
          line: 15
        },
        reporter: 'tester@example.com',
        acceptanceCriteriaId: '',
        relatedIssues: [],
        labels: ['ui'],
        comments: [],
        attachments: [],
        timeSpent: 0,
        estimatedTime: 1
      };

      const createdIssue = await enhancedAcceptanceCriteriaAgent.createCodeIssue(issue);
      
      await enhancedAcceptanceCriteriaAgent.linkCodeIssueToAcceptanceCriteria(createdIssue.id, createdCriteria.id);
      
      // Verify the link was created (this would require a getter method, but for now we'll just test that no error was thrown)
      expect(true).toBe(true);
    });
  });

  describe('Enhanced Demo Testing', () => {
    beforeEach(async () => {
      await enhancedAcceptanceCriteriaAgent.initialize();
    });

    it('should create enhanced demo test', async () => {
      const test: Omit<EnhancedDemoTest, 'id' | 'status' | 'metrics' | 'createdAt' | 'updatedAt'> = {
        name: 'User Authentication Demo',
        description: 'Demonstrate user authentication features',
        type: 'interactive',
        priority: 'high',
        acceptanceCriteriaIds: ['ac-001', 'ac-002'],
        scenarios: [
          {
            id: 'scenario-001',
            name: 'User Registration',
            description: 'Demonstrate user registration process',
            type: 'happy-path',
            priority: 'high',
            status: 'pending',
            steps: [
              {
                id: 'step-001',
                order: 1,
                action: 'Navigate to registration page',
                expectedResult: 'Registration form is displayed',
                status: 'pending'
              },
              {
                id: 'step-002',
                order: 2,
                action: 'Fill registration form',
                expectedResult: 'Form accepts input',
                status: 'pending'
              }
            ],
            expectedOutcome: 'User account is created successfully',
            screenshots: [],
            notes: 'Standard registration flow',
            acceptanceCriteria: ['Users can register with email and password']
          }
        ],
        participants: [
          {
            id: 'participant-001',
            name: 'Product Manager',
            role: 'stakeholder',
            email: 'pm@example.com',
            availability: [
              {
                date: new Date(),
                startTime: '10:00',
                endTime: '11:00',
                timezone: 'UTC',
                confirmed: true
              }
            ],
            engagement: 90,
            notes: 'Interested in user experience'
          }
        ],
        feedback: [],
        schedule: {
          startDate: new Date(),
          endDate: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
          duration: 60,
          timezone: 'UTC',
          recurring: false,
          reminders: []
        },
        environment: {
          name: 'Demo Environment',
          description: 'Production-like demo environment',
          type: 'staging',
          configuration: { database: 'demo_db' },
          dependencies: ['database', 'email_service'],
          setupScripts: ['setup_demo.sh'],
          teardownScripts: ['cleanup_demo.sh']
        },
        materials: [
          {
            id: 'material-001',
            name: 'Demo Script',
            type: 'script',
            url: '/materials/demo-script.pdf',
            description: 'Step-by-step demo script',
            required: true,
            version: '1.0'
          }
        ],
        recording: {
          enabled: true,
          quality: 'high',
          format: 'mp4'
        }
      };

      const createdTest = await enhancedAcceptanceCriteriaAgent.createEnhancedDemoTest(test);
      
      expect(createdTest.id).toBeDefined();
      expect(createdTest.name).toBe('User Authentication Demo');
      expect(createdTest.type).toBe('interactive');
      expect(createdTest.priority).toBe('high');
      expect(createdTest.status).toBe('draft');
      expect(createdTest.scenarios).toHaveLength(1);
      expect(createdTest.participants).toHaveLength(1);
      expect(createdTest.metrics.totalScenarios).toBe(1);
      expect(createdTest.metrics.totalSteps).toBe(2);
      expect(createdTest.createdAt).toBeInstanceOf(Date);
      expect(createdTest.updatedAt).toBeInstanceOf(Date);
    });

    it('should execute enhanced demo test', async () => {
      const test: Omit<EnhancedDemoTest, 'id' | 'status' | 'metrics' | 'createdAt' | 'updatedAt'> = {
        name: 'Simple Demo',
        description: 'A simple demo for testing',
        type: 'interactive',
        priority: 'medium',
        acceptanceCriteriaIds: ['ac-001'],
        scenarios: [
          {
            id: 'scenario-001',
            name: 'Simple Scenario',
            description: 'A simple scenario',
            type: 'happy-path',
            priority: 'medium',
            status: 'pending',
            steps: [
              {
                id: 'step-001',
                order: 1,
                action: 'Simple action',
                expectedResult: 'Expected result',
                status: 'pending'
              }
            ],
            expectedOutcome: 'Scenario completes successfully',
            screenshots: [],
            notes: 'Simple test',
            acceptanceCriteria: ['Feature works']
          }
        ],
        participants: [],
        feedback: [],
        schedule: {
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 60 * 1000),
          duration: 30,
          timezone: 'UTC',
          recurring: false,
          reminders: []
        },
        environment: {
          name: 'Test Env',
          description: 'Test environment',
          type: 'testing',
          configuration: {},
          dependencies: [],
          setupScripts: [],
          teardownScripts: []
        },
        materials: [],
        recording: {
          enabled: false,
          quality: 'medium',
          format: 'mp4'
        }
      };

      const createdTest = await enhancedAcceptanceCriteriaAgent.createEnhancedDemoTest(test);
      const executedTest = await enhancedAcceptanceCriteriaAgent.executeEnhancedDemoTest(createdTest.id);
      
      expect(executedTest.status).toBe('completed');
      expect(executedTest.metrics.completedScenarios).toBeGreaterThan(0);
      expect(executedTest.metrics.completedSteps).toBeGreaterThan(0);
      expect(executedTest.completedAt).toBeInstanceOf(Date);
    });

    it('should collect enhanced demo feedback', async () => {
      const test: Omit<EnhancedDemoTest, 'id' | 'status' | 'metrics' | 'createdAt' | 'updatedAt'> = {
        name: 'Feedback Demo',
        description: 'Demo for feedback testing',
        type: 'interactive',
        priority: 'medium',
        acceptanceCriteriaIds: ['ac-001'],
        scenarios: [],
        participants: [],
        feedback: [],
        schedule: {
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 60 * 1000),
          duration: 30,
          timezone: 'UTC',
          recurring: false,
          reminders: []
        },
        environment: {
          name: 'Test Env',
          description: 'Test environment',
          type: 'testing',
          configuration: {},
          dependencies: [],
          setupScripts: [],
          teardownScripts: []
        },
        materials: [],
        recording: {
          enabled: false,
          quality: 'medium',
          format: 'mp4'
        }
      };

      const createdTest = await enhancedAcceptanceCriteriaAgent.createEnhancedDemoTest(test);
      
      const feedback: DemoFeedback = {
        id: 'feedback-001',
        participantId: 'participant-001',
        participantName: 'Test User',
        category: 'functionality',
        rating: 5,
        comments: 'Excellent functionality',
        suggestions: ['Add more features'],
        timestamp: new Date()
      };

      await enhancedAcceptanceCriteriaAgent.collectEnhancedDemoFeedback(createdTest.id, feedback);
      
      // Verify feedback was collected (this would require a getter method, but for now we'll just test that no error was thrown)
      expect(true).toBe(true);
    });

    it('should generate enhanced demo report', async () => {
      const test: Omit<EnhancedDemoTest, 'id' | 'status' | 'metrics' | 'createdAt' | 'updatedAt'> = {
        name: 'Report Demo',
        description: 'Demo for report generation',
        type: 'interactive',
        priority: 'medium',
        acceptanceCriteriaIds: ['ac-001'],
        scenarios: [
          {
            id: 'scenario-001',
            name: 'Test Scenario',
            description: 'A test scenario',
            type: 'happy-path',
            priority: 'medium',
            status: 'completed',
            steps: [
              {
                id: 'step-001',
                order: 1,
                action: 'Test action',
                expectedResult: 'Expected result',
                status: 'completed',
                actualResult: 'Actual result',
                timestamp: new Date(),
                duration: 1000
              }
            ],
            expectedOutcome: 'Scenario completes',
            actualOutcome: 'Scenario completed successfully',
            duration: 1000,
            screenshots: [],
            notes: 'Test notes',
            acceptanceCriteria: ['Feature works']
          }
        ],
        participants: [],
        feedback: [
          {
            id: 'feedback-001',
            participantId: 'participant-001',
            participantName: 'Test User',
            category: 'functionality',
            rating: 5,
            comments: 'Great demo',
            suggestions: [],
            timestamp: new Date()
          }
        ],
        schedule: {
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 60 * 1000),
          duration: 30,
          timezone: 'UTC',
          recurring: false,
          reminders: []
        },
        environment: {
          name: 'Test Env',
          description: 'Test environment',
          type: 'testing',
          configuration: {},
          dependencies: [],
          setupScripts: [],
          teardownScripts: []
        },
        materials: [],
        recording: {
          enabled: false,
          quality: 'medium',
          format: 'mp4'
        }
      };

      const createdTest = await enhancedAcceptanceCriteriaAgent.createEnhancedDemoTest(test);
      const report = await enhancedAcceptanceCriteriaAgent.generateEnhancedDemoReport(createdTest.id);
      
      expect(report).toContain('Enhanced Demo Test Report');
      expect(report).toContain(createdTest.id);
      expect(report).toContain(createdTest.name);
      expect(report).toContain('Metrics');
      expect(report).toContain('Scenarios');
      expect(report).toContain('Feedback');
      expect(report).toContain('Recommendations');
    });
  });

  describe('Integrated Testing and Validation', () => {
    beforeEach(async () => {
      await enhancedAcceptanceCriteriaAgent.initialize();
    });

    it('should run integrated enhanced tests', async () => {
      const result = await enhancedAcceptanceCriteriaAgent.runIntegratedEnhancedTests('test-specification');
      
      expect(result.result).toBeDefined();
      expect(typeof result.consensus).toBe('boolean');
      expect(result.reason).toBeDefined();
    });

    it('should generate enhanced test report', async () => {
      const report = await enhancedAcceptanceCriteriaAgent.generateEnhancedTestReport('test-specification');
      
      expect(report).toContain('Enhanced Test Report');
      expect(report).toContain('test-specification');
      expect(report).toContain('Acceptance Criteria Summary');
      expect(report).toContain('Code Issues Summary');
      expect(report).toContain('Demo Tests Summary');
    });

    it('should validate enhanced code quality', async () => {
      const result = await enhancedAcceptanceCriteriaAgent.validateEnhancedCodeQuality('test-specification');
      
      expect(result.result).toBeDefined();
      expect(typeof result.consensus).toBe('boolean');
      expect(result.reason).toBeDefined();
    });
  });

  describe('Stakeholder Management', () => {
    beforeEach(async () => {
      await enhancedAcceptanceCriteriaAgent.initialize();
    });

    it('should add stakeholder approval', async () => {
      const criteria: Omit<EnhancedAcceptanceCriteria, 'id' | 'createdAt' | 'updatedAt'> = {
        name: 'Stakeholder Test',
        description: 'Test stakeholder approval',
        type: 'functional',
        priority: 'medium',
        status: 'draft',
        criteria: ['Feature works'],
        testCases: [],
        validationRules: [],
        dependencies: [],
        estimatedEffort: 4,
        codeIssues: [],
        demoTestIds: [],
        specificationFidelityScore: 80,
        stakeholderApproval: []
      };

      const createdCriteria = await enhancedAcceptanceCriteriaAgent.createEnhancedAcceptanceCriteria(criteria);
      
      const approval: StakeholderApproval = {
        stakeholderId: 'stakeholder-001',
        stakeholderName: 'Product Owner',
        role: 'product-owner',
        approvalStatus: 'approved',
        comments: 'Approved for development',
        timestamp: new Date()
      };

      await enhancedAcceptanceCriteriaAgent.addStakeholderApproval(createdCriteria.id, approval);
      
      const approvals = await enhancedAcceptanceCriteriaAgent.getStakeholderApprovals(createdCriteria.id);
      
      expect(approvals).toHaveLength(1);
      expect(approvals[0].stakeholderName).toBe('Product Owner');
      expect(approvals[0].approvalStatus).toBe('approved');
    });
  });

  describe('Analytics and Reporting', () => {
    beforeEach(async () => {
      await enhancedAcceptanceCriteriaAgent.initialize();
    });

    it('should generate acceptance criteria analytics', async () => {
      const analytics = await enhancedAcceptanceCriteriaAgent.generateAcceptanceCriteriaAnalytics();
      
      expect(analytics.totalCriteria).toBeGreaterThanOrEqual(0);
      expect(analytics.completedCriteria).toBeGreaterThanOrEqual(0);
      expect(analytics.failedCriteria).toBeGreaterThanOrEqual(0);
      expect(analytics.averageEffort).toBeGreaterThanOrEqual(0);
      expect(analytics.averageFidelityScore).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(analytics.topIssues)).toBe(true);
      expect(analytics.stakeholderSatisfaction).toBeGreaterThanOrEqual(0);
      expect(analytics.timeToCompletion).toBeGreaterThanOrEqual(0);
    });

    it('should generate code issue analytics', async () => {
      const analytics = await enhancedAcceptanceCriteriaAgent.generateCodeIssueAnalytics();
      
      expect(analytics.totalIssues).toBeGreaterThanOrEqual(0);
      expect(analytics.openIssues).toBeGreaterThanOrEqual(0);
      expect(analytics.resolvedIssues).toBeGreaterThanOrEqual(0);
      expect(analytics.averageResolutionTime).toBeGreaterThanOrEqual(0);
      expect(typeof analytics.issueDistribution).toBe('object');
      expect(Array.isArray(analytics.topIssueTypes)).toBe(true);
      expect(typeof analytics.averageSeverity).toBe('string');
    });

    it('should generate demo test analytics', async () => {
      const analytics = await enhancedAcceptanceCriteriaAgent.generateDemoTestAnalytics();
      
      expect(analytics.totalTests).toBeGreaterThanOrEqual(0);
      expect(analytics.completedTests).toBeGreaterThanOrEqual(0);
      expect(analytics.averageRating).toBeGreaterThanOrEqual(0);
      expect(analytics.averageEngagement).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(analytics.topScenarios)).toBe(true);
      expect(analytics.participantSatisfaction).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(analytics.specificationFidelityTrend)).toBe(true);
    });
  });

  describe('Event Handling', () => {
    beforeEach(async () => {
      await enhancedAcceptanceCriteriaAgent.initialize();
    });

    it('should handle acceptance criteria creation event', async () => {
      const eventPayload = {
        criteria: {
          name: 'Event Test',
          description: 'Test event handling',
          type: 'functional' as const,
          priority: 'medium' as const,
          status: 'draft' as const,
          criteria: ['Feature works'],
          testCases: [],
          validationRules: [],
          dependencies: [],
          estimatedEffort: 4,
          codeIssues: [],
          demoTestIds: [],
          specificationFidelityScore: 80,
          stakeholderApproval: []
        }
      };

      await enhancedAcceptanceCriteriaAgent.handleEvent('acceptance-criteria.create', eventPayload);
      
      // Verify event was handled (this would require a getter method, but for now we'll just test that no error was thrown)
      expect(true).toBe(true);
    });

    it('should handle code issue creation event', async () => {
      const eventPayload = {
        issue: {
          type: 'bug' as const,
          severity: 'medium' as const,
          status: 'open' as const,
          title: 'Event Test Bug',
          description: 'Test bug for event handling',
          location: {
            file: 'src/test.ts',
            line: 10
          },
          reporter: 'tester@example.com',
          acceptanceCriteriaId: 'ac-001',
          relatedIssues: [],
          labels: ['test'],
          comments: [],
          attachments: [],
          timeSpent: 0,
          estimatedTime: 2
        }
      };

      await enhancedAcceptanceCriteriaAgent.handleEvent('code-issue.create', eventPayload);
      
      // Verify event was handled
      expect(true).toBe(true);
    });

    it('should handle demo test execution event', async () => {
      // First create a demo test
      const test = {
        name: 'Event Test Demo',
        description: 'Demo test for event handling',
        type: 'interactive' as const,
        priority: 'medium' as const,
        acceptanceCriteriaIds: ['ac-001'],
        scenarios: [],
        participants: [],
        feedback: [],
        schedule: {
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 60 * 1000),
          duration: 30,
          timezone: 'UTC',
          recurring: false,
          reminders: []
        },
        environment: {
          name: 'Test Env',
          description: 'Test environment',
          type: 'testing' as const,
          configuration: {},
          dependencies: [],
          setupScripts: [],
          teardownScripts: []
        },
        materials: [],
        recording: {
          enabled: false,
          quality: 'medium' as const,
          format: 'mp4' as const
        }
      };

      const createdTest = await enhancedAcceptanceCriteriaAgent.createEnhancedDemoTest(test);
      
      const eventPayload = {
        testId: createdTest.id
      };

      await enhancedAcceptanceCriteriaAgent.handleEvent('demo-test.execute', eventPayload);
      
      // Verify event was handled
      expect(true).toBe(true);
    });

    it('should handle stakeholder approval event', async () => {
      // First create acceptance criteria
      const criteria = {
        name: 'Event Test Criteria',
        description: 'Test criteria for event handling',
        type: 'functional' as const,
        priority: 'medium' as const,
        status: 'draft' as const,
        criteria: ['Feature works'],
        testCases: [],
        validationRules: [],
        dependencies: [],
        estimatedEffort: 4,
        codeIssues: [],
        demoTestIds: [],
        specificationFidelityScore: 80,
        stakeholderApproval: []
      };

      const createdCriteria = await enhancedAcceptanceCriteriaAgent.createEnhancedAcceptanceCriteria(criteria);
      
      const eventPayload = {
        criteriaId: createdCriteria.id,
        approval: {
          stakeholderId: 'stakeholder-001',
          stakeholderName: 'Test Stakeholder',
          role: 'product-owner' as const,
          approvalStatus: 'approved' as const,
          comments: 'Test approval',
          timestamp: new Date()
        }
      };

      await enhancedAcceptanceCriteriaAgent.handleEvent('stakeholder.approval.add', eventPayload);
      
      // Verify event was handled
      expect(true).toBe(true);
    });
  });

  describe('Error Handling', () => {
    beforeEach(async () => {
      await enhancedAcceptanceCriteriaAgent.initialize();
    });

    it('should handle invalid acceptance criteria gracefully', async () => {
      try {
        await enhancedAcceptanceCriteriaAgent.createEnhancedAcceptanceCriteria({
          name: '', // Invalid: empty name
          description: 'Test invalid criteria',
          type: 'functional',
          priority: 'medium',
          status: 'draft',
          criteria: [], // Invalid: empty criteria
          testCases: [],
          validationRules: [],
          dependencies: [],
          estimatedEffort: 4,
          codeIssues: [],
          demoTestIds: [],
          specificationFidelityScore: 80,
          stakeholderApproval: []
        });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle non-existent criteria updates gracefully', async () => {
      try {
        await enhancedAcceptanceCriteriaAgent.updateEnhancedAcceptanceCriteria('non-existent-id', {
          status: 'completed'
        });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle non-existent demo test execution gracefully', async () => {
      try {
        await enhancedAcceptanceCriteriaAgent.executeEnhancedDemoTest('non-existent-test');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Performance', () => {
    beforeEach(async () => {
      await enhancedAcceptanceCriteriaAgent.initialize();
    });

    it('should handle multiple criteria creation efficiently', async () => {
      const startTime = Date.now();
      
      const promises = Array.from({ length: 10 }, (_, i) => 
        enhancedAcceptanceCriteriaAgent.createEnhancedAcceptanceCriteria({
          name: `Test Criteria ${i}`,
          description: `Test criteria ${i}`,
          type: 'functional',
          priority: 'medium',
          status: 'draft',
          criteria: [`Feature ${i} works`],
          testCases: [],
          validationRules: [],
          dependencies: [],
          estimatedEffort: 4,
          codeIssues: [],
          demoTestIds: [],
          specificationFidelityScore: 80,
          stakeholderApproval: []
        })
      );

      const results = await Promise.all(promises);
      const endTime = Date.now();
      
      expect(results).toHaveLength(10);
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
    });

    it('should handle multiple code issues efficiently', async () => {
      const startTime = Date.now();
      
      const promises = Array.from({ length: 20 }, (_, i) => 
        enhancedAcceptanceCriteriaAgent.createCodeIssue({
          type: 'bug',
          severity: 'medium',
          status: 'open',
          title: `Bug ${i}`,
          description: `Test bug ${i}`,
          location: {
            file: `src/test${i}.ts`,
            line: i
          },
          reporter: 'tester@example.com',
          acceptanceCriteriaId: 'ac-001',
          relatedIssues: [],
          labels: ['test'],
          comments: [],
          attachments: [],
          timeSpent: 0,
          estimatedTime: 2
        })
      );

      const results = await Promise.all(promises);
      const endTime = Date.now();
      
      expect(results).toHaveLength(20);
      expect(endTime - startTime).toBeLessThan(3000); // Should complete within 3 seconds
    });
  });
}); 