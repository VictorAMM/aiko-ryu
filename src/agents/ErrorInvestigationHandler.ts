import { AgentContract, AgentSpecification, AgentStatus, DesignArtifact, EventPayload, UserInteraction, ValidationResult } from './AgentContract';
import { DynamicOntologyMatrix } from './DynamicOntologyMatrix';

export interface ErrorInvestigation {
  id: string;
  type: 'dependency' | 'test' | 'build' | 'runtime' | 'unknown';
  status: 'pending' | 'investigating' | 'resolving' | 'completed' | 'failed';
  error: {
    message: string;
    stack?: string;
    code?: string;
    source: string;
    timestamp: Date;
  };
  context: {
    projectPath?: string;
    command?: string;
    agentId?: string;
    eventType?: string;
  };
  investigation: {
    hypothesis: string[];
    evidence: Record<string, unknown>[];
    actions: string[];
    results: Record<string, unknown>;
  };
  confidence: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DependencyIssue {
  type: 'missing' | 'version_mismatch' | 'conflict' | 'installation_failed';
  package: string;
  currentVersion?: string;
  requiredVersion?: string;
  error?: string;
}

export interface TestIssue {
  type: 'timeout' | 'failure' | 'missing_dependency' | 'configuration';
  testFile?: string;
  testName?: string;
  error?: string;
  timeout?: number;
}

export interface ErrorInvestigationHandlerContract extends AgentContract {
  handleError(error: Error, context: Record<string, unknown>): Promise<void>;
  investigateDependencyIssue(issue: DependencyIssue): Promise<void>;
  investigateTestIssue(issue: TestIssue): Promise<void>;
  resolveDependencyIssue(issue: DependencyIssue): Promise<boolean>;
  runTests(projectPath: string): Promise<boolean>;
  installDependencies(projectPath: string): Promise<boolean>;
  createInvestigation(error: Error, context: Record<string, unknown>): Promise<ErrorInvestigation>;
  processInvestigation(investigationId: string): Promise<void>;
}

export class ErrorInvestigationHandler implements ErrorInvestigationHandlerContract {
  id = 'error-investigation-handler';
  role = 'error-investigator';
  dependencies: string[] = [];
  status = 'ready';
  uptime = Date.now();

  private investigations: Map<string, ErrorInvestigation> = new Map();
  private ontologyMatrix: DynamicOntologyMatrix;

  constructor(ontologyMatrix: DynamicOntologyMatrix) {
    this.ontologyMatrix = ontologyMatrix;
  }

  async initialize(): Promise<void> {
    // Initialization logic
  }

  async shutdown(): Promise<void> {
    // Shutdown logic
  }

  validateSpecification(spec: AgentSpecification): ValidationResult {
    return {
      result: true,
      consensus: true
    };
  }

  generateDesignArtifacts(): DesignArtifact[] {
    return [];
  }

  trackUserInteraction(interaction: UserInteraction): void {
    // Track user interactions
  }

  async handleEvent(eventType: string, payload: EventPayload): Promise<void> {
    switch (eventType) {
      case 'error.detected':
        await this.handleError(
          new Error((payload as any).error as string || 'Unknown error'),
          (payload as any).context as Record<string, unknown>
        );
        break;
      case 'dependency.issue':
        await this.investigateDependencyIssue(payload as unknown as DependencyIssue);
        break;
      case 'test.issue':
        await this.investigateTestIssue(payload as unknown as TestIssue);
        break;
      case 'system.autonomous.cycle':
        await this.handleAutonomousCycle(payload);
        break;
      default:
        await this.emitTrace({
          timestamp: new Date(),
          eventType: 'error.investigation.unknown',
          payload: {
            timestamp: new Date(),
            eventType,
            error: `Unknown event type: ${eventType}`,
            correlationId: 'error-unknown',
            sourceAgent: this.id
          },
          metadata: { sourceAgent: this.id }
        });
    }
  }

