// ComplianceAgent.ts - Regulatory Compliance Engine with Policy Enforcement and Risk Assessment

import { AgentContract, AgentSpecification, ValidationResult, EventPayload, TraceEvent, AgentStatus, UserInteraction, DesignArtifact } from './AgentContract';
import { AikoAgent } from './AikoAgent';
import { RyuAgent } from './RyuAgent';
import { BusinessLogicAgent } from './BusinessLogicAgent';

// Compliance-specific interfaces
interface CompliancePolicy {
  id: string;
  name: string;
  description: string;
  category: 'security' | 'privacy' | 'data-protection' | 'audit' | 'operational';
  severity: 'low' | 'medium' | 'high' | 'critical';
  rules: ComplianceRule[];
  enforcementLevel: 'advisory' | 'mandatory' | 'blocking';
  lastUpdated: string;
  version: string;
}

// Data validation interfaces
interface SecurityValidationData {
  encryptionEnabled?: boolean;
  httpsEnabled?: boolean;
  accessControlEnabled?: boolean;
  incidentResponseEnabled?: boolean;
  [key: string]: unknown;
}

interface PrivacyValidationData {
  dataMinimization?: boolean;
  consentObtained?: boolean;
  dataRetention?: boolean;
  [key: string]: unknown;
}

interface AuditValidationData {
  auditLoggingEnabled?: boolean;
  logIntegrity?: boolean;
  logRetention?: boolean;
  [key: string]: unknown;
}

interface OperationalValidationData {
  accessControlEnabled?: boolean;
  incidentResponseEnabled?: boolean;
  backupEnabled?: boolean;
  [key: string]: unknown;
}

type ValidationData = SecurityValidationData | PrivacyValidationData | AuditValidationData | OperationalValidationData;

interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  condition: string; // Rule condition in natural language
  validationLogic: (data: ValidationData) => boolean;
  remediationSteps: string[];
  riskScore: number; // 0-100
}

interface ComplianceViolation {
  id: string;
  policyId: string;
  ruleId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  agentId: string;
  context: Record<string, unknown>;
  remediationStatus: 'pending' | 'in-progress' | 'resolved' | 'ignored';
  riskScore: number;
}

interface ComplianceReport {
  id: string;
  timestamp: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  summary: {
    totalPolicies: number;
    activeViolations: number;
    resolvedViolations: number;
    complianceScore: number; // 0-100
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  };
  violations: ComplianceViolation[];
  recommendations: string[];
  nextReviewDate: string;
}

interface RiskAssessment {
  id: string;
  timestamp: string;
  overallRiskScore: number; // 0-100
  riskFactors: {
    security: number;
    privacy: number;
    operational: number;
    regulatory: number;
  };
  mitigationStrategies: string[];
  reviewSchedule: string;
}

// Event payload interfaces
interface ComplianceCheckPayload {
  targetSystem?: string;
  checkType?: string;
  correlationId?: string;
  sourceAgent?: string;
  [key: string]: unknown;
}

interface PolicyValidationPayload {
  policyId?: string;
  data?: ValidationData;
  correlationId?: string;
  sourceAgent?: string;
  [key: string]: unknown;
}

interface ViolationReportPayload {
  policyId?: string;
  ruleId?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
  sourceAgent?: string;
  riskScore?: number;
  correlationId?: string;
  [key: string]: unknown;
}

export class ComplianceAgent implements AgentContract {
  readonly id: string;
  readonly role: string;
  readonly dependencies: string[];
  
  private aikoAgent: AikoAgent;
  private ryuAgent: RyuAgent;
  private businessLogicAgent: BusinessLogicAgent;
  
  // Compliance state
  private policies: Map<string, CompliancePolicy> = new Map();
  private violations: Map<string, ComplianceViolation> = new Map();
  private reports: Map<string, ComplianceReport> = new Map();
  private riskAssessments: Map<string, RiskAssessment> = new Map();
  private startTime: number = Date.now();
  
