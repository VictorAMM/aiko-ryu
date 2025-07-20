// test/integrated-acceptance-fidelity.test.ts
import { AcceptanceCriteriaAgent } from '../src/agents/AcceptanceCriteriaAgent';
import { SpecificationFidelityAgent } from '../src/agents/SpecificationFidelityAgent';
import { DemoTestingAgent } from '../src/agents/DemoTestingAgent';
import { AgentSpecification } from '../src/agents/AgentContract';

describe('Integrated Acceptance Criteria and Fidelity System', () => {
  let acceptanceCriteriaAgent: AcceptanceCriteriaAgent;
  let specificationFidelityAgent: SpecificationFidelityAgent;
  let demoTestingAgent: DemoTestingAgent;

  beforeEach(async () => {
    acceptanceCriteriaAgent = new AcceptanceCriteriaAgent('test-acceptance-criteria-agent');
    specificationFidelityAgent = new SpecificationFidelityAgent('test-specification-fidelity-agent');
    demoTestingAgent = new DemoTestingAgent('test-demo-testing-agent');

    await Promise.all([
      acceptanceCriteriaAgent.initialize(),
      specificationFidelityAgent.initialize(),
      demoTestingAgent.initialize()
    ]);
  });

  afterEach(async () => {
    await Promise.all([
      acceptanceCriteriaAgent.shutdown(),
      specificationFidelityAgent.shutdown(),
      demoTestingAgent.shutdown()
    ]);
  });

  describe('End-to-End Acceptance Criteria Workflow', () => {
    it('should complete full acceptance criteria workflow', async () => {
      // 1. Create acceptance criteria
      const criteria = await acceptanceCriteriaAgent.createAcceptanceCriteria({
        name: 'User Authentication System',
        description: 'Complete user authentication system with security validation',
        type: 'functional',
        priority: 'critical',
        status: 'pending',
        criteria: [
          'Users can register with valid email and password',
          'Users can login with correct credentials',
          'Users receive appropriate error messages for invalid credentials',
          'User sessions are maintained securely',
          'Password reset functionality works correctly'
        ],
        testCases: [
          {
            id: 'test-auth-001',
            name: 'User Registration Test',
            description: 'Test user registration process',
            type: 'unit',
            status: 'pending',
            steps: [
              {
                id: 'step-reg-001',
                name: 'Enter valid registration data',
                action: 'Enter valid email and password',
                expectedOutcome: 'Registration form accepts input',
                status: 'pending'
              },
              {
                id: 'step-reg-002',
                name: 'Submit registration',
                action: 'Click register button',
                expectedOutcome: 'User account is created',
                status: 'pending'
              }
            ],
            expectedResult: 'User is registered successfully',
            metadata: { priority: 'high' }
          },
          {
            id: 'test-auth-002',
            name: 'User Login Test',
            description: 'Test user login process',
            type: 'unit',
            status: 'pending',
            steps: [
              {
                id: 'step-login-001',
                name: 'Enter valid credentials',
                action: 'Enter username and password',
                expectedOutcome: 'Login form accepts input',
                status: 'pending'
              },
              {
                id: 'step-login-002',
                name: 'Submit login',
                action: 'Click login button',
                expectedOutcome: 'User is authenticated',
                status: 'pending'
              }
            ],
            expectedResult: 'User is logged in successfully',
            metadata: { priority: 'critical' }
          }
        ],
        validationRules: [],
        dependencies: [],
        estimatedEffort: 16
      });

      expect(criteria.id).toBeDefined();
      expect(criteria.name).toBe('User Authentication System');
      expect(criteria.criteria.length).toBe(5);
      expect(criteria.testCases.length).toBe(2);

      // 2. Validate acceptance criteria
      const validation = await acceptanceCriteriaAgent.validateAcceptanceCriteria(criteria);
      expect(validation.result).toBe(true);
      expect(validation.consensus).toBe(true);

      // 3. Execute acceptance criteria
      const execution = await acceptanceCriteriaAgent.executeAcceptanceCriteria(criteria.id);
      expect(execution.result).toBe(true);
      expect(execution.consensus).toBe(true);

      console.log('✅ Acceptance criteria workflow completed successfully');
    });

    it('should handle acceptance criteria with dependencies', async () => {
      // Create dependent criteria
      const baseCriteria = await acceptanceCriteriaAgent.createAcceptanceCriteria({
        name: 'Database Connection',
        description: 'Database connection must be established',
        type: 'technical',
        priority: 'high',
        status: 'pending',
        criteria: ['Database connection is established', 'Connection is stable'],
        testCases: [
          {
            id: 'test-db-001',
            name: 'Database Connection Test',
            description: 'Test database connectivity',
            type: 'integration',
            status: 'pending',
            steps: [
              {
                id: 'step-db-001',
                name: 'Connect to database',
                action: 'Establish database connection',
                expectedOutcome: 'Connection successful',
                status: 'pending'
              }
            ],
            expectedResult: 'Database connection established',
            metadata: {}
          }
        ],
        validationRules: [],
        dependencies: [],
        estimatedEffort: 8
      });

      const dependentCriteria = await acceptanceCriteriaAgent.createAcceptanceCriteria({
        name: 'User Data Persistence',
        description: 'User data must be persisted to database',
        type: 'functional',
        priority: 'high',
        status: 'pending',
        criteria: ['User data is saved to database', 'Data retrieval works correctly'],
        testCases: [
          {
            id: 'test-persistence-001',
            name: 'Data Persistence Test',
            description: 'Test data persistence',
            type: 'integration',
            status: 'pending',
            steps: [
              {
                id: 'step-persistence-001',
                name: 'Save user data',
                action: 'Save user information to database',
                expectedOutcome: 'Data is saved',
                status: 'pending'
              },
              {
                id: 'step-persistence-002',
                name: 'Retrieve user data',
                action: 'Retrieve user information from database',
                expectedOutcome: 'Data is retrieved correctly',
                status: 'pending'
              }
            ],
            expectedResult: 'Data persistence works correctly',
            metadata: {}
          }
        ],
        validationRules: [],
        dependencies: [baseCriteria.id],
        estimatedEffort: 12
      });

      expect(dependentCriteria.dependencies).toContain(baseCriteria.id);

      // Execute dependent criteria
      const execution = await acceptanceCriteriaAgent.executeAcceptanceCriteria(dependentCriteria.id);
      expect(execution.result).toBe(true);

      console.log('✅ Dependent acceptance criteria workflow completed successfully');
    });
  });

  describe('End-to-End Specification Fidelity Workflow', () => {
    it('should complete full specification fidelity workflow', async () => {
      // 1. Create comprehensive specification
      const specification: AgentSpecification = {
        id: 'auth-system-spec',
        role: 'AuthenticationSystem',
        capabilities: [
          {
            id: 'cap-auth-001',
            name: 'User Registration',
            description: 'Register new users with email and password',
            inputs: [
              {
                name: 'email',
                type: 'string',
                description: 'The email address for registration',
                required: true
              },
              {
                name: 'password',
                type: 'string',
                description: 'The password for registration',
                required: true
              }
            ],
            outputs: [
              {
                name: 'user_id',
                type: 'string',
                description: 'The ID of the newly created user',
                required: true
              },
              {
                name: 'registration_status',
                type: 'string',
                description: 'The status of the registration process',
                required: true
              }
            ],
            preconditions: [
              {
                id: 'pre-email-valid',
                expression: 'email.matches(/^[^@]+@[^@]+\.[^@]+$/)',
                description: 'The email address must be a valid format',
                operator: 'and'
              },
              {
                id: 'pre-password-secure',
                expression: 'password.length >= 8 && password.matches(/[A-Za-z0-9@#$%^&*]/)',
                description: 'The password must meet security requirements',
                operator: 'and'
              }
            ],
            postconditions: [
              {
                id: 'post-user-created',
                expression: 'user_id !== null && user_id !== undefined',
                description: 'The user account must be successfully created',
                operator: 'and'
              },
              {
                id: 'post-verification-sent',
                expression: 'registration_status === "success" && user_id !== null',
                description: 'A verification email must be sent to the user',
                operator: 'and'
              }
            ]
          },
          {
            id: 'cap-auth-002',
            name: 'User Authentication',
            description: 'Authenticate users with credentials',
            inputs: [
              {
                name: 'email',
                type: 'string',
                description: 'The email address for authentication',
                required: true
              },
              {
                name: 'password',
                type: 'string',
                description: 'The password for authentication',
                required: true
              }
            ],
            outputs: [
              {
                name: 'auth_token',
                type: 'string',
                description: 'The authentication token for the user',
                required: true
              },
              {
                name: 'user_profile',
                type: 'object',
                description: 'The user profile information',
                required: true
              }
            ],
            preconditions: [
              {
                id: 'pre-user-exists',
                expression: 'user_profile !== null && user_profile !== undefined',
                description: 'The user must have an account',
                operator: 'and'
              },
              {
                id: 'pre-credentials-valid',
                expression: 'email === user_profile.email && password === user_profile.password',
                description: 'The provided email and password must be correct',
                operator: 'and'
              }
            ],
            postconditions: [
              {
                id: 'post-user-authenticated',
                expression: 'auth_token !== null && auth_token !== undefined',
                description: 'The user must be successfully authenticated',
                operator: 'and'
              },
              {
                id: 'post-session-created',
                expression: 'auth_token !== null && auth_token !== undefined',
                description: 'A session must be created for the user',
                operator: 'and'
              }
            ]
          },
          {
            id: 'cap-auth-003',
            name: 'Password Reset',
            description: 'Reset user password via email',
            inputs: [
              {
                name: 'email',
                type: 'string',
                description: 'The email address for password reset',
                required: true
              }
            ],
            outputs: [
              {
                name: 'reset_token',
                type: 'string',
                description: 'The token for resetting the password',
                required: true
              },
              {
                name: 'reset_status',
                type: 'string',
                description: 'The status of the password reset process',
                required: true
              }
            ],
            preconditions: [
              {
                id: 'pre-user-exists',
                expression: 'user_profile !== null && user_profile !== undefined',
                description: 'The user must have an account',
                operator: 'and'
              },
              {
                id: 'pre-email-valid',
                expression: 'email.matches(/^[^@]+@[^@]+\.[^@]+$/)',
                description: 'The email address must be a valid format',
                operator: 'and'
              }
            ],
            postconditions: [
              {
                id: 'post-reset-email-sent',
                expression: 'reset_status === "success"',
                description: 'A password reset email must be sent to the user',
                operator: 'and'
              },
              {
                id: 'post-token-generated',
                expression: 'reset_token !== null && reset_token !== undefined',
                description: 'A password reset token must be generated',
                operator: 'and'
              }
            ]
          }
        ],
        interfaces: [
          {
            id: 'iface-auth-001',
            name: 'AuthenticationInterface',
            methods: [
              {
                name: 'register',
                description: 'Register a new user',
                parameters: [
                  {
                    name: 'email',
                    type: 'string',
                    description: 'The email address for registration',
                    required: true
                  },
                  {
                    name: 'password',
                    type: 'string',
                    description: 'The password for registration',
                    required: true
                  }
                ],
                returnType: 'void'
              },
              {
                name: 'login',
                description: 'Authenticate a user',
                parameters: [
                  {
                    name: 'email',
                    type: 'string',
                    description: 'The email address for authentication',
                    required: true
                  },
                  {
                    name: 'password',
                    type: 'string',
                    description: 'The password for authentication',
                    required: true
                  }
                ],
                returnType: 'void'
              },
              {
                name: 'logout',
                description: 'End the current user session',
                parameters: [],
                returnType: 'void'
              },
              {
                name: 'resetPassword',
                description: 'Request a password reset for a user',
                parameters: [
                  {
                    name: 'email',
                    type: 'string',
                    description: 'The email address for password reset',
                    required: true
                  }
                ],
                returnType: 'void'
              }
            ],
            events: [
              {
                name: 'user_registered',
                description: 'Triggered when a new user is successfully registered',
                payload: []
              },
              {
                name: 'user_logged_in',
                description: 'Triggered when a user successfully logs in',
                payload: []
              },
              {
                name: 'password_reset_requested',
                description: 'Triggered when a password reset request is initiated',
                payload: []
              }
            ],
            properties: [
              {
                name: 'session_timeout',
                type: 'number',
                description: 'The duration in milliseconds after which an inactive session expires',
                readonly: false
              },
              {
                name: 'max_login_attempts',
                type: 'number',
                description: 'The maximum number of failed login attempts allowed',
                readonly: false
              }
            ]
          }
        ],
        behaviors: [
          {
            id: 'behavior-auth-001',
            name: 'Secure Authentication',
            description: 'Implement secure authentication practices',
            trigger: {
              type: 'event',
              value: 'user.login.attempt',
              description: 'Triggered when a user attempts to log in'
            },
            actions: [
              {
                id: 'action-validate_credentials',
                type: 'function',
                target: 'credential_validator',
                parameters: {
                  email: 'string',
                  password: 'string'
                }
              },
              {
                id: 'action-check_rate_limit',
                type: 'function',
                target: 'rate_limit_checker',
                parameters: {}
              },
              {
                id: 'action-generate_token',
                type: 'function',
                target: 'token_generator',
                parameters: {}
              }
            ],
            conditions: [
              {
                id: 'cond-credentials-valid',
                expression: 'is_valid === true',
                description: 'The provided credentials must be valid',
                operator: 'and'
              },
              {
                id: 'cond-rate-limit-not-exceeded',
                expression: 'is_exceeded === false',
                description: 'The user must not have exceeded the rate limit for login attempts',
                operator: 'and'
              }
            ],
            outcomes: [
              {
                id: 'outcome-login-success',
                type: 'success',
                description: 'User successfully authenticated',
                nextActions: ['generate_token', 'redirect_to_dashboard']
              },
              {
                id: 'outcome-login-failure',
                type: 'failure',
                description: 'Authentication failed',
                nextActions: ['show_error_message', 'increment_attempts']
              }
            ]
          }
        ],
        constraints: [
          {
            id: 'constraint-password-security',
            type: 'security',
            description: 'Passwords must meet security requirements',
            validationRule: 'password.length >= 8 && password.matches(/[A-Za-z0-9@#$%^&*]/)',
            severity: 'critical'
          }
        ],
        validationRules: [
          {
            id: 'rule-email-validation',
            name: 'Email Validation',
            rule: 'email.matches(/^[^@]+@[^@]+\.[^@]+$/)',
            validator: () => ({ result: true, consensus: true }),
            errorMessage: 'Invalid email format'
          }
        ],
        dependencies: [],
        designIntent: {
          purpose: 'Provide secure user authentication system',
          userGoals: ['Easy registration and login', 'Secure password management', 'Password recovery'],
          successMetrics: [
            {
              id: 'metric-registration-success',
              name: 'Registration Success Rate',
              type: 'performance',
              target: 95,
              unit: 'percent',
              description: 'Percentage of successful user registrations'
            },
            {
              id: 'metric-login-response',
              name: 'Login Response Time',
              type: 'performance',
              target: 500,
              unit: 'milliseconds',
              description: 'Average login response time'
            }
          ],
          designPrinciples: ['Security first', 'User-friendly', 'Scalable'],
          accessibilityRequirements: ['WCAG 2.1 AA compliance', 'Keyboard navigation support']
        },
        userRequirements: [
          {
            id: 'req-user-registration',
            description: 'As a new user, I want to register with my email so that I can access the system',
            priority: 'high',
            userStory: 'As a new user, I want to register with my email so that I can access the system',
            acceptanceCriteria: ['Email is validated', 'Password meets security requirements', 'Verification email is sent'],
            persona: 'New User'
          },
          {
            id: 'req-secure-login',
            description: 'As a registered user, I want to login securely so that I can access my account',
            priority: 'critical',
            userStory: 'As a registered user, I want to login securely so that I can access my account',
            acceptanceCriteria: ['Credentials are validated', 'Session is created', 'Failed attempts are limited'],
            persona: 'Registered User'
          },
          {
            id: 'req-password-reset',
            description: 'As a user, I want to reset my password so that I can regain access if I forget it',
            priority: 'medium',
            userStory: 'As a user, I want to reset my password so that I can regain access if I forget it',
            acceptanceCriteria: ['Reset email is sent', 'Reset token is secure', 'Password can be changed'],
            persona: 'Forgotten Password User'
          }
        ]
      };

      // 2. Check specification fidelity
      const fidelityChecks = await specificationFidelityAgent.validateSpecificationFidelity(specification);
      expect(fidelityChecks.length).toBeGreaterThan(0);
      
      const syntaxCheck = fidelityChecks.find(check => check.checkType === 'syntax');
      const semanticsCheck = fidelityChecks.find(check => check.checkType === 'semantics');
      const completenessCheck = fidelityChecks.find(check => check.checkType === 'completeness');
      
      expect(syntaxCheck).toBeDefined();
      expect(semanticsCheck).toBeDefined();
      expect(completenessCheck).toBeDefined();

      // 3. Validate specification fidelity
      const fidelityValidation = await specificationFidelityAgent.validateSpecificationFidelity(specification);
      expect(fidelityValidation.length).toBeGreaterThan(0);

      // 4. Generate fidelity report
      const report = await specificationFidelityAgent.generateFidelityReport(specification.id);
      expect(report.specificationId).toBe(specification.id);
      expect(report.overallScore).toBeGreaterThan(0);
      expect(report.checks.length).toBeGreaterThan(0);

      // 5. Validate code quality
      const codeQuality = await specificationFidelityAgent.validateCodeQuality(specification.id);
      expect(codeQuality.cyclomaticComplexity).toBeGreaterThan(0);
      expect(codeQuality.maintainabilityIndex).toBeGreaterThan(0);

      // 6. Validate specification compliance
      const compliance = await specificationFidelityAgent.validateSpecificationCompliance(specification);
      expect(compliance.specificationId).toBe(specification.id);
      expect(compliance.complianceScore).toBeGreaterThan(0);

      console.log('✅ Specification fidelity workflow completed successfully');
    });

    it('should handle specification fidelity monitoring', async () => {
      const specification: AgentSpecification = {
        id: 'monitored-spec',
        role: 'MonitoredSystem',
        capabilities: [],
        interfaces: [],
        behaviors: [],
        constraints: [],
        validationRules: [],
        dependencies: [],
        designIntent: {
          purpose: 'Test monitoring capabilities',
          userGoals: ['Monitor system health'],
          successMetrics: [],
          designPrinciples: [],
          accessibilityRequirements: []
        },
        userRequirements: []
      };

      // Start monitoring
      await specificationFidelityAgent.startFidelityMonitoring(specification.id);
      
      // Get metrics
      const metrics = await specificationFidelityAgent.getFidelityMetrics(specification.id);
      expect(metrics.specificationId).toBe(specification.id);

      // Stop monitoring
      await specificationFidelityAgent.stopFidelityMonitoring(specification.id);

      console.log('✅ Specification fidelity monitoring completed successfully');
    });
  });

  describe('End-to-End Demo Testing Workflow', () => {
    it('should complete full demo testing workflow', async () => {
      // 1. Create comprehensive demo test
      const demoTest = await demoTestingAgent.createDemoTest({
        name: 'Authentication System Demo',
        description: 'Comprehensive demo of authentication system',
        type: 'interactive',
        priority: 'high',
        participants: [
          {
            id: 'participant-001',
            name: 'Product Manager',
            role: 'stakeholder',
            availability: 'available',
            expertise: 'intermediate'
          },
          {
            id: 'participant-002',
            name: 'Security Engineer',
            role: 'tester',
            availability: 'available',
            expertise: 'expert'
          },
          {
            id: 'participant-003',
            name: 'End User',
            role: 'end-user',
            availability: 'available',
            expertise: 'beginner'
          }
        ],
        scenarios: [
          {
            id: 'scenario-auth-001',
            name: 'User Registration Demo',
            description: 'Demonstrate user registration process',
            type: 'happy-path',
            priority: 'high',
            status: 'pending',
            steps: [
              {
                id: 'step-reg-demo-001',
                name: 'Navigate to registration page',
                description: 'Navigate to the user registration page',
                action: 'Open registration form',
                expectedResult: 'Registration form is displayed',
                status: 'pending'
              },
              {
                id: 'step-reg-demo-002',
                name: 'Enter registration details',
                description: 'Enter valid registration information',
                action: 'Fill in email and password',
                expectedResult: 'Form accepts input',
                status: 'pending'
              },
              {
                id: 'step-reg-demo-003',
                name: 'Submit registration',
                description: 'Submit the registration form',
                action: 'Click register button',
                expectedResult: 'Account is created',
                status: 'pending'
              }
            ],
            expectedOutcomes: ['User account is created successfully', 'Verification email is sent'],
            acceptanceCriteria: ['ac-reg-001', 'ac-reg-002'],
            metadata: { priority: 'high' }
          },
          {
            id: 'scenario-auth-002',
            name: 'User Login Demo',
            description: 'Demonstrate user login process',
            type: 'happy-path',
            priority: 'critical',
            status: 'pending',
            steps: [
              {
                id: 'step-login-demo-001',
                name: 'Navigate to login page',
                description: 'Navigate to the user login page',
                action: 'Open login form',
                expectedResult: 'Login form is displayed',
                status: 'pending'
              },
              {
                id: 'step-login-demo-002',
                name: 'Enter credentials',
                description: 'Enter valid login credentials',
                action: 'Enter email and password',
                expectedResult: 'Form accepts credentials',
                status: 'pending'
              },
              {
                id: 'step-login-demo-003',
                name: 'Submit login',
                description: 'Submit the login form',
                action: 'Click login button',
                expectedResult: 'User is authenticated',
                status: 'pending'
              }
            ],
            expectedOutcomes: ['User is logged in successfully', 'Session is created'],
            acceptanceCriteria: ['ac-login-001', 'ac-login-002'],
            metadata: { priority: 'critical' }
          },
          {
            id: 'scenario-auth-003',
            name: 'Password Reset Demo',
            description: 'Demonstrate password reset functionality',
            type: 'happy-path',
            priority: 'medium',
            status: 'pending',
            steps: [
              {
                id: 'step-reset-demo-001',
                name: 'Navigate to password reset page',
                description: 'Navigate to the password reset page',
                action: 'Open password reset form',
                expectedResult: 'Reset form is displayed',
                status: 'pending'
              },
              {
                id: 'step-reset-demo-002',
                name: 'Enter email address',
                description: 'Enter email address for password reset',
                action: 'Enter email for password reset',
                expectedResult: 'Email is accepted',
                status: 'pending'
              },
              {
                id: 'step-reset-demo-003',
                name: 'Submit reset request',
                description: 'Submit the password reset request',
                action: 'Click reset button',
                expectedResult: 'Reset email is sent',
                status: 'pending'
              }
            ],
            expectedOutcomes: ['Reset email is sent', 'Reset token is generated'],
            acceptanceCriteria: ['ac-reset-001'],
            metadata: { priority: 'medium' }
          }
        ],
        acceptanceCriteria: ['ac-reg-001', 'ac-reg-002', 'ac-login-001', 'ac-login-002', 'ac-reset-001'],
        specifications: ['auth-system-spec'],
        feedback: [],
        scheduledAt: new Date(),
        environment: {
          id: 'env-demo-auth',
          name: 'Authentication Demo Environment',
          type: 'demo',
          url: 'https://auth-demo.example.com',
          configuration: { enableDemoMode: true },
          status: 'available'
        }
      });

      expect(demoTest.id).toBeDefined();
      expect(demoTest.name).toBe('Authentication System Demo');
      expect(demoTest.scenarios.length).toBe(3);
      expect(demoTest.participants.length).toBe(3);

      // 2. Execute demo test
      const executedTest = await demoTestingAgent.executeDemoTest(demoTest.id);
      expect(executedTest.status).toBe('completed');
      expect(executedTest.metrics.totalScenarios).toBe(3);
      expect(executedTest.metrics.completedScenarios).toBe(3);

      // 3. Collect feedback from participants
      const feedback1 = await demoTestingAgent.collectDemoFeedback(demoTest.id, {
        participantId: 'participant-001',
        participantName: 'Product Manager',
        rating: 5,
        category: 'functionality',
        comments: 'Excellent functionality, meets all requirements'
      });

      const feedback2 = await demoTestingAgent.collectDemoFeedback(demoTest.id, {
        participantId: 'participant-002',
        participantName: 'Security Engineer',
        rating: 4,
        category: 'security',
        comments: 'Good security implementation, minor improvements needed'
      });

      const feedback3 = await demoTestingAgent.collectDemoFeedback(demoTest.id, {
        participantId: 'participant-003',
        participantName: 'End User',
        rating: 5,
        category: 'usability',
        comments: 'Very easy to use, intuitive interface'
      });

      expect(feedback1.rating).toBe(5);
      expect(feedback2.rating).toBe(4);
      expect(feedback3.rating).toBe(5);

      // 4. Analyze feedback
      const feedbackAnalysis = await demoTestingAgent.analyzeDemoFeedback(demoTest.id);
      expect(feedbackAnalysis.testId).toBe(demoTest.id);
      expect(feedbackAnalysis.overallSatisfaction).toBeGreaterThan(4);
      expect(feedbackAnalysis.participantEngagement).toBe(100);

      // 5. Execute the demo test to calculate metrics
      const executedDemoTest = await demoTestingAgent.executeDemoTest(demoTest.id);
      expect(executedDemoTest.status).toBe('completed');

      // 6. Validate against acceptance criteria
      const acceptanceValidation = await demoTestingAgent.validateAgainstAcceptanceCriteria(demoTest.id);
      expect(acceptanceValidation.result).toBe(true);

      // 7. Validate specification fidelity
      const fidelityValidation = await demoTestingAgent.validateSpecificationFidelity(demoTest.id);
      expect(fidelityValidation.result).toBe(true);

      // 7. Generate comprehensive report
      const comprehensiveReport = await demoTestingAgent.generateComprehensiveDemoReport(demoTest.id);
      expect(comprehensiveReport).toContain('Comprehensive Demo Test Report');
      expect(comprehensiveReport).toContain(demoTest.id);

      // 8. Generate test result
      const testResult = await demoTestingAgent.generateDemoTestResult(demoTest.id);
      expect(testResult.testId).toBe(demoTest.id);
      expect(['passed', 'failed', 'partial']).toContain(testResult.status);

      console.log('✅ Demo testing workflow completed successfully');
    });

    it('should handle demo test with different types', async () => {
      // Interactive demo
      const interactiveDemo = await demoTestingAgent.createDemoTest({
        name: 'Interactive UI Demo',
        description: 'Interactive user interface demonstration',
        type: 'interactive',
        priority: 'high',
        participants: [
          {
            id: 'participant-004',
            name: 'UI Designer',
            role: 'tester',
            availability: 'available',
            expertise: 'expert'
          }
        ],
        scenarios: [],
        acceptanceCriteria: [],
        specifications: [],
        feedback: [],
        scheduledAt: new Date(),
        environment: {
          id: 'env-interactive',
          name: 'Interactive Environment',
          type: 'staging',
          url: 'https://interactive.example.com',
          configuration: {},
          status: 'available'
        }
      });

      expect(interactiveDemo.type).toBe('interactive');

      // Automated demo
      const automatedDemo = await demoTestingAgent.createDemoTest({
        name: 'Automated API Demo',
        description: 'Automated API testing demonstration',
        type: 'automated',
        priority: 'high',
        participants: [],
        scenarios: [
          {
            id: 'scenario-api-001',
            name: 'API Endpoint Test',
            description: 'Test API endpoints',
            type: 'happy-path',
            priority: 'high',
            status: 'pending',
            steps: [
              {
                id: 'step-api-001',
                name: 'Send API request',
                description: 'Send HTTP request to test API endpoint',
                action: 'Send HTTP request to endpoint',
                expectedResult: 'API responds correctly',
                status: 'pending'
              }
            ],
            expectedOutcomes: ['API responds with correct data'],
            acceptanceCriteria: [],
            metadata: {}
          }
        ],
        acceptanceCriteria: [],
        specifications: [],
        feedback: [],
        scheduledAt: new Date(),
        environment: {
          id: 'env-automated',
          name: 'Automated Environment',
          type: 'staging',
          url: 'https://api.example.com',
          configuration: {},
          status: 'available'
        }
      });

      expect(automatedDemo.type).toBe('automated');

      // Execute automated demo
      const executedAutomatedDemo = await demoTestingAgent.executeDemoTest(automatedDemo.id);
      expect(executedAutomatedDemo.status).toBe('completed');

      console.log('✅ Different demo types handled successfully');
    });
  });

  describe('Integrated System Workflow', () => {
    it('should complete full integrated workflow with all three systems', async () => {
      // 1. Create acceptance criteria
      const criteria = await acceptanceCriteriaAgent.createAcceptanceCriteria({
        name: 'Integrated System Test',
        description: 'Test integration between acceptance criteria, fidelity, and demo testing',
        type: 'functional',
        priority: 'critical',
        status: 'pending',
        criteria: [
          'System components integrate correctly',
          'Data flows between components',
          'Error handling works properly',
          'Performance meets requirements'
        ],
        testCases: [
          {
            id: 'test-integration-001',
            name: 'Component Integration Test',
            description: 'Test component integration',
            type: 'integration',
            status: 'pending',
            steps: [
              {
                id: 'step-integration-001',
                name: 'Initialize components',
                action: 'Start all system components',
                expectedOutcome: 'All components are running',
                status: 'pending'
              },
              {
                id: 'step-integration-002',
                name: 'Test communication',
                action: 'Send test messages between components',
                expectedOutcome: 'Communication works correctly',
                status: 'pending'
              }
            ],
            expectedResult: 'Components integrate successfully',
            metadata: {}
          }
        ],
        validationRules: [],
        dependencies: [],
        estimatedEffort: 20
      });

      // 2. Create specification
      const specification: AgentSpecification = {
        id: 'integrated-system-spec',
        role: 'IntegratedSystem',
        capabilities: [
          {
            id: 'cap-integration-001',
            name: 'System Integration',
            description: 'Integrate multiple system components',
            inputs: [
              {
                name: 'component_configs',
                type: 'object',
                description: 'Configuration objects for all system components',
                required: true
              }
            ],
            outputs: [
              {
                name: 'integration_status',
                type: 'string',
                description: 'The overall status of the system integration',
                required: true
              }
            ],
            preconditions: [
              {
                id: 'pre-all-components-available',
                expression: 'component_configs !== null && component_configs !== undefined && Object.keys(component_configs).length > 0',
                description: 'All necessary system components must be available and operational',
                operator: 'and'
              }
            ],
            postconditions: [
              {
                id: 'post-system-integrated',
                expression: 'integration_status === "success"',
                description: 'All system components must be successfully integrated and functioning',
                operator: 'and'
              }
            ]
          }
        ],
        interfaces: [
          {
            id: 'iface-integration-001',
            name: 'IntegrationInterface',
            methods: [
              {
                name: 'integrate',
                description: 'Initiate the integration process for all system components',
                parameters: [],
                returnType: 'void'
              },
              {
                name: 'validate',
                description: 'Perform a comprehensive validation of the integrated system',
                parameters: [],
                returnType: 'void'
              },
              {
                name: 'monitor',
                description: 'Continuously monitor the integrated system for health and performance',
                parameters: [],
                returnType: 'void'
              }
            ],
            events: [
              {
                name: 'integration_started',
                description: 'Triggered when the integration process is initiated',
                payload: []
              },
              {
                name: 'integration_completed',
                description: 'Triggered when the integration process is successfully completed',
                payload: []
              }
            ],
            properties: [
              {
                name: 'integration_timeout',
                type: 'number',
                description: 'The maximum duration in milliseconds for the integration process',
                readonly: false
              },
              {
                name: 'retry_count',
                type: 'number',
                description: 'The number of times to retry the integration process on failure',
                readonly: false
              }
            ]
          }
        ],
        behaviors: [],
        constraints: [],
        validationRules: [],
        dependencies: [],
        designIntent: {
          purpose: 'Demonstrate integrated system capabilities',
          userGoals: ['Seamless integration', 'Reliable operation'],
          successMetrics: [],
          designPrinciples: ['Modularity', 'Reliability'],
          accessibilityRequirements: []
        },
        userRequirements: [
          {
            id: 'req-system-integration',
            description: 'As a system administrator, I want components to integrate seamlessly',
            priority: 'critical',
            userStory: 'As a system administrator, I want components to integrate seamlessly',
            acceptanceCriteria: ['Components communicate', 'Data flows correctly', 'Errors are handled'],
            persona: 'System Administrator'
          }
        ]
      };

      // 3. Check specification fidelity
      const fidelityChecks = await specificationFidelityAgent.validateSpecificationFidelity(specification);
      expect(fidelityChecks.length).toBeGreaterThan(0);

      // 4. Create demo test for integrated workflow
      const demoTest = await demoTestingAgent.createDemoTest({
        name: 'Integrated System Demo',
        description: 'Demonstrate integrated system functionality',
        type: 'interactive',
        priority: 'critical',
        participants: [
          {
            id: 'participant-integrated-001',
            name: 'System Administrator',
            role: 'stakeholder',
            availability: 'available',
            expertise: 'expert'
          }
        ],
        scenarios: [
          {
            id: 'scenario-integrated-001',
            name: 'System Integration Demo',
            description: 'Demonstrate system integration',
            type: 'happy-path',
            priority: 'critical',
            status: 'pending',
            steps: [
              {
                id: 'step-demo-integration-001',
                name: 'Start integrated system',
                description: 'Initialize all system components for integration testing',
                action: 'Initialize all components',
                expectedResult: 'System starts successfully',
                status: 'pending'
              },
              {
                id: 'step-demo-integration-002',
                name: 'Test integration',
                description: 'Test communication between system components',
                action: 'Test component communication',
                expectedResult: 'Integration works correctly',
                status: 'pending'
              }
            ],
            expectedOutcomes: ['System integrates successfully', 'All components communicate'],
            acceptanceCriteria: [criteria.id],
            metadata: {}
          }
        ],
        acceptanceCriteria: [criteria.id],
        specifications: [specification.id],
        feedback: [],
        scheduledAt: new Date(),
        environment: {
          id: 'env-integrated',
          name: 'Integrated System Environment',
          type: 'demo',
          url: 'https://integrated.example.com',
          configuration: { enableIntegration: true },
          status: 'available'
        }
      });

      // 5. Execute all workflows
      const criteriaExecution = await acceptanceCriteriaAgent.executeAcceptanceCriteria(criteria.id);
      const demoExecution = await demoTestingAgent.executeDemoTest(demoTest.id);
      const fidelityReport = await specificationFidelityAgent.generateFidelityReport(specification.id);

      expect(criteriaExecution.result).toBe(true);
      expect(demoExecution.status).toBe('completed');
      expect(fidelityReport.specificationId).toBe(specification.id);
      expect(fidelityReport.overallScore).toBeGreaterThan(0);
      expect(fidelityReport.checks.length).toBeGreaterThan(0);

      // 6. Generate comprehensive reports
      const criteriaReport = await acceptanceCriteriaAgent.generateTestReport(criteria.id);
      const demoReport = await demoTestingAgent.generateComprehensiveDemoReport(demoTest.id);
      const comprehensiveFidelityReport = await specificationFidelityAgent.generateComprehensiveReport(specification.id);

      expect(criteriaReport).toContain('Integrated Test Report');
      expect(demoReport).toContain('Comprehensive Demo Test Report');
      expect(comprehensiveFidelityReport).toContain('Comprehensive Specification Fidelity Report');

      console.log('✅ Full integrated workflow completed successfully');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle invalid acceptance criteria gracefully', async () => {
      try {
        await acceptanceCriteriaAgent.createAcceptanceCriteria({
          name: '', // Invalid: empty name
          description: 'Test invalid criteria',
          type: 'functional',
          priority: 'medium',
          status: 'pending',
          criteria: [], // Invalid: empty criteria
          testCases: [],
          validationRules: [],
          dependencies: [],
          estimatedEffort: 4
        });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle incomplete specifications gracefully', async () => {
      const incompleteSpec: AgentSpecification = {
        id: 'incomplete-spec',
        role: 'IncompleteSystem',
        capabilities: [],
        interfaces: [],
        behaviors: [],
        constraints: [],
        validationRules: [],
        dependencies: [],
        designIntent: {
          purpose: 'Test incomplete specification',
          userGoals: [],
          successMetrics: [],
          designPrinciples: [],
          accessibilityRequirements: []
        },
        userRequirements: [] // Missing requirements
      };

      const fidelityChecks = await specificationFidelityAgent.validateSpecificationFidelity(incompleteSpec);
      const failedChecks = fidelityChecks.filter(check => check.status === 'failed' || check.status === 'warning');
      
      expect(failedChecks.length).toBeGreaterThan(0);
    });

    it('should handle demo test failures gracefully', async () => {
      // Create failing demo test
      const failingDemo = await demoTestingAgent.createDemoTest({
        name: 'Failing Demo Test',
        description: 'Demo test that will fail',
        type: 'interactive',
        priority: 'high',
        participants: [],
        scenarios: [
          {
            id: 'scenario-fail-001',
            name: 'Failing Scenario',
            description: 'Scenario that will fail',
            type: 'happy-path',
            priority: 'high',
            status: 'pending',
            steps: [
              {
                id: 'step-fail-001',
                name: 'Failing step',
                description: 'Perform an action that will intentionally fail',
                action: 'Perform action that will fail',
                expectedResult: 'This will fail',
                status: 'pending'
              }
            ],
            expectedOutcomes: ['This will not happen'],
            acceptanceCriteria: [],
            metadata: {}
          }
        ],
        acceptanceCriteria: [],
        specifications: [],
        feedback: [],
        scheduledAt: new Date(),
        environment: {
          id: 'env-fail',
          name: 'Failing Environment',
          type: 'staging',
          url: 'https://fail.example.com',
          configuration: {},
          status: 'available'
        }
      });

      const result = await demoTestingAgent.executeDemoTest(failingDemo.id);
      expect(result.status).toBe('failed');
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle multiple concurrent workflows efficiently', async () => {
      const startTime = Date.now();
      
      // Create multiple concurrent workflows
      const workflows = Array.from({ length: 5 }, async (_, i) => {
        // Create acceptance criteria
        const criteria = await acceptanceCriteriaAgent.createAcceptanceCriteria({
          name: `Concurrent Criteria ${i}`,
          description: `Concurrent acceptance criteria ${i}`,
          type: 'functional',
          priority: 'medium',
          status: 'pending',
          criteria: [`Criterion ${i}`],
          testCases: [],
          validationRules: [],
          dependencies: [],
          estimatedEffort: 4
        });

        // Create specification
        const specification: AgentSpecification = {
          id: `concurrent-spec-${i}`,
          role: `ConcurrentSystem${i}`,
          capabilities: [],
          interfaces: [],
          behaviors: [],
          constraints: [],
          validationRules: [],
          dependencies: [],
          designIntent: {
            purpose: `Concurrent system ${i}`,
            userGoals: [`Goal ${i}`],
            successMetrics: [],
            designPrinciples: [],
            accessibilityRequirements: []
          },
          userRequirements: []
        };

        // Check fidelity
        await specificationFidelityAgent.validateSpecificationFidelity(specification);

        // Create demo test
        const demoTest = await demoTestingAgent.createDemoTest({
          name: `Concurrent Demo ${i}`,
          description: `Concurrent demo ${i}`,
          type: 'automated',
          priority: 'medium',
          participants: [],
          scenarios: [],
          acceptanceCriteria: [],
          specifications: [],
          feedback: [],
          scheduledAt: new Date(),
          environment: {
            id: `env-concurrent-${i}`,
            name: `Concurrent Environment ${i}`,
            type: 'staging',
            url: `https://concurrent${i}.example.com`,
            configuration: {},
            status: 'available'
          }
        });

        // Execute demo
        await demoTestingAgent.executeDemoTest(demoTest.id);

        return { criteria, specification, demoTest };
      });

      const results = await Promise.all(workflows);
      const endTime = Date.now();

      expect(results.length).toBe(5);
      expect(endTime - startTime).toBeLessThan(15000); // Should complete within 15 seconds

      console.log(`✅ Concurrent workflows completed in ${endTime - startTime}ms`);
    });
  });
}); 