  async handleError(error: Error, context: Record<string, unknown>): Promise<void> {
    console.log(`🔍 ERROR INVESTIGATION: Handling error: ${error.message}`);
    
    // Create investigation
    const investigation = await this.createInvestigation(error, context);
    
    // Process investigation
    await this.processInvestigation(investigation.id);

    await this.emitTrace({
      timestamp: new Date(),
      eventType: 'error.investigation.started',
      payload: {
        timestamp: new Date(),
        errorMessage: error.message,
        investigationId: investigation.id,
        context,
        correlationId: 'error-investigation',
        sourceAgent: this.id
      },
      metadata: { sourceAgent: this.id }
    });
  }

  async investigateDependencyIssue(issue: DependencyIssue): Promise<void> {
    console.log(`🔍 ERROR INVESTIGATION: Investigating dependency issue: ${issue.package}`);
    
    const investigation = await this.createInvestigation(
      new Error(`Dependency issue: ${issue.package} - ${issue.type}`),
      { issue, type: 'dependency' }
    );

    // Add dependency-specific investigation
    investigation.investigation.hypothesis.push(
      `Package "${issue.package}" is missing from node_modules`,
      `Package "${issue.package}" has version conflict`,
      `Package "${issue.package}" failed to install`,
      `Package "${issue.package}" is not in package.json`
    );

    investigation.investigation.actions.push(
      'check_package_json',
      'check_node_modules',
      'run_npm_install',
      'check_version_conflicts',
      'update_package_lock'
    );

    await this.processInvestigation(investigation.id);
  }

  async investigateTestIssue(issue: TestIssue): Promise<void> {
    console.log(`🔍 ERROR INVESTIGATION: Investigating test issue: ${issue.type}`);
    
    const investigation = await this.createInvestigation(
      new Error(`Test issue: ${issue.type} - ${issue.testName || 'unknown test'}`),
      { issue, type: 'test' }
    );

    // Add test-specific investigation
    investigation.investigation.hypothesis.push(
      `Test "${issue.testName}" is timing out`,
      `Test "${issue.testName}" is missing dependencies`,
      `Test configuration is incorrect`,
      `Test environment is not properly set up`
    );

    investigation.investigation.actions.push(
      'check_test_dependencies',
      'increase_timeout',
      'check_test_configuration',
      'run_tests_individually',
      'check_test_environment'
    );

    await this.processInvestigation(investigation.id);
  }

  async resolveDependencyIssue(issue: DependencyIssue): Promise<boolean> {
    console.log(`🔍 ERROR INVESTIGATION: Resolving dependency issue: ${issue.package}`);
    
    try {
      // Check if package.json exists
      const fs = require('fs');
      const path = require('path');
      
      const projectPath = process.cwd();
      const packageJsonPath = path.join(projectPath, 'package.json');
      
      if (!fs.existsSync(packageJsonPath)) {
        console.log(`❌ ERROR INVESTIGATION: package.json not found in ${projectPath}`);
        return false;
      }

      // Read package.json
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Check if package is in dependencies
      const isInDependencies = packageJson.dependencies && packageJson.dependencies[issue.package];
      const isInDevDependencies = packageJson.devDependencies && packageJson.devDependencies[issue.package];
      
      if (!isInDependencies && !isInDevDependencies) {
        console.log(`🔍 ERROR INVESTIGATION: Package "${issue.package}" not found in package.json`);
        
        // Add to devDependencies if it's a test dependency
        if (issue.package.includes('test') || issue.package.includes('jest') || issue.package.includes('supertest')) {
          packageJson.devDependencies = packageJson.devDependencies || {};
          packageJson.devDependencies[issue.package] = '^1.0.0';
          
          fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
          console.log(`✅ ERROR INVESTIGATION: Added "${issue.package}" to devDependencies`);
        } else {
          // Add to regular dependencies
          packageJson.dependencies = packageJson.dependencies || {};
          packageJson.dependencies[issue.package] = '^1.0.0';
          
          fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
          console.log(`✅ ERROR INVESTIGATION: Added "${issue.package}" to dependencies`);
        }
      }

      // Run npm install
      const { execSync } = require('child_process');
      console.log(`🔍 ERROR INVESTIGATION: Running npm install...`);
      execSync('npm install', { cwd: projectPath, stdio: 'inherit' });
      
      console.log(`✅ ERROR INVESTIGATION: Successfully installed dependencies`);
      return true;
      
    } catch (error) {
      console.log(`❌ ERROR INVESTIGATION: Failed to resolve dependency issue: ${error}`);
      return false;
    }
  }