  // Compliance categories and their default policies
  private readonly defaultPolicies: CompliancePolicy[] = [
    {
      id: 'SEC-001',
      name: 'Data Encryption Policy',
      description: 'All sensitive data must be encrypted at rest and in transit',
      category: 'security',
      severity: 'high',
      enforcementLevel: 'mandatory',
      lastUpdated: new Date().toISOString(),
      version: '1.0',
      rules: [
        {
          id: 'SEC-001-R1',
          name: 'Encryption at Rest',
          description: 'Verify that all data storage uses encryption',
          condition: 'Data storage encryption is enabled',
          validationLogic: (data: SecurityValidationData) => data.encryptionEnabled === true,
          remediationSteps: ['Enable encryption for all data stores', 'Verify encryption keys are properly managed'],
          riskScore: 85
        },
        {
          id: 'SEC-001-R2',
          name: 'Encryption in Transit',
          description: 'Verify that all data transmission uses TLS/SSL',
          condition: 'All API endpoints use HTTPS',
          validationLogic: (data: SecurityValidationData) => data.httpsEnabled === true,
          remediationSteps: ['Configure HTTPS for all endpoints', 'Disable HTTP traffic'],
          riskScore: 90
        }
      ]
    },
    {
      id: 'PRIV-001',
      name: 'Data Privacy Policy',
      description: 'Personal data must be handled according to privacy regulations',
      category: 'privacy',
      severity: 'critical',
      enforcementLevel: 'blocking',
      lastUpdated: new Date().toISOString(),
      version: '1.0',
      rules: [
        {
          id: 'PRIV-001-R1',
          name: 'Data Minimization',
          description: 'Only collect data that is necessary for the stated purpose',
          condition: 'Data collection is limited to necessary fields',
          validationLogic: (data: PrivacyValidationData) => data.dataMinimization === true,
          remediationSteps: ['Review data collection practices', 'Remove unnecessary data fields'],
          riskScore: 95
        },
        {
          id: 'PRIV-001-R2',
          name: 'Consent Management',
          description: 'User consent must be properly obtained and managed',
          condition: 'Consent is obtained before data processing',
          validationLogic: (data: PrivacyValidationData) => data.consentObtained === true,
          remediationSteps: ['Implement consent management system', 'Audit existing consent records'],
          riskScore: 90
        }
      ]
    },
    {
      id: 'AUDIT-001',
      name: 'Audit Trail Policy',
      description: 'All system activities must be logged for audit purposes',
      category: 'audit',
      severity: 'high',
      enforcementLevel: 'mandatory',
      lastUpdated: new Date().toISOString(),
      version: '1.0',
      rules: [
        {
          id: 'AUDIT-001-R1',
          name: 'Comprehensive Logging',
          description: 'All system events must be logged with appropriate detail',
          condition: 'Audit logging is enabled for all system activities',
          validationLogic: (data: AuditValidationData) => data.auditLoggingEnabled === true,
          remediationSteps: ['Enable comprehensive audit logging', 'Configure log retention policies'],
          riskScore: 80
        },
        {
          id: 'AUDIT-001-R2',
          name: 'Log Integrity',
          description: 'Audit logs must be tamper-proof and verifiable',
          condition: 'Log integrity is maintained and verifiable',
          validationLogic: (data: AuditValidationData) => data.logIntegrity === true,
          remediationSteps: ['Implement log signing', 'Configure log verification'],
          riskScore: 85
        }
      ]
    },
    {
      id: 'OPS-001',
      name: 'Operational Security Policy',
      description: 'Operational procedures must follow security best practices',
      category: 'operational',
      severity: 'medium',
      enforcementLevel: 'advisory',
      lastUpdated: new Date().toISOString(),
      version: '1.0',
      rules: [
        {
          id: 'OPS-001-R1',
          name: 'Access Control',
          description: 'Access to systems must be properly controlled and monitored',
          condition: 'Access control is properly implemented',
          validationLogic: (data: OperationalValidationData) => data.accessControlEnabled === true,
          remediationSteps: ['Implement role-based access control', 'Monitor access patterns'],
          riskScore: 75
        },
        {
          id: 'OPS-001-R2',
          name: 'Incident Response',
          description: 'Security incidents must be properly handled and reported',
          condition: 'Incident response procedures are in place',
          validationLogic: (data: OperationalValidationData) => data.incidentResponseEnabled === true,
          remediationSteps: ['Establish incident response team', 'Create response procedures'],
          riskScore: 70
        }
      ]
    }
  ];

