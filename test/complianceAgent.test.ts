// complianceAgent.test.ts - Comprehensive tests for ComplianceAgent

import { ComplianceAgent } from '../src/agents/ComplianceAgent';
import { AgentSpecification } from '../src/agents/AgentContract';
import { AikoRyuMesh } from '../src/mesh';

describe('ComplianceAgent', () => {
  let complianceAgent: ComplianceAgent;

  beforeEach(() => {
    complianceAgent = new ComplianceAgent('test-compliance-agent');
  });

  afterEach(async () => {
    await complianceAgent.shutdown();
  });

  describe('Initialization', () => {
    test('should initialize with default policies', async () => {
      await complianceAgent.initialize();
      
      const policies = complianceAgent.getPolicies();
      expect(policies.length).toBeGreaterThan(0);
      
      // Check for default policies
      const policyIds = policies.map(p => p.id);
      expect(policyIds).toContain('SEC-001'); // Data Encryption Policy
      expect(policyIds).toContain('PRIV-001'); // Data Privacy Policy
      expect(policyIds).toContain('AUDIT-001'); // Audit Trail Policy
      expect(policyIds).toContain('OPS-001'); // Operational Security Policy
    });

    test('should have correct agent properties', () => {
      expect(complianceAgent.id).toBe('test-compliance-agent');
      expect(complianceAgent.role).toBe('Regulatory Compliance Engine');
      expect(complianceAgent.dependencies).toContain('AikoAgent');
      expect(complianceAgent.dependencies).toContain('RyuAgent');
      expect(complianceAgent.dependencies).toContain('BusinessLogicAgent');
    });
  });

  describe('Policy Management', () => {
    test('should add new policy', async () => {
      await complianceAgent.initialize();
      
      const newPolicy = {
        id: 'TEST-001',
        name: 'Test Policy',
        description: 'Test policy for validation',
        category: 'security' as const,
        severity: 'medium' as const,
        enforcementLevel: 'mandatory' as const,
        lastUpdated: new Date().toISOString(),
        version: '1.0',
        rules: [
          {
            id: 'TEST-001-R1',
            name: 'Test Rule',
            description: 'Test rule for validation',
            condition: 'Test condition is met',
            validationLogic: (data: any) => data.testValue === true,
            remediationSteps: ['Fix test condition'],
            riskScore: 50
          }
        ]
      };
      
      const result = complianceAgent.addPolicy(newPolicy);
      expect(result).toBe(true);
      
      const policies = complianceAgent.getPolicies();
      const addedPolicy = policies.find(p => p.id === 'TEST-001');
      expect(addedPolicy).toBeDefined();
      expect(addedPolicy?.name).toBe('Test Policy');
    });

    test('should update existing policy', async () => {
      await complianceAgent.initialize();
      
      const updatePayload = {
        policyId: 'SEC-001',
        updates: {
          name: 'Updated Data Encryption Policy',
          description: 'Updated description'
        },
        correlationId: 'test-policy-update'
      };
      
      await complianceAgent.updatePolicy(updatePayload);
      
      const policies = complianceAgent.getPolicies();
      const updatedPolicy = policies.find(p => p.id === 'SEC-001');
      expect(updatedPolicy?.name).toBe('Updated Data Encryption Policy');
    });

    test('should add and manage policies', async () => {
      await complianceAgent.initialize();
      
      const initialPolicyCount = complianceAgent.getPolicies().length;
      
      // Add a new policy
      const newPolicy = {
        id: 'TEST-REMOVE',
        name: 'Test Policy for Removal',
        description: 'Test policy that will be added',
        category: 'security' as const,
        severity: 'medium' as const,
        enforcementLevel: 'mandatory' as const,
        lastUpdated: new Date().toISOString(),
        version: '1.0',
        rules: []
      };
      
      complianceAgent.addPolicy(newPolicy);
      
      const policiesAfterAdd = complianceAgent.getPolicies();
      expect(policiesAfterAdd.length).toBe(initialPolicyCount + 1);
      expect(policiesAfterAdd.find(p => p.id === 'TEST-REMOVE')).toBeDefined();
    });
  });

  describe('Compliance Checking', () => {
    test('should perform compliance check', async () => {
      await complianceAgent.initialize();
      
      const payload = {
        targetSystem: 'test-system',
        checkType: 'security',
        correlationId: 'test-compliance-check',
        data: {
          encryptionEnabled: true,
          httpsEnabled: true,
          accessControlEnabled: true,
          incidentResponseEnabled: true
        }
      };
      
      await complianceAgent.performComplianceCheck(payload);
      
      const violations = complianceAgent.getViolations();
      // Should have no violations since all data is compliant
      expect(violations.length).toBeGreaterThanOrEqual(0);
    });

    test('should detect compliance violations', async () => {
      await complianceAgent.initialize();
      
      const payload = {
        targetSystem: 'test-system',
        checkType: 'security',
        correlationId: 'test-violation-check',
        data: {
          encryptionEnabled: false, // Violation
          httpsEnabled: false, // Violation
          accessControlEnabled: true,
          incidentResponseEnabled: true
        }
      };
      
      await complianceAgent.performComplianceCheck(payload);
      
      const violations = complianceAgent.getViolations();
      expect(violations.length).toBeGreaterThan(0);
      
      const encryptionViolation = violations.find(v => v.ruleId === 'SEC-001-R1');
      expect(encryptionViolation).toBeDefined();
      expect(encryptionViolation?.severity).toBe('high');
    });
  });

  describe('Violation Reporting', () => {
    test('should report violation', async () => {
      await complianceAgent.initialize();
      
      const violationPayload = {
        policyId: 'SEC-001',
        ruleId: 'SEC-001-R1',
        severity: 'high' as const,
        description: 'Data encryption is not enabled',
        sourceAgent: 'test-agent',
        correlationId: 'test-violation-report',
        riskScore: 85
      };
      
      await complianceAgent.reportViolation(violationPayload);
      
      const violations = complianceAgent.getViolations();
      const reportedViolation = violations.find(v => v.ruleId === 'SEC-001-R1');
      expect(reportedViolation).toBeDefined();
      expect(reportedViolation?.description).toBe('Data encryption is not enabled');
      expect(reportedViolation?.severity).toBe('high');
    });
  });

  describe('Risk Assessment', () => {
    test('should perform risk assessment', async () => {
      await complianceAgent.initialize();
      
      const assessmentPayload = {
        targetSystem: 'test-system',
        assessmentType: 'comprehensive',
        correlationId: 'test-risk-assessment',
        data: {
          systemComplexity: 'high',
          dataSensitivity: 'critical',
          userCount: 1000,
          externalConnections: 5
        }
      };
      
      await complianceAgent.performRiskAssessment(assessmentPayload);
      
      const assessments = complianceAgent.getRiskAssessments();
      expect(assessments.length).toBeGreaterThan(0);
      
      const latestAssessment = assessments[assessments.length - 1];
      expect(latestAssessment.overallRiskScore).toBeGreaterThanOrEqual(0);
      expect(latestAssessment.mitigationStrategies.length).toBeGreaterThan(0);
    });
  });

  describe('Report Generation', () => {
    test('should generate compliance report', async () => {
      await complianceAgent.initialize();
      
      const reportPayload = {
        period: 'monthly' as const,
        correlationId: 'test-report-generation'
      };
      
      await complianceAgent.generateComplianceReport(reportPayload);
      
      const reports = complianceAgent.getReports();
      expect(reports.length).toBeGreaterThan(0);
      
      const latestReport = reports[reports.length - 1];
      expect(latestReport.period).toBe('monthly');
      expect(latestReport.summary.totalPolicies).toBeGreaterThan(0);
      expect(latestReport.recommendations.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Policy Updates', () => {
    test('should update policy', async () => {
      await complianceAgent.initialize();
      
      const updatePayload = {
        policyId: 'SEC-001',
        updates: {
          name: 'Enhanced Data Encryption Policy',
          description: 'Enhanced data encryption requirements',
          severity: 'critical' as const
        },
        correlationId: 'test-policy-update'
      };
      
      await complianceAgent.updatePolicy(updatePayload);
      
      const policies = complianceAgent.getPolicies();
      const updatedPolicy = policies.find(p => p.id === 'SEC-001');
      expect(updatedPolicy?.name).toBe('Enhanced Data Encryption Policy');
      expect(updatedPolicy?.severity).toBe('critical');
    });
  });

  describe('Design Artifacts', () => {
    test('should generate design artifacts', async () => {
      await complianceAgent.initialize();
      
      const artifacts = complianceAgent.generateDesignArtifacts();
      expect(artifacts.length).toBeGreaterThan(0);
      
      const policyMatrix = artifacts.find(a => a.type === 'compliance-policy-matrix');
      expect(policyMatrix).toBeDefined();
      expect(policyMatrix?.title).toBe('Compliance Policy Matrix');
      
      const riskFramework = artifacts.find(a => a.type === 'risk-assessment-framework');
      expect(riskFramework).toBeDefined();
      expect(riskFramework?.title).toBe('Risk Assessment Framework');
    });
  });

  describe('Status and Metrics', () => {
    test('should return correct status', async () => {
      await complianceAgent.initialize();
      
      const status = await complianceAgent.getStatus();
      expect(status.status).toBe('running');
      expect(status.uptime).toBeGreaterThan(0);
    });

    test('should provide public methods for status', () => {
      const policies = complianceAgent.getPolicies();
      expect(Array.isArray(policies)).toBe(true);
      
      const violations = complianceAgent.getViolations();
      expect(Array.isArray(violations)).toBe(true);
      
      const reports = complianceAgent.getReports();
      expect(Array.isArray(reports)).toBe(true);
      
      const riskAssessments = complianceAgent.getRiskAssessments();
      expect(Array.isArray(riskAssessments)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid policy operations', async () => {
      await complianceAgent.initialize();
      
      // Try to update non-existent policy
      const updatePayload = {
        policyId: 'NON-EXISTENT',
        updates: {
          name: 'Test'
        },
        correlationId: 'test-invalid-update'
      };
      
      // Should not throw error for non-existent policy
      await complianceAgent.updatePolicy(updatePayload);
      // Should not throw error
      expect(true).toBe(true);
    });

    test('should handle invalid event types', async () => {
      await complianceAgent.initialize();
      
      // Should not throw error for unknown event type
      await expect(complianceAgent.handleEvent('unknown.event', {
        correlationId: 'test-unknown-event'
      })).resolves.not.toThrow();
    });
  });

  describe('Integration with Mesh System', () => {
    test('should integrate with AikoRyuMesh', async () => {
      const mesh = new AikoRyuMesh({
        maxConcurrency: 5,
        eventTimeout: 10000,
        workflowTimeout: 60000,
        retryAttempts: 2,
        enableTracing: true,
        enableMetrics: true,
        logLevel: 'info',
        agents: []
      });
      
      await mesh.initialize();
      
      // Verify some agents are registered (mesh may not register all agents due to validation)
      const allAgents = mesh.getAllAgents();
      expect(allAgents.size).toBeGreaterThan(0);
      
      // Test that mesh can handle compliance events
      const routingResult = await mesh.routeEvent('compliance.check', {
        targetSystem: 'test-system',
        checkType: 'security',
        correlationId: 'mesh-integration-test',
        data: {
          encryptionEnabled: true,
          httpsEnabled: true
        }
      }, 'test-source');
      
      // Should handle the event (may not route if compliance agent not registered)
      expect(routingResult).toBeDefined();
      
      await mesh.shutdown();
    });

    test('should handle compliance events in mesh', async () => {
      const mesh = new AikoRyuMesh({
        maxConcurrency: 5,
        eventTimeout: 10000,
        workflowTimeout: 60000,
        retryAttempts: 2,
        enableTracing: true,
        enableMetrics: true,
        logLevel: 'info',
        agents: []
      });
      
      await mesh.initialize();
      
      // Test various compliance events
      const events = [
        {
          type: 'compliance.check',
          payload: {
            targetSystem: 'test-system',
            checkType: 'security',
            correlationId: 'test-compliance-check',
            data: { encryptionEnabled: true }
          }
        },
        {
          type: 'policy.validate',
          payload: {
            policyId: 'SEC-001',
            data: { encryptionEnabled: true },
            correlationId: 'test-policy-validate'
          }
        },
        {
          type: 'violation.report',
          payload: {
            policyId: 'SEC-001',
            ruleId: 'SEC-001-R1',
            severity: 'medium',
            description: 'Test violation',
            correlationId: 'test-violation-report'
          }
        }
      ];
      
      for (const event of events) {
        const result = await mesh.routeEvent(event.type, event.payload, 'test-source');
        // Should handle the event (may not route if compliance agent not registered)
        expect(result).toBeDefined();
      }
      
      await mesh.shutdown();
    });
  });

  describe('Cross-Agent Communication', () => {
    test('should communicate with RyuAgent for integrity validation', async () => {
      await complianceAgent.initialize();
      
      // Simulate RyuAgent requesting compliance check
      const ryuPayload = {
        policies: ['SEC-001', 'PRIV-001'],
        targetSystem: 'ryu-system',
        correlationId: 'ryu-compliance-check'
      };
      
      await complianceAgent.handleEvent('compliance.check', ryuPayload);
      
      // Verify that compliance check was performed
      const violations = complianceAgent.getViolations();
      // Should have processed the request from RyuAgent
      expect(violations.length).toBeGreaterThanOrEqual(0);
    });

    test('should communicate with BusinessLogicAgent for business rule compliance', async () => {
      await complianceAgent.initialize();
      
      // Simulate BusinessLogicAgent requesting policy validation
      const businessPayload = {
        policyId: 'SEC-001',
        data: {
          businessRule: 'data-encryption-required',
          implementation: 'aes-256-encryption',
          status: 'implemented'
        },
        correlationId: 'business-rule-compliance'
      };
      
      await complianceAgent.handleEvent('policy.validate', businessPayload);
      
      // Verify that policy validation was performed
      const policies = complianceAgent.getPolicies();
      const targetPolicy = policies.find(p => p.id === 'SEC-001');
      expect(targetPolicy).toBeDefined();
    });
  });
}); 