  async runTests(projectPath: string): Promise<boolean> {
    console.log(`🔍 ERROR INVESTIGATION: Running tests in ${projectPath}`);
    
    // Guard against infinite loops - if we're already in an error investigation context, don't run tests
    if (process.env.ERROR_INVESTIGATION_ACTIVE === 'true') {
      console.log(`⚠️ ERROR INVESTIGATION: Skipping test execution to prevent infinite loop`);
      return false;
    }
    
    try {
      const { execSync } = require('child_process');
      
      // First, install dependencies
      await this.installDependencies(projectPath);
      
      // Check if there are test files
      const fs = require('fs');
      const path = require('path');
      const testDir = path.join(projectPath, 'test');
      const hasTestDir = fs.existsSync(testDir);
      
      if (!hasTestDir) {
        console.log(`⚠️ ERROR INVESTIGATION: No test directory found in ${projectPath}`);
        return false;
      }

      // Check if package.json has test script
      const packageJsonPath = path.join(projectPath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        if (!packageJson.scripts || !packageJson.scripts.test) {
          console.log(`⚠️ ERROR INVESTIGATION: No test script found in package.json`);
          return false;
        }
      }
      
      // Set environment variable to prevent infinite loops
      process.env.ERROR_INVESTIGATION_ACTIVE = 'true';
      
      try {
        // Run tests with increased timeout
        console.log(`🔍 ERROR INVESTIGATION: Running npm test...`);
        execSync('npm test -- --timeout=30000', { 
          cwd: projectPath, 
          stdio: 'inherit',
          timeout: 60000 // 60 second timeout for the entire test run
        });
        
        console.log(`✅ ERROR INVESTIGATION: Tests passed successfully`);
        return true;
      } finally {
        // Clean up environment variable
        delete process.env.ERROR_INVESTIGATION_ACTIVE;
      }
      
    } catch (error) {
      console.log(`❌ ERROR INVESTIGATION: Tests failed: ${error}`);
      
      // Try to run tests individually to identify which test is failing
      try {
        console.log(`🔍 ERROR INVESTIGATION: Attempting to run tests individually...`);
        const { execSync } = require('child_process');
        const fs = require('fs');
        const path = require('path');
        
        const testDir = path.join(projectPath, 'test');
        if (fs.existsSync(testDir)) {
          const testFiles = fs.readdirSync(testDir).filter((file: string) => file.endsWith('.test.js') || file.endsWith('.test.ts'));
          
          for (const testFile of testFiles) {
            console.log(`🔍 ERROR INVESTIGATION: Running individual test: ${testFile}`);
            try {
              execSync(`npm test -- ${testFile} --timeout=30000`, { 
                cwd: projectPath, 
                stdio: 'inherit',
                timeout: 30000
              });
              console.log(`✅ ERROR INVESTIGATION: Test ${testFile} passed`);
            } catch (testError: any) {
              console.log(`❌ ERROR INVESTIGATION: Test ${testFile} failed: ${testError.message}`);
            }
          }
        }
      } catch (individualTestError: any) {
        console.log(`❌ ERROR INVESTIGATION: Individual test execution failed: ${individualTestError.message}`);
      }
      
      return false;
    }
  }

