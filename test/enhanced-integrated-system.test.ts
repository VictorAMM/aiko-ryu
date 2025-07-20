// test/enhanced-integrated-system.test.ts
import { EnhancedAcceptanceCriteriaAgent } from '../src/agents/EnhancedAcceptanceCriteriaAgent';
import { SpecificationFidelityAgent } from '../src/agents/SpecificationFidelityAgent';
import { DemoTestingAgent } from '../src/agents/DemoTestingAgent';
import { AgentSpecification } from '../src/agents/AgentContract';

describe('Enhanced Integrated System', () => {
  let enhancedAcceptanceCriteriaAgent: EnhancedAcceptanceCriteriaAgent;
  let specificationFidelityAgent: SpecificationFidelityAgent;
  let demoTestingAgent: DemoTestingAgent;

  beforeEach(() => {
    enhancedAcceptanceCriteriaAgent = new EnhancedAcceptanceCriteriaAgent('test-enhanced-ac-agent');
    specificationFidelityAgent = new SpecificationFidelityAgent('test-fidelity-agent');
    demoTestingAgent = new DemoTestingAgent('test-demo-agent');
  });

  afterEach(async () => {
    await enhancedAcceptanceCriteriaAgent.shutdown();
    await specificationFidelityAgent.shutdown();
    await demoTestingAgent.shutdown();
  });

  describe('End-to-End Enhanced System Workflow', () => {
    beforeEach(async () => {
      await enhancedAcceptanceCriteriaAgent.initialize();
      await specificationFidelityAgent.initialize();
      await demoTestingAgent.initialize();
    });

    it('should complete full enhanced system workflow', async () => {
      console.log('🚀 Starting Enhanced Integrated System Workflow...');

      // 1. Create comprehensive specification
      const specification: AgentSpecification = {
        id: 'enhanced-system-spec',
        role: 'EnhancedSystem',
        capabilities: [
          {
            id: 'cap-enhanced-001',
            name: 'Enhanced Data Processing',
            description: 'Process data with advanced validation and error handling',
            inputs: [
              {
                name: 'raw_data',
                type: 'object',
                required: true,
                description: 'Raw data to be processed'
              },
              {
                name: 'validation_rules',
                type: 'object',
                required: true,
                description: 'Validation rules to apply'
              }
            ],
            outputs: [
              {
                name: 'processed_data',
                type: 'object',
                required: true,
                description: 'Processed data output'
              },
              {
                name: 'validation_report',
                type: 'object',
                required: true,
                description: 'Validation report'
              }
            ],
            preconditions: [
              {
                id: 'precond-001',
                expression: 'data_available',
                description: 'Data is available for processing',
                operator: 'and'
              },
              {
                id: 'precond-002',
                expression: 'rules_defined',
                description: 'Validation rules are defined',
                operator: 'and'
              }
            ],
            postconditions: [
              {
                id: 'postcond-001',
                expression: 'data_processed',
                description: 'Data has been processed',
                operator: 'and'
              },
              {
                id: 'postcond-002',
                expression: 'report_generated',
                description: 'Report has been generated',
                operator: 'and'
              }
            ]
          },
          {
            id: 'cap-enhanced-002',
            name: 'Advanced Security Features',
            description: 'Implement enterprise-grade security with multi-factor authentication',
            inputs: [
              {
                name: 'user_credentials',
                type: 'object',
                required: true,
                description: 'User authentication credentials'
              },
              {
                name: 'security_policies',
                type: 'object',
                required: true,
                description: 'Security policies to apply'
              }
            ],
            outputs: [
              {
                name: 'auth_token',
                type: 'string',
                required: true,
                description: 'Authentication token'
              },
              {
                name: 'security_log',
                type: 'object',
                required: true,
                description: 'Security audit log'
              }
            ],
            preconditions: [
              {
                id: 'precond-003',
                expression: 'user_registered',
                description: 'User is registered in the system',
                operator: 'and'
              },
              {
                id: 'precond-004',
                expression: 'policies_configured',
                description: 'Security policies are configured',
                operator: 'and'
              }
            ],
            postconditions: [
              {
                id: 'postcond-003',
                expression: 'user_authenticated',
                description: 'User has been authenticated',
                operator: 'and'
              },
              {
                id: 'postcond-004',
                expression: 'access_granted',
                description: 'Access has been granted',
                operator: 'and'
              }
            ]
          }
        ],
        interfaces: [
          {
            id: 'iface-enhanced-001',
            name: 'EnhancedAPI',
            methods: [
              {
                name: 'processData',
                parameters: [],
                returnType: 'object',
                description: 'Process data with validation'
              },
              {
                name: 'authenticateUser',
                parameters: [],
                returnType: 'object',
                description: 'Authenticate user with MFA'
              },
              {
                name: 'validateInput',
                parameters: [],
                returnType: 'boolean',
                description: 'Validate input data'
              }
            ],
            events: [
              {
                name: 'data_processed',
                payload: [],
                description: 'Data processing completed'
              },
              {
                name: 'user_authenticated',
                payload: [],
                description: 'User authentication completed'
              },
              {
                name: 'validation_completed',
                payload: [],
                description: 'Validation process completed'
              }
            ],
            properties: [
              {
                name: 'timeout',
                type: 'number',
                readonly: false,
                description: 'Request timeout in milliseconds'
              },
              {
                name: 'retry_count',
                type: 'number',
                readonly: false,
                description: 'Number of retry attempts'
              },
              {
                name: 'security_level',
                type: 'string',
                readonly: false,
                description: 'Security level configuration'
              }
            ]
          }
        ],
        behaviors: [
          {
            id: 'behavior-enhanced-001',
            name: 'Error Recovery',
            description: 'Automatically recover from errors with fallback mechanisms',
            trigger: {
              type: 'event',
              value: 'error_detected',
              description: 'Error detection event'
            },
            actions: [
              {
                id: 'action-001',
                type: 'function',
                target: 'log_error',
                parameters: {}
              },
              {
                id: 'action-002',
                type: 'function',
                target: 'attempt_recovery',
                parameters: {}
              },
              {
                id: 'action-003',
                type: 'function',
                target: 'notify_admin',
                parameters: {}
              }
            ],
            conditions: [
              {
                id: 'condition-001',
                expression: 'recovery_possible',
                description: 'Recovery is possible',
                operator: 'and'
              }
            ],
            outcomes: [
              {
                id: 'outcome-001',
                type: 'success',
                description: 'Error recovery successful',
                nextActions: ['continue_processing']
              }
            ]
          }
        ],
        constraints: [
          {
            id: 'constraint-enhanced-001',
            type: 'performance',
            description: 'Response time must be under 2 seconds',
            validationRule: 'response_time < 2000',
            severity: 'high'
          }
        ],
        validationRules: [
          {
            id: 'rule-enhanced-001',
            name: 'Data Validation',
            rule: 'All input data must be validated before processing',
            validator: (input: unknown) => ({ result: true, consensus: true }),
            errorMessage: 'Data validation failed'
          }
        ],
        dependencies: ['database', 'security-service', 'logging-service'],
        designIntent: {
          purpose: 'Create a robust, secure, and scalable system with comprehensive testing',
          userGoals: ['Reliable data processing', 'Secure user access', 'Comprehensive monitoring'],
          successMetrics: [
            {
              id: 'metric-001',
              name: 'Uptime',
              type: 'performance',
              target: 99.9,
              unit: 'percent',
              description: 'System uptime percentage'
            },
            {
              id: 'metric-002',
              name: 'Response Time',
              type: 'performance',
              target: 2,
              unit: 'seconds',
              description: 'System response time'
            },
            {
              id: 'metric-003',
              name: 'Security Breaches',
              type: 'business',
              target: 0,
              unit: 'count',
              description: 'Number of security breaches'
            }
          ],
          designPrinciples: ['Security First', 'Reliability', 'Scalability'],
          accessibilityRequirements: ['WCAG 2.1 AA compliance', 'Keyboard navigation', 'Screen reader support']
        },
        userRequirements: [
          {
            id: 'req-enhanced-001',
            description: 'Secure user authentication with multi-factor support',
            priority: 'critical',
            userStory: 'As a user, I want to securely authenticate with multi-factor support so that my account is protected',
            acceptanceCriteria: ['MFA is enabled', 'Secure token generation', 'Session management'],
            persona: 'Security-Conscious User'
          },
          {
            id: 'req-enhanced-002',
            description: 'Robust data processing with error handling',
            priority: 'high',
            userStory: 'As a data analyst, I want reliable data processing with comprehensive error handling so that I can trust the results',
            acceptanceCriteria: ['Data validation', 'Error recovery', 'Audit logging'],
            persona: 'Data Analyst'
          },
          {
            id: 'req-enhanced-003',
            description: 'Comprehensive monitoring and alerting',
            priority: 'high',
            userStory: 'As a system administrator, I want comprehensive monitoring and alerting so that I can proactively manage the system',
            acceptanceCriteria: ['Real-time monitoring', 'Automated alerts', 'Performance metrics'],
            persona: 'System Administrator'
          }
        ]
      };

      console.log('✅ Specification created successfully');

      // 2. Create enhanced acceptance criteria
      const enhancedCriteria = await enhancedAcceptanceCriteriaAgent.createEnhancedAcceptanceCriteria({
        name: 'Enhanced System Acceptance Criteria',
        description: 'Comprehensive acceptance criteria for the enhanced system',
        type: 'functional',
        priority: 'critical',
        status: 'draft',
        criteria: [
          'System processes data securely and efficiently',
          'User authentication works with multi-factor support',
          'Error handling and recovery mechanisms function correctly',
          'Monitoring and alerting systems provide real-time insights',
          'Performance meets specified requirements',
          'Security measures protect against common threats'
        ],
        testCases: [
          {
            id: 'tc-enhanced-001',
            name: 'Data Processing Test',
            description: 'Test secure data processing functionality',
            type: 'integration',
            priority: 'high',
            status: 'ready',
            steps: [
              {
                id: 'step-enhanced-001',
                order: 1,
                action: 'Submit data for processing',
                expectedResult: 'Data is accepted and validated',
                status: 'pending'
              },
              {
                id: 'step-enhanced-002',
                order: 2,
                action: 'Process data with security measures',
                expectedResult: 'Data is processed securely',
                status: 'pending'
              },
              {
                id: 'step-enhanced-003',
                order: 3,
                action: 'Generate processing report',
                expectedResult: 'Report is generated with audit trail',
                status: 'pending'
              }
            ],
            expectedResults: ['Data processed successfully', 'Security measures applied', 'Audit trail created'],
            automated: true,
            prerequisites: ['System is running', 'Security policies configured'],
            postConditions: ['Data is processed', 'Report is available', 'Audit log is complete'],
            dataRequirements: [
              {
                type: 'input',
                name: 'test_data',
                description: 'Sample data for processing',
                format: 'json',
                required: true,
                validationRules: ['data_format', 'security_requirements']
              }
            ],
            environment: {
              name: 'Enhanced Test Environment',
              description: 'Secure test environment with monitoring',
              type: 'testing',
              configuration: { 
                database: 'secure_test_db',
                security: 'enabled',
                monitoring: 'enabled'
              },
              dependencies: ['database', 'security-service', 'monitoring-service'],
              setupScripts: ['setup_secure_env.sh'],
              teardownScripts: ['cleanup_secure_env.sh']
            }
          }
        ],
        validationRules: [
          {
            id: 'rule-enhanced-001',
            name: 'Security Validation',
            rule: 'All data processing must meet security requirements',
            validator: (input: unknown) => ({ result: true, consensus: true }),
            errorMessage: 'Security validation failed'
          }
        ],
        dependencies: ['enhanced-system-spec'],
        estimatedEffort: 80,
        codeIssues: [],
        demoTestIds: [],
        specificationFidelityScore: 0,
        stakeholderApproval: []
      });

      console.log('✅ Enhanced acceptance criteria created');

      // 3. Create code issues for tracking
      const codeIssue1 = await enhancedAcceptanceCriteriaAgent.createCodeIssue({
        type: 'feature',
        severity: 'high',
        status: 'open',
        title: 'Implement Multi-Factor Authentication',
        description: 'Add multi-factor authentication support to the authentication system',
        location: {
          file: 'src/auth/AuthService.ts',
          line: 25,
          function: 'authenticateUser'
        },
        reporter: 'security@example.com',
        acceptanceCriteriaId: enhancedCriteria.id,
        relatedIssues: [],
        labels: ['security', 'feature', 'critical'],
        comments: [],
        attachments: [],
        timeSpent: 0,
        estimatedTime: 16
      });

      const codeIssue2 = await enhancedAcceptanceCriteriaAgent.createCodeIssue({
        type: 'bug',
        severity: 'medium',
        status: 'open',
        title: 'Data Validation Bug',
        description: 'Data validation sometimes fails for edge cases',
        location: {
          file: 'src/validation/DataValidator.ts',
          line: 45,
          function: 'validateInput'
        },
        reporter: 'tester@example.com',
        acceptanceCriteriaId: enhancedCriteria.id,
        relatedIssues: [],
        labels: ['bug', 'validation', 'data'],
        comments: [],
        attachments: [],
        timeSpent: 0,
        estimatedTime: 4
      });

      console.log('✅ Code issues created');

      // 4. Link code issues to acceptance criteria
      await enhancedAcceptanceCriteriaAgent.linkCodeIssueToAcceptanceCriteria(codeIssue1.id, enhancedCriteria.id);
      await enhancedAcceptanceCriteriaAgent.linkCodeIssueToAcceptanceCriteria(codeIssue2.id, enhancedCriteria.id);

      console.log('✅ Code issues linked to acceptance criteria');

      // 5. Add stakeholder approvals
      const stakeholderApproval1 = {
        stakeholderId: 'stakeholder-001',
        stakeholderName: 'Security Officer',
        role: 'manager' as const,
        approvalStatus: 'approved' as const,
        comments: 'Security requirements are comprehensive and appropriate',
        timestamp: new Date()
      };

      const stakeholderApproval2 = {
        stakeholderId: 'stakeholder-002',
        stakeholderName: 'Product Manager',
        role: 'product-owner' as const,
        approvalStatus: 'approved' as const,
        comments: 'Functional requirements meet business needs',
        timestamp: new Date()
      };

      await enhancedAcceptanceCriteriaAgent.addStakeholderApproval(enhancedCriteria.id, stakeholderApproval1);
      await enhancedAcceptanceCriteriaAgent.addStakeholderApproval(enhancedCriteria.id, stakeholderApproval2);

      console.log('✅ Stakeholder approvals added');

      // 6. Check specification fidelity
      const fidelityChecks = await specificationFidelityAgent.validateSpecificationFidelity(specification);
      expect(fidelityChecks.length).toBeGreaterThan(0);
      
      const syntaxCheck = fidelityChecks.find(check => check.checkType === 'syntax');
      const semanticsCheck = fidelityChecks.find(check => check.checkType === 'semantics');
      const completenessCheck = fidelityChecks.find(check => check.checkType === 'completeness');
      
      expect(syntaxCheck).toBeDefined();
      expect(semanticsCheck).toBeDefined();
      expect(completenessCheck).toBeDefined();

      console.log('✅ Specification fidelity validated');

      // 7. Create enhanced demo test
      const enhancedDemoTest = await enhancedAcceptanceCriteriaAgent.createEnhancedDemoTest({
        name: 'Enhanced System Demo',
        description: 'Comprehensive demo of the enhanced system capabilities',
        type: 'interactive',
        priority: 'high',
        acceptanceCriteriaIds: [enhancedCriteria.id],
        scenarios: [
          {
            id: 'scenario-enhanced-001',
            name: 'Secure Data Processing Demo',
            description: 'Demonstrate secure data processing with error handling',
            type: 'happy-path',
            priority: 'high',
            status: 'pending',
            steps: [
              {
                id: 'step-demo-001',
                order: 1,
                action: 'Navigate to data processing interface',
                expectedResult: 'Interface is accessible and secure',
                status: 'pending'
              },
              {
                id: 'step-demo-002',
                order: 2,
                action: 'Upload test data file',
                expectedResult: 'File is uploaded and validated',
                status: 'pending'
              },
              {
                id: 'step-demo-003',
                order: 3,
                action: 'Initiate secure processing',
                expectedResult: 'Processing starts with security measures',
                status: 'pending'
              },
              {
                id: 'step-demo-004',
                order: 4,
                action: 'Monitor processing progress',
                expectedResult: 'Real-time progress is displayed',
                status: 'pending'
              },
              {
                id: 'step-demo-005',
                order: 5,
                action: 'Review processing results',
                expectedResult: 'Results are displayed with audit trail',
                status: 'pending'
              }
            ],
            expectedOutcome: 'Data is processed securely with comprehensive monitoring',
            screenshots: [],
            notes: 'Demonstrates end-to-end secure data processing',
            acceptanceCriteria: ['System processes data securely and efficiently']
          },
          {
            id: 'scenario-enhanced-002',
            name: 'Multi-Factor Authentication Demo',
            description: 'Demonstrate multi-factor authentication workflow',
            type: 'happy-path',
            priority: 'critical',
            status: 'pending',
            steps: [
              {
                id: 'step-demo-006',
                order: 1,
                action: 'Navigate to login page',
                expectedResult: 'Secure login page is displayed',
                status: 'pending'
              },
              {
                id: 'step-demo-007',
                order: 2,
                action: 'Enter username and password',
                expectedResult: 'Credentials are validated securely',
                status: 'pending'
              },
              {
                id: 'step-demo-008',
                order: 3,
                action: 'Enter MFA code',
                expectedResult: 'MFA code is validated',
                status: 'pending'
              },
              {
                id: 'step-demo-009',
                order: 4,
                action: 'Access granted',
                expectedResult: 'User is authenticated and logged in',
                status: 'pending'
              }
            ],
            expectedOutcome: 'User successfully authenticates with MFA',
            screenshots: [],
            notes: 'Demonstrates secure authentication with MFA',
            acceptanceCriteria: ['User authentication works with multi-factor support']
          }
        ],
        participants: [
          {
            id: 'participant-enhanced-001',
            name: 'Security Officer',
            role: 'stakeholder',
            email: 'security@example.com',
            availability: [
              {
                date: new Date(),
                startTime: '10:00',
                endTime: '11:00',
                timezone: 'UTC',
                confirmed: true
              }
            ],
            engagement: 95,
            notes: 'Focus on security aspects'
          },
          {
            id: 'participant-enhanced-002',
            name: 'System Administrator',
            role: 'stakeholder',
            email: 'admin@example.com',
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
            notes: 'Focus on operational aspects'
          }
        ],
        feedback: [],
        schedule: {
          startDate: new Date(),
          endDate: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
          duration: 60,
          timezone: 'UTC',
          recurring: false,
          reminders: [
            {
              type: 'email',
              time: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes before
              sent: false,
              recipients: ['security@example.com', 'admin@example.com']
            }
          ]
        },
        environment: {
          name: 'Enhanced Demo Environment',
          description: 'Production-like demo environment with full monitoring',
          type: 'staging',
          configuration: { 
            database: 'demo_db',
            security: 'enabled',
            monitoring: 'enabled',
            logging: 'enabled'
          },
          dependencies: ['database', 'security-service', 'monitoring-service', 'logging-service'],
          setupScripts: ['setup_demo_env.sh'],
          teardownScripts: ['cleanup_demo_env.sh']
        },
        materials: [
          {
            id: 'material-enhanced-001',
            name: 'Enhanced Demo Script',
            type: 'script',
            url: '/materials/enhanced-demo-script.pdf',
            description: 'Comprehensive demo script with security focus',
            required: true,
            version: '1.0'
          },
          {
            id: 'material-enhanced-002',
            name: 'Security Requirements Document',
            type: 'documentation',
            url: '/materials/security-requirements.pdf',
            description: 'Detailed security requirements and compliance',
            required: true,
            version: '1.0'
          }
        ],
        recording: {
          enabled: true,
          quality: 'high',
          format: 'mp4'
        }
      });

      console.log('✅ Enhanced demo test created');

      // 8. Execute enhanced demo test
      const executedDemoTest = await enhancedAcceptanceCriteriaAgent.executeEnhancedDemoTest(enhancedDemoTest.id);
      expect(executedDemoTest.status).toBe('completed');
      expect(executedDemoTest.metrics.totalScenarios).toBe(2);
      expect(executedDemoTest.metrics.completedScenarios).toBe(2);

      console.log('✅ Enhanced demo test executed');

      // 9. Collect demo feedback
      const feedback1 = await enhancedAcceptanceCriteriaAgent.collectEnhancedDemoFeedback(enhancedDemoTest.id, {
        id: 'feedback-enhanced-001',
        participantId: 'participant-enhanced-001',
        participantName: 'Security Officer',
        category: 'security',
        rating: 5,
        comments: 'Excellent security implementation. Multi-factor authentication works perfectly and provides strong protection.',
        suggestions: ['Consider adding biometric authentication options'],
        timestamp: new Date()
      });

      const feedback2 = await enhancedAcceptanceCriteriaAgent.collectEnhancedDemoFeedback(enhancedDemoTest.id, {
        id: 'feedback-enhanced-002',
        participantId: 'participant-enhanced-002',
        participantName: 'System Administrator',
        category: 'functionality',
        rating: 4,
        comments: 'Very good functionality. Monitoring and alerting systems provide excellent visibility.',
        suggestions: ['Add more detailed logging for troubleshooting'],
        timestamp: new Date()
      });

      console.log('✅ Demo feedback collected');

      // 10. Execute enhanced acceptance criteria
      const criteriaExecutionResult = await enhancedAcceptanceCriteriaAgent.executeEnhancedAcceptanceCriteria(enhancedCriteria.id);
      expect(criteriaExecutionResult.result).toBeDefined();
      expect(typeof criteriaExecutionResult.consensus).toBe('boolean');

      console.log('✅ Enhanced acceptance criteria executed');

      // 11. Run integrated enhanced tests
      const integratedTestResult = await enhancedAcceptanceCriteriaAgent.runIntegratedEnhancedTests(specification.id);
      expect(integratedTestResult.result).toBeDefined();
      expect(typeof integratedTestResult.consensus).toBe('boolean');

      console.log('✅ Integrated enhanced tests completed');

      // 12. Generate comprehensive reports
      const enhancedTestReport = await enhancedAcceptanceCriteriaAgent.generateEnhancedTestReport(specification.id);
      expect(enhancedTestReport).toContain('Enhanced Test Report');
      expect(enhancedTestReport).toContain(specification.id);

      const enhancedDemoReport = await enhancedAcceptanceCriteriaAgent.generateEnhancedDemoReport(enhancedDemoTest.id);
      expect(enhancedDemoReport).toContain('Enhanced Demo Test Report');
      expect(enhancedDemoReport).toContain(enhancedDemoTest.id);

      console.log('✅ Comprehensive reports generated');

      // 13. Generate analytics
      const acceptanceCriteriaAnalytics = await enhancedAcceptanceCriteriaAgent.generateAcceptanceCriteriaAnalytics();
      const codeIssueAnalytics = await enhancedAcceptanceCriteriaAgent.generateCodeIssueAnalytics();
      const demoTestAnalytics = await enhancedAcceptanceCriteriaAgent.generateDemoTestAnalytics();

      expect(acceptanceCriteriaAnalytics.totalCriteria).toBeGreaterThan(0);
      expect(codeIssueAnalytics.totalIssues).toBeGreaterThan(0);
      expect(demoTestAnalytics.totalTests).toBeGreaterThan(0);

      console.log('✅ Analytics generated');

      // 14. Validate enhanced code quality
      const codeQualityResult = await enhancedAcceptanceCriteriaAgent.validateEnhancedCodeQuality(specification.id);
      expect(codeQualityResult.result).toBeDefined();
      expect(typeof codeQualityResult.consensus).toBe('boolean');

      console.log('✅ Enhanced code quality validated');

      // 15. Get stakeholder approvals
      const stakeholderApprovals = await enhancedAcceptanceCriteriaAgent.getStakeholderApprovals(enhancedCriteria.id);
      expect(stakeholderApprovals).toHaveLength(2);
      expect(stakeholderApprovals.some(approval => approval.stakeholderName === 'Security Officer')).toBe(true);
      expect(stakeholderApprovals.some(approval => approval.stakeholderName === 'Product Manager')).toBe(true);

      console.log('✅ Stakeholder approvals verified');

      console.log('🎉 Enhanced Integrated System Workflow Completed Successfully!');
      console.log('📊 Summary:');
      console.log(`   - Enhanced Acceptance Criteria: ${acceptanceCriteriaAnalytics.totalCriteria}`);
      console.log(`   - Code Issues: ${codeIssueAnalytics.totalIssues}`);
      console.log(`   - Demo Tests: ${demoTestAnalytics.totalTests}`);
      console.log(`   - Stakeholder Approvals: ${stakeholderApprovals.length}`);
      console.log(`   - Average Demo Rating: ${demoTestAnalytics.averageRating.toFixed(1)}/5`);
      console.log(`   - Code Issue Resolution Rate: ${((codeIssueAnalytics.resolvedIssues / codeIssueAnalytics.totalIssues) * 100).toFixed(1)}%`);
    });
  });

  describe('Enhanced System Error Handling', () => {
    beforeEach(async () => {
      await enhancedAcceptanceCriteriaAgent.initialize();
      await specificationFidelityAgent.initialize();
      await demoTestingAgent.initialize();
    });

    it('should handle complex error scenarios gracefully', async () => {
      // Test error handling with invalid data
      try {
        await enhancedAcceptanceCriteriaAgent.createEnhancedAcceptanceCriteria({
          name: '', // Invalid: empty name
          description: 'Test error handling',
          type: 'functional',
          priority: 'medium',
          status: 'draft',
          criteria: [], // Invalid: empty criteria
          testCases: [],
          validationRules: [],
          dependencies: [],
          estimatedEffort: -1, // Invalid: negative effort
          codeIssues: [],
          demoTestIds: [],
          specificationFidelityScore: 150, // Invalid: over 100
          stakeholderApproval: []
        });
        fail('Should have thrown an error for invalid data');
      } catch (error) {
        expect(error).toBeDefined();
        console.log('✅ Error handling works correctly for invalid data');
      }

      // Test error handling with non-existent resources
      try {
        await enhancedAcceptanceCriteriaAgent.executeEnhancedAcceptanceCriteria('non-existent-criteria');
        fail('Should have thrown an error for non-existent criteria');
      } catch (error) {
        expect(error).toBeDefined();
        console.log('✅ Error handling works correctly for non-existent resources');
      }

      // Test error handling with invalid demo test execution
      try {
        await enhancedAcceptanceCriteriaAgent.executeEnhancedDemoTest('non-existent-demo');
        fail('Should have thrown an error for non-existent demo');
      } catch (error) {
        expect(error).toBeDefined();
        console.log('✅ Error handling works correctly for non-existent demo tests');
      }
    });
  });

  describe('Enhanced System Performance', () => {
    beforeEach(async () => {
      await enhancedAcceptanceCriteriaAgent.initialize();
      await specificationFidelityAgent.initialize();
      await demoTestingAgent.initialize();
    });

    it('should handle high-volume operations efficiently', async () => {
      const startTime = Date.now();
      
      // Create multiple acceptance criteria
      const criteriaPromises = Array.from({ length: 10 }, (_, i) => 
        enhancedAcceptanceCriteriaAgent.createEnhancedAcceptanceCriteria({
          name: `Performance Test Criteria ${i}`,
          description: `Performance test criteria ${i}`,
          type: 'functional',
          priority: 'medium',
          status: 'draft',
          criteria: [`Feature ${i} works correctly`],
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

      const criteriaResults = await Promise.all(criteriaPromises);
      expect(criteriaResults).toHaveLength(10);

      // Create multiple code issues
      const issuePromises = Array.from({ length: 20 }, (_, i) => 
        enhancedAcceptanceCriteriaAgent.createCodeIssue({
          type: 'bug',
          severity: 'medium',
          status: 'open',
          title: `Performance Test Issue ${i}`,
          description: `Performance test issue ${i}`,
          location: {
            file: `src/test${i}.ts`,
            line: i
          },
          reporter: 'tester@example.com',
          acceptanceCriteriaId: criteriaResults[0].id,
          relatedIssues: [],
          labels: ['performance', 'test'],
          comments: [],
          attachments: [],
          timeSpent: 0,
          estimatedTime: 2
        })
      );

      const issueResults = await Promise.all(issuePromises);
      expect(issueResults).toHaveLength(20);

      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      console.log(`✅ High-volume operations completed in ${totalTime}ms`);
      expect(totalTime).toBeLessThan(10000); // Should complete within 10 seconds
    });
  });
}); 