  constructor(id: string = 'compliance-agent') {
    this.id = id;
    this.role = 'Regulatory Compliance Engine';
    this.dependencies = ['AikoAgent', 'RyuAgent', 'BusinessLogicAgent'];
    
    // Initialize dependent agents
    this.aikoAgent = new AikoAgent('aiko-compliance');
    this.ryuAgent = new RyuAgent({});
    this.businessLogicAgent = new BusinessLogicAgent({});
  }

  async initialize(): Promise<void> {
    await this.aikoAgent.initialize();
    await this.ryuAgent.initialize();
    await this.businessLogicAgent.initialize();
    
    this.initializeDefaultPolicies();
    
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'compliance.agent.initialized',
      metadata: {
        correlationId: String(this.id),
        sourceAgent: String(this.id)
      }
    });
  }

  async handleEvent(eventType: string, payload: EventPayload): Promise<void> {
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'compliance.event.received',
      metadata: {
        correlationId: String(payload.correlationId || 'unknown'),
        sourceAgent: String(this.id)
      }
    });

    switch (eventType) {
      case 'compliance.check':
        await this.performComplianceCheck(payload as ComplianceCheckPayload);
        break;
      case 'compliance.validate':
        await this.validatePolicy(payload as PolicyValidationPayload);
        break;
      case 'compliance.violation':
        await this.reportViolation(payload as ViolationReportPayload);
        break;
      case 'compliance.risk.assess':
        await this.performRiskAssessment(payload);
        break;
      case 'compliance.report.generate':
        await this.generateComplianceReport(payload);
        break;
      case 'compliance.policy.update':
        await this.updatePolicy(payload);
        break;
      default:
        this.emitTrace({
          timestamp: new Date(),
          eventType: 'compliance.event.unknown',
          metadata: {
            correlationId: String(payload.correlationId || 'unknown'),
            sourceAgent: String(this.id)
          }
        });
    }
  }

  async shutdown(): Promise<void> {
    await this.aikoAgent.shutdown();
    await this.ryuAgent.shutdown();
    await this.businessLogicAgent.shutdown();
    
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'compliance.agent.shutdown',
      metadata: {
        correlationId: String(this.id),
        sourceAgent: String(this.id)
      }
    });
  }

  validateSpecification(spec: AgentSpecification): ValidationResult {
    const validationResult = this.validateAgainstPolicies(spec);
    
    return {
      result: validationResult.result,
      consensus: validationResult.result,
      reason: validationResult.reason
    };
  }

  generateDesignArtifacts(): DesignArtifact[] {
    const artifacts: DesignArtifact[] = [
      {
        id: 'compliance-policy-matrix',
        type: 'specification',
        content: {
          type: 'specification',
          data: this.generatePolicyMatrix(),
          metadata: {
            title: 'Compliance Policy Matrix',
            description: 'Mapping of policies to business requirements'
          },
          schema: 'compliance-policy-matrix-v1'
        },
        version: '1.0',
        createdAt: new Date(),
        validatedBy: [this.id]
      },
      {
        id: 'risk-assessment-framework',
        type: 'specification',
        content: {
          type: 'specification',
          data: this.generateRiskFramework(),
          metadata: {
            title: 'Risk Assessment Framework',
            description: 'Framework for assessing compliance risks'
          },
          schema: 'risk-assessment-framework-v1'
        },
        version: '1.0',
        createdAt: new Date(),
        validatedBy: [this.id]
      },
      {
        id: 'violation-tracking-system',
        type: 'specification',
        content: {
          type: 'specification',
          data: this.generateViolationTrackingSystem(),
          metadata: {
            title: 'Violation Tracking System',
            description: 'System for tracking and managing compliance violations'
          },
          schema: 'violation-tracking-system-v1'
        },
        version: '1.0',
        createdAt: new Date(),
        validatedBy: [this.id]
      }
    ];

    this.emitTrace({
      timestamp: new Date(),
      eventType: 'compliance.artifacts.generated',
      metadata: {
        correlationId: String(this.id),
        sourceAgent: String(this.id)
      }
    });

    return artifacts;
  }

  trackUserInteraction(interaction: UserInteraction): void {
    // Track compliance-related user interactions
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'compliance.user.interaction',
      metadata: {
        correlationId: String(interaction.sessionId || 'unknown'),
        sourceAgent: String(this.id)
      }
    });
  }

  emitTrace(event: TraceEvent): void {
    // Emit compliance-specific trace events
    console.log(`[${this.id}] ${event.eventType}: ${JSON.stringify(event.metadata)}`);
  }

  getStatus(): AgentStatus {
    return {
      status: 'running',
      lastEvent: 'compliance.check',
      lastTrace: {
        timestamp: new Date(),
        eventType: 'compliance.status',
        metadata: {
          correlationId: String(this.id),
          sourceAgent: String(this.id)
        }
      },
      uptime: Date.now() - this.startTime
    };
  }

  // Compliance-specific methods

  private initializeDefaultPolicies(): void {
    this.defaultPolicies.forEach(policy => {
      this.policies.set(policy.id, policy);
    });
  }

  async performComplianceCheck(payload: ComplianceCheckPayload): Promise<void> {
    const _targetSystem = payload.targetSystem;
    const _checkType = payload.checkType;
    
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'compliance.check.started',
      metadata: {
        correlationId: String(payload.correlationId || 'unknown'),
        sourceAgent: String(this.id)
      }
    });

    const violations: ComplianceViolation[] = [];
    
    // Check each policy
    for (const policy of this.policies.values()) {
      for (const rule of policy.rules) {
        const validationResult = await this.validateRule(rule, payload as ValidationData);
        if (!validationResult.isCompliant) {
          violations.push({
            id: `violation-${Date.now()}-${Math.random()}`,
            policyId: policy.id,
            ruleId: rule.id,
            severity: policy.severity,
            description: validationResult.reason,
            timestamp: new Date().toISOString(),
            agentId: this.id,
            context: payload,
            remediationStatus: 'pending',
            riskScore: rule.riskScore
          });
        }
      }
    }

    // Store violations
    violations.forEach(violation => {
      this.violations.set(violation.id, violation);
    });

    this.emitTrace({
      timestamp: new Date(),
      eventType: 'compliance.check.completed',
      metadata: {
        correlationId: String(payload.correlationId || 'unknown'),
        sourceAgent: String(this.id)
      }
    });
  }

  async validatePolicy(payload: PolicyValidationPayload): Promise<void> {
    const policyId = payload.policyId;
    const data = payload.data;
    const policy = this.policies.get(policyId || '');
    
    if (!policy) {
      throw new Error(`Policy ${policyId} not found`);
    }

    const validationResults = await Promise.all(
      policy.rules.map(rule => this.validateRule(rule, data || {}))
    );

    const _isCompliant = validationResults.every(result => result.isCompliant);
    
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'compliance.policy.validated',
      metadata: {
        correlationId: String(payload.correlationId || 'unknown'),
        sourceAgent: String(this.id)
      }
    });
  }

  async reportViolation(payload: ViolationReportPayload): Promise<void> {
    const violation: ComplianceViolation = {
      id: `violation-${Date.now()}-${Math.random()}`,
      policyId: payload.policyId || '',
      ruleId: payload.ruleId || '',
      severity: payload.severity || 'medium',
      description: payload.description || 'Unknown violation',
      timestamp: new Date().toISOString(),
      agentId: payload.sourceAgent || this.id,
      context: payload,
      remediationStatus: 'pending',
      riskScore: payload.riskScore || 50
    };

    this.violations.set(violation.id, violation);

    this.emitTrace({
      timestamp: new Date(),
      eventType: 'compliance.violation.reported',
      metadata: {
        correlationId: String(payload.correlationId || 'unknown'),
        sourceAgent: String(this.id)
      }
    });
  }

  async performRiskAssessment(payload: EventPayload): Promise<void> {
    const riskAssessment: RiskAssessment = {
      id: `risk-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
      overallRiskScore: this.calculateOverallRiskScore(),
      riskFactors: {
        security: this.calculateSecurityRisk(),
        privacy: this.calculatePrivacyRisk(),
        operational: this.calculateOperationalRisk(),
        regulatory: this.calculateRegulatoryRisk()
      },
      mitigationStrategies: this.generateMitigationStrategies(),
      reviewSchedule: this.calculateNextReviewDate()
    };

    this.riskAssessments.set(riskAssessment.id, riskAssessment);

    this.emitTrace({
      timestamp: new Date(),
      eventType: 'compliance.risk.assessed',
      metadata: {
        correlationId: String(payload.correlationId || 'unknown'),
        sourceAgent: String(this.id)
      }
    });
  }

  async generateComplianceReport(payload: EventPayload): Promise<void> {
    const report: ComplianceReport = {
      id: `report-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
      period: 'monthly',
      summary: {
        totalPolicies: this.policies.size,
        activeViolations: this.getActiveViolations().length,
        resolvedViolations: this.getResolvedViolations().length,
        complianceScore: this.calculateComplianceScore(),
        riskLevel: this.calculateRiskLevel()
      },
      violations: this.getActiveViolations(),
      recommendations: this.generateRecommendations(),
      nextReviewDate: this.calculateNextReviewDate()
    };

    this.reports.set(report.id, report);

    this.emitTrace({
      timestamp: new Date(),
      eventType: 'compliance.report.generated',
      metadata: {
        correlationId: String(payload.correlationId || 'unknown'),
        sourceAgent: String(this.id)
      }
    });
  }

  async updatePolicy(payload: EventPayload): Promise<void> {
    // Implementation for policy updates
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'compliance.policy.updated',
      metadata: {
        correlationId: String(payload.correlationId || 'unknown'),
        sourceAgent: String(this.id)
      }
    });
  }

  private async validateRule(rule: ComplianceRule, data: ValidationData): Promise<{ isCompliant: boolean; reason: string }> {
    try {
      const isCompliant = rule.validationLogic(data);
      return {
        isCompliant,
        reason: isCompliant ? 'Rule validation passed' : `Rule validation failed: ${rule.condition}`
      };
    } catch (error) {
      return {
        isCompliant: false,
        reason: `Rule validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private validateAgainstPolicies(_spec: AgentSpecification): { result: boolean; reason: string } {
    // Validate specification against compliance policies
    const complianceScore = this.calculateComplianceScore();
    const isCompliant = complianceScore >= 80;
    
    return {
      result: isCompliant,
      reason: isCompliant ? 'Specification meets compliance requirements' : 'Specification has compliance violations'
    };
  }

  private calculateComplianceScore(): number {
    const totalViolations = this.violations.size;
    const criticalViolations = Array.from(this.violations.values())
      .filter(v => v.severity === 'critical').length;
    const highViolations = Array.from(this.violations.values())
      .filter(v => v.severity === 'high').length;

    // Calculate score based on violations
    let score = 100;
    score -= criticalViolations * 20; // Critical violations heavily impact score
    score -= highViolations * 10; // High violations moderately impact score
    score -= (totalViolations - criticalViolations - highViolations) * 5; // Other violations slightly impact score

    return Math.max(0, Math.min(100, score));
  }

  private calculateOverallRiskScore(): number {
    const securityRisk = this.calculateSecurityRisk();
    const privacyRisk = this.calculatePrivacyRisk();
    const operationalRisk = this.calculateOperationalRisk();
    const regulatoryRisk = this.calculateRegulatoryRisk();

    // Weighted average of risk factors
    return (securityRisk * 0.3 + privacyRisk * 0.3 + operationalRisk * 0.2 + regulatoryRisk * 0.2);
  }

  private calculateSecurityRisk(): number {
    const securityViolations = Array.from(this.violations.values())
      .filter(v => v.policyId.startsWith('SEC-'));
    
    return Math.min(100, securityViolations.length * 15);
  }

  private calculatePrivacyRisk(): number {
    const privacyViolations = Array.from(this.violations.values())
      .filter(v => v.policyId.startsWith('PRIV-'));
    
    return Math.min(100, privacyViolations.length * 20);
  }

  private calculateOperationalRisk(): number {
    const operationalViolations = Array.from(this.violations.values())
      .filter(v => v.policyId.startsWith('OPS-'));
    
    return Math.min(100, operationalViolations.length * 10);
  }

  private calculateRegulatoryRisk(): number {
    const auditViolations = Array.from(this.violations.values())
      .filter(v => v.policyId.startsWith('AUDIT-'));
    
    return Math.min(100, auditViolations.length * 15);
  }

  private calculateRiskLevel(): 'low' | 'medium' | 'high' | 'critical' {
    const score = this.calculateComplianceScore();
    if (score >= 90) return 'low';
    if (score >= 70) return 'medium';
    if (score >= 50) return 'high';
    return 'critical';
  }

  private getActiveViolations(): ComplianceViolation[] {
    return Array.from(this.violations.values())
      .filter(v => v.remediationStatus === 'pending' || v.remediationStatus === 'in-progress');
  }

  private getResolvedViolations(): ComplianceViolation[] {
    return Array.from(this.violations.values())
      .filter(v => v.remediationStatus === 'resolved');
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const violations = this.getActiveViolations();

    if (violations.length > 0) {
      recommendations.push('Address active compliance violations promptly');
      recommendations.push('Implement automated compliance monitoring');
    }

    if (this.calculateComplianceScore() < 80) {
      recommendations.push('Conduct comprehensive compliance audit');
      recommendations.push('Enhance compliance training for team members');
    }

    if (this.calculateOverallRiskScore() > 70) {
      recommendations.push('Implement additional security controls');
      recommendations.push('Review and update risk mitigation strategies');
    }

    return recommendations;
  }

  private generateMitigationStrategies(): string[] {
    return [
      'Implement automated compliance monitoring',
      'Establish regular compliance reviews',
      'Enhance security controls',
      'Improve audit trail management',
      'Conduct regular risk assessments'
    ];
  }

  private calculateNextReviewDate(): string {
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + 30); // Review in 30 days
    return nextReview.toISOString();
  }

  private assessComplianceImpact(interaction: UserInteraction): string {
    // Assess the compliance impact of user interactions
    if (interaction.action === 'data-access') {
      return 'high';
    } else if (interaction.action === 'configuration-change') {
      return 'medium';
    } else {
      return 'low';
    }
  }

  private generatePolicyMatrix(): Record<string, unknown> {
    return {
      policies: Array.from(this.policies.values()).map(policy => ({
        id: policy.id,
        name: policy.name,
        category: policy.category,
        severity: policy.severity,
        enforcementLevel: policy.enforcementLevel,
        rulesCount: policy.rules.length
      }))
    };
  }

  private generateRiskFramework(): Record<string, unknown> {
    return {
      riskFactors: {
        security: 'Security-related compliance risks',
        privacy: 'Privacy and data protection risks',
        operational: 'Operational compliance risks',
        regulatory: 'Regulatory compliance risks'
      },
      assessmentMethodology: 'Weighted scoring based on violation severity and frequency',
      mitigationStrategies: this.generateMitigationStrategies()
    };
  }

  private generateViolationTrackingSystem(): Record<string, unknown> {
    return {
      violationTypes: ['security', 'privacy', 'audit', 'operational'],
      trackingFields: ['id', 'policyId', 'ruleId', 'severity', 'description', 'timestamp', 'remediationStatus'],
      workflow: ['detection', 'assessment', 'remediation', 'verification', 'closure']
    };
  }

  // Public API methods for external access

  public getPolicies(): CompliancePolicy[] {
    return Array.from(this.policies.values());
  }

  public getViolations(): ComplianceViolation[] {
    return Array.from(this.violations.values());
  }

  public getReports(): ComplianceReport[] {
    return Array.from(this.reports.values());
  }

  public getRiskAssessments(): RiskAssessment[] {
    return Array.from(this.riskAssessments.values());
  }

  public addPolicy(policy: CompliancePolicy): boolean {
    this.policies.set(policy.id, policy);
    this.emitTrace({
      timestamp: new Date(),
      eventType: 'compliance.policy.added',
      metadata: {
        correlationId: String(this.id),
        sourceAgent: String(this.id)
      }
    });
    return true;
  }

  public resolveViolation(violationId: string): void {
    const violation = this.violations.get(violationId);
    if (violation) {
      violation.remediationStatus = 'resolved';
      this.violations.set(violationId, violation);
      
      this.emitTrace({
        timestamp: new Date(),
        eventType: 'compliance.violation.resolved',
        metadata: {
          correlationId: String(this.id),
          sourceAgent: String(this.id)
        }
      });
    }
  }
} 