  async installDependencies(projectPath: string): Promise<boolean> {
    console.log(`🔍 ERROR INVESTIGATION: Installing dependencies in ${projectPath}`);
    
    try {
      const { execSync } = require('child_process');
      
      // Check if package.json exists
      const fs = require('fs');
      const path = require('path');
      const packageJsonPath = path.join(projectPath, 'package.json');
      
      if (!fs.existsSync(packageJsonPath)) {
        console.log(`❌ ERROR INVESTIGATION: package.json not found in ${projectPath}`);
        return false;
      }

      // Check if node_modules exists
      const nodeModulesPath = path.join(projectPath, 'node_modules');
      const hasNodeModules = fs.existsSync(nodeModulesPath);
      
      if (!hasNodeModules) {
        console.log(`🔍 ERROR INVESTIGATION: node_modules not found, installing dependencies...`);
        execSync('npm install', { cwd: projectPath, stdio: 'inherit' });
      } else {
        console.log(`🔍 ERROR INVESTIGATION: node_modules exists, checking for missing dependencies...`);
        // Try to install any missing dependencies
        execSync('npm install', { cwd: projectPath, stdio: 'inherit' });
      }
      
      console.log(`✅ ERROR INVESTIGATION: Dependencies installed successfully`);
      return true;
      
    } catch (error) {
      console.log(`❌ ERROR INVESTIGATION: Failed to install dependencies: ${error}`);
      return false;
    }
  }

  async createInvestigation(error: Error, context: Record<string, unknown>): Promise<ErrorInvestigation> {
    const investigationId = `error-investigation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const investigation: ErrorInvestigation = {
      id: investigationId,
      type: this.determineErrorType(error, context),
      status: 'pending',
      error: {
        message: error.message,
        stack: error.stack,
        code: (error as any).code,
        source: context.sourceAgent as string || 'unknown',
        timestamp: new Date()
      },
      context: {
        projectPath: context.projectPath as string,
        command: context.command as string,
        agentId: context.agentId as string,
        eventType: context.eventType as string
      },
      investigation: {
        hypothesis: [
          `Error "${error.message}" might be a dependency issue`,
          `Error "${error.message}" might be a test configuration issue`,
          `Error "${error.message}" might be a build process issue`,
          `Error "${error.message}" might be a runtime environment issue`
        ],
        evidence: [],
        actions: [
          'analyze_error_pattern',
          'check_dependencies',
          'run_tests',
          'check_configuration',
          'propose_solution'
        ],
        results: {}
      },
      confidence: 0.0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.investigations.set(investigationId, investigation);
    return investigation;
  }

  async processInvestigation(investigationId: string): Promise<void> {
    const investigation = this.investigations.get(investigationId);
    if (!investigation) {
      throw new Error(`Investigation ${investigationId} not found`);
    }

    console.log(`🔍 ERROR INVESTIGATION: Processing investigation ${investigationId} for "${investigation.error.message}"`);

    // Update status to investigating
    investigation.status = 'investigating';
    investigation.updatedAt = new Date();

    // Phase 1: Analyze error pattern
    await this.analyzeErrorPattern(investigation);

    // Phase 2: Gather evidence
    await this.gatherEvidence(investigation);

    // Phase 3: Execute actions based on error type
    if (investigation.type === 'dependency') {
      await this.handleDependencyInvestigation(investigation);
    } else if (investigation.type === 'test') {
      await this.handleTestInvestigation(investigation);
    } else {
      await this.handleGenericInvestigation(investigation);
    }

    // Phase 4: Update confidence and status
    investigation.confidence = this.calculateConfidence(investigation);
    investigation.status = investigation.confidence > 0.7 ? 'completed' : 'failed';
    investigation.updatedAt = new Date();

    await this.emitTrace({
      timestamp: new Date(),
      eventType: 'error.investigation.completed',
      payload: {
        timestamp: new Date(),
        investigationId: investigation.id,
        errorMessage: investigation.error.message,
        confidence: investigation.confidence,
        status: investigation.status,
        correlationId: 'error-complete',
        sourceAgent: this.id
      },
      metadata: { sourceAgent: this.id }
    });
  }

  private determineErrorType(error: Error, context: Record<string, unknown>): ErrorInvestigation['type'] {
    const message = error.message.toLowerCase();
    
    if (message.includes('dependency') || message.includes('module') || message.includes('package')) {
      return 'dependency';
    } else if (message.includes('test') || message.includes('jest') || message.includes('timeout')) {
      return 'test';
    } else if (message.includes('build') || message.includes('compile')) {
      return 'build';
    } else if (message.includes('runtime') || message.includes('execution')) {
      return 'runtime';
    } else {
      return 'unknown';
    }
  }

  private async analyzeErrorPattern(investigation: ErrorInvestigation): Promise<void> {
    const patternAnalysis = {
      hasStack: !!investigation.error.stack,
      hasCode: !!investigation.error.code,
      isDependencyRelated: investigation.error.message.toLowerCase().includes('dependency'),
      isTestRelated: investigation.error.message.toLowerCase().includes('test'),
      isBuildRelated: investigation.error.message.toLowerCase().includes('build'),
      isRuntimeRelated: investigation.error.message.toLowerCase().includes('runtime')
    };

    investigation.investigation.evidence.push({
      type: 'pattern_analysis',
      data: patternAnalysis,
      confidence: 0.8
    });
  }

  private async gatherEvidence(investigation: ErrorInvestigation): Promise<void> {
    // Check if project path exists
    if (investigation.context.projectPath) {
      const fs = require('fs');
      const path = require('path');
      
      const projectExists = fs.existsSync(investigation.context.projectPath);
      investigation.investigation.evidence.push({
        type: 'project_exists',
        data: { exists: projectExists },
        confidence: 0.9
      });

      if (projectExists) {
        // Check package.json
        const packageJsonPath = path.join(investigation.context.projectPath, 'package.json');
        const hasPackageJson = fs.existsSync(packageJsonPath);
        investigation.investigation.evidence.push({
          type: 'package_json_exists',
          data: { exists: hasPackageJson },
          confidence: 0.9
        });

        // Check node_modules
        const nodeModulesPath = path.join(investigation.context.projectPath, 'node_modules');
        const hasNodeModules = fs.existsSync(nodeModulesPath);
        investigation.investigation.evidence.push({
          type: 'node_modules_exists',
          data: { exists: hasNodeModules },
          confidence: 0.8
        });
      }
    }
  }

  private async handleDependencyInvestigation(investigation: ErrorInvestigation): Promise<void> {
    console.log(`🔍 ERROR INVESTIGATION: Handling dependency investigation for "${investigation.error.message}"`);
    
    if (investigation.context.projectPath) {
      const success = await this.resolveDependencyIssue({
        type: 'missing',
        package: 'unknown',
        error: investigation.error.message
      });
      
      investigation.investigation.results = {
        dependencyResolved: success,
        actionTaken: 'npm_install',
        timestamp: new Date()
      };
    }
  }

  private async handleTestInvestigation(investigation: ErrorInvestigation): Promise<void> {
    console.log(`🔍 ERROR INVESTIGATION: Handling test investigation for "${investigation.error.message}"`);
    
    if (investigation.context.projectPath) {
      // Try to fix test issues
      const success = await this.fixTestIssues(investigation);
      
      if (success) {
        // Run tests again after fixes
        const testSuccess = await this.runTests(investigation.context.projectPath);
        
        investigation.investigation.results = {
          testIssuesFixed: success,
          testsPassed: testSuccess,
          actionTaken: 'fix_and_test',
          timestamp: new Date()
        };
      } else {
        investigation.investigation.results = {
          testIssuesFixed: false,
          testsPassed: false,
          actionTaken: 'test_fix_failed',
          timestamp: new Date()
        };
      }
    }
  }

  private async handleGenericInvestigation(investigation: ErrorInvestigation): Promise<void> {
    console.log(`🔍 ERROR INVESTIGATION: Handling generic investigation for "${investigation.error.message}"`);
    
    // For generic errors, try to install dependencies and run tests
    if (investigation.context.projectPath) {
      const installSuccess = await this.installDependencies(investigation.context.projectPath);
      const testSuccess = await this.runTests(investigation.context.projectPath);
      
      investigation.investigation.results = {
        dependenciesInstalled: installSuccess,
        testsPassed: testSuccess,
        actionTaken: 'install_and_test',
        timestamp: new Date()
      };
    }
  }

  private async fixTestIssues(investigation: ErrorInvestigation): Promise<boolean> {
    console.log(`🔍 ERROR INVESTIGATION: Attempting to fix test issues...`);
    
    try {
      const fs = require('fs');
      const path = require('path');
      const projectPath = investigation.context.projectPath;
      
      // Check if jest.config.js exists and update timeout
      const jestConfigPath = path.join(projectPath, 'jest.config.js');
      if (fs.existsSync(jestConfigPath)) {
        console.log(`🔍 ERROR INVESTIGATION: Updating Jest configuration...`);
        let jestConfig = fs.readFileSync(jestConfigPath, 'utf8');
        
        // Update timeout if it's too low
        if (jestConfig.includes('testTimeout') && jestConfig.includes('5000')) {
          jestConfig = jestConfig.replace(/testTimeout:\s*5000/g, 'testTimeout: 30000');
          fs.writeFileSync(jestConfigPath, jestConfig);
          console.log(`✅ ERROR INVESTIGATION: Updated Jest timeout to 30 seconds`);
        }
      }

      // Check package.json for test script and update if needed
      const packageJsonPath = path.join(projectPath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        if (packageJson.scripts && packageJson.scripts.test) {
          // Update test script to include timeout
          if (!packageJson.scripts.test.includes('--timeout')) {
            packageJson.scripts.test = packageJson.scripts.test + ' --timeout=30000';
            fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
            console.log(`✅ ERROR INVESTIGATION: Updated test script with timeout`);
          }
        }
      }

      return true;
    } catch (error) {
      console.log(`❌ ERROR INVESTIGATION: Failed to fix test issues: ${error}`);
      return false;
    }
  }

  private calculateConfidence(investigation: ErrorInvestigation): number {
    const evidenceCount = investigation.investigation.evidence.length;
    const hasResults = Object.keys(investigation.investigation.results).length > 0;
    const hasActions = investigation.investigation.actions.length > 0;
    
    let confidence = 0.3; // Base confidence
    
    if (evidenceCount > 0) confidence += 0.2;
    if (hasResults) confidence += 0.3;
    if (hasActions) confidence += 0.2;
    
    return Math.min(confidence, 1.0);
  }

  private async handleAutonomousCycle(payload: EventPayload): Promise<void> {
    await this.emitTrace({
      timestamp: new Date(),
      eventType: 'error.investigation.cycle.processed',
      payload: {
        timestamp: new Date(),
        cycle: (payload as any).cycle,
        correlationId: 'error-cycle',
        sourceAgent: this.id
      },
      metadata: { sourceAgent: this.id }
    });
  }

  getStatus(): AgentStatus {
    return {
      status: this.status as "ready" | "running" | "error" | "completed" | "failed",
      uptime: Date.now() - this.uptime
    };
  }

  async emitTrace(event: { timestamp: Date; eventType: string; payload: EventPayload; metadata: Record<string, unknown> }): Promise<void> {
    console.log(`[ErrorInvestigationHandler:${this.id}]`, {
      timestamp: event.timestamp,
      eventType: event.eventType,
      payload: event.payload,
      metadata: event.metadata
    });
  }
} 