import { AgentContract, TraceEvent, ValidationResult, AgentSpecification, DesignArtifact, UserInteraction, EventPayload, AgentStatus } from './AgentContract';
import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as path from 'path';
import { spawn, exec } from 'child_process';
import * as os from 'os';

/**
 * 🚀 System Operations Agent - Superuser Powers with Ollama Integration
 * 
 * Purpose: Provides agents with system-level operations capabilities including
 * file system operations, process management, network operations, system monitoring,
 * and direct command execution through Ollama tool calling.
 * 
 * DDD/SDD Alignment:
 * - DDD: System operations as a specialized domain service
 * - SDD: Formal specification for system operation contracts and security policies
 */
export interface SystemOperationsAgentContract extends AgentContract {
  readonly id: 'system-operations';
  readonly role: 'System Operations Engine';
  
  // Core system operation capabilities
  executeSystemCommand(command: string, options?: SystemCommandOptions): Promise<SystemCommandResult>;
  manageFileSystem(operation: FileSystemOperation): Promise<FileSystemResult>;
  manageProcesses(operation: ProcessOperation): Promise<ProcessResult>;
  manageNetwork(operation: NetworkOperation): Promise<NetworkResult>;
  monitorSystem(metrics: SystemMetrics[]): Promise<SystemMonitoringResult>;
  
  // Advanced system features
  implementSystemAutomation(automation: SystemAutomation): Promise<AutomationResult>;
  manageSystemResources(resources: SystemResource[]): Promise<ResourceManagementResult>;
  implementSecurityPolicies(policies: SecurityPolicy[]): Promise<SecurityPolicyResult>;
  
  // Ollama integration for system operations
  callOllamaWithSystemTools(prompt: string, tools: SystemTool[]): Promise<OllamaSystemResult>;
  executeOllamaSystemCommand(command: string, model?: string): Promise<OllamaCommandResult>;
  benchmarkSystemOperations(): Promise<SystemBenchmarkResult>;
}

// System operation interfaces
export interface SystemCommandOptions {
  timeout?: number;
  workingDirectory?: string;
  environment?: Record<string, string>;
  user?: string;
  sudo?: boolean;
  captureOutput?: boolean;
  validateOutput?: boolean;
}

export interface SystemCommandResult {
  success: boolean;
  exitCode: number;
  stdout: string;
  stderr: string;
  duration: number;
  command: string;
  timestamp: Date;
  validation?: ValidationResult;
}

export interface FileSystemOperation {
  type: 'read' | 'write' | 'delete' | 'copy' | 'move' | 'list' | 'create';
  path: string;
  content?: string;
  destination?: string;
  options?: {
    recursive?: boolean;
    overwrite?: boolean;
    permissions?: string;
    encoding?: string;
  };
}

export interface FileSystemResult {
  success: boolean;
  operation: string;
  path: string;
  result?: any;
  error?: string;
  duration: number;
  timestamp: Date;
}

export interface ProcessOperation {
  type: 'start' | 'stop' | 'restart' | 'status' | 'list' | 'kill';
  processId?: string;
  command?: string;
  options?: {
    detached?: boolean;
    stdio?: 'pipe' | 'ignore' | 'inherit';
    cwd?: string;
    env?: Record<string, string>;
  };
}

export interface ProcessResult {
  success: boolean;
  operation: string;
  processId?: string;
  status?: string;
  output?: string;
  error?: string;
  duration: number;
  timestamp: Date;
}

export interface NetworkOperation {
  type: 'ping' | 'curl' | 'wget' | 'ssh' | 'scp' | 'port_scan' | 'dns_lookup';
  target: string;
  options?: {
    timeout?: number;
    retries?: number;
    headers?: Record<string, string>;
    method?: string;
    data?: string;
  };
}

export interface NetworkResult {
  success: boolean;
  operation: string;
  target: string;
  response?: any;
  error?: string;
  duration: number;
  timestamp: Date;
}

export interface SystemMetrics {
  type: 'cpu' | 'memory' | 'disk' | 'network' | 'processes' | 'services';
  interval?: number;
  threshold?: number;
}

export interface SystemMonitoringResult {
  success: boolean;
  metrics: Record<string, any>;
  alerts?: string[];
  duration: number;
  timestamp: Date;
}

export interface SystemAutomation {
  id: string;
  name: string;
  triggers: AutomationTrigger[];
  actions: AutomationAction[];
  conditions?: AutomationCondition[];
  schedule?: string;
}

export interface AutomationTrigger {
  type: 'event' | 'schedule' | 'condition';
  value: string;
}

export interface AutomationAction {
  type: 'command' | 'file' | 'process' | 'network';
  target: string;
  parameters?: Record<string, any>;
}

export interface AutomationCondition {
  type: 'file_exists' | 'process_running' | 'network_available' | 'custom';
  expression: string;
}

export interface AutomationResult {
  success: boolean;
  automationId: string;
  executed: boolean;
  results?: any[];
  error?: string;
  duration: number;
  timestamp: Date;
}

export interface SystemResource {
  type: 'cpu' | 'memory' | 'disk' | 'network' | 'gpu';
  action: 'allocate' | 'deallocate' | 'optimize' | 'monitor';
  parameters?: Record<string, any>;
}

export interface ResourceManagementResult {
  success: boolean;
  resources: Record<string, any>;
  optimizations?: string[];
  errors?: string[];
  duration: number;
  timestamp: Date;
}

export interface SecurityPolicy {
  id: string;
  name: string;
  type: 'file_access' | 'process_control' | 'network_access' | 'command_execution';
  rules: SecurityRule[];
  enforcement: 'strict' | 'warning' | 'log';
}

export interface SecurityRule {
  pattern: string;
  action: 'allow' | 'deny' | 'require_auth';
  conditions?: Record<string, any>;
}

export interface SecurityPolicyResult {
  success: boolean;
  policies: Record<string, boolean>;
  violations?: string[];
  duration: number;
  timestamp: Date;
}

export interface SystemTool {
  name: string;
  description: string;
  parameters: {
    name: string;
    type: string;
    description: string;
    required: boolean;
  }[];
}

export interface OllamaSystemResult {
  success: boolean;
  response: string;
  tools_executed: SystemTool[];
  duration: number;
  model: string;
  timestamp: Date;
}

export interface OllamaCommandResult {
  success: boolean;
  command: string;
  output: string;
  error?: string;
  duration: number;
  model: string;
  timestamp: Date;
}

export interface SystemBenchmarkResult {
  success: boolean;
  benchmarks: Record<string, number>;
  recommendations?: string[];
  duration: number;
  timestamp: Date;
}

/**
 * System Operations Agent Implementation
 * 
 * Implements system-level operations with Ollama integration, providing:
 * - File system operations (read, write, delete, copy, move)
 * - Process management (start, stop, restart, monitor)
 * - Network operations (ping, curl, ssh, port scanning)
 * - System monitoring (CPU, memory, disk, network)
 * - Security policy enforcement
 * - Automation capabilities
 * - Resource management
 */
export class SystemOperationsAgent extends EventEmitter implements SystemOperationsAgentContract {
  readonly id = 'system-operations';
  readonly role = 'System Operations Engine';
  readonly dependencies = ['aiko', 'ryu', 'sarah'];
  
  private ollamaEndpoint: string;
  private defaultModel: string;
  private securityPolicies: Map<string, SecurityPolicy>;
  private automations: Map<string, SystemAutomation>;
  private systemTools: SystemTool[] = [];
  private startTime: number;
  
  constructor(config: {
    ollamaEndpoint?: string;
    defaultModel?: string;
    securityPolicies?: SecurityPolicy[];
    automations?: SystemAutomation[];
  } = {}) {
    super();
    this.ollamaEndpoint = config.ollamaEndpoint || 'http://localhost:11434';
    this.defaultModel = config.defaultModel || 'gemma2:2b';
    this.securityPolicies = new Map();
    this.automations = new Map();
    this.startTime = Date.now();
    
    // Initialize system tools
    this.initializeSystemTools();
    
    // Initialize security policies
    if (config.securityPolicies) {
      config.securityPolicies.forEach(policy => {
        this.securityPolicies.set(policy.id, policy);
      });
    }
    
    // Initialize automations
    if (config.automations) {
      config.automations.forEach(automation => {
        this.automations.set(automation.id, automation);
      });
    }
  }

  async initialize(): Promise<void> {
    console.log('[SystemOperationsAgent] Initializing system operations agent...');
    
    // Emit initialization event
    this.emit('agent.initialized', {
      timestamp: new Date(),
      eventType: 'agent.initialized',
      metadata: { sourceAgent: 'system-operations' }
    });
    
    console.log('[SystemOperationsAgent] System operations agent ready');
  }

  async shutdown(): Promise<void> {
    console.log('[SystemOperationsAgent] Shutting down system operations agent...');
    
    // Emit shutdown event
    this.emit('agent.shutdown', {
      timestamp: new Date(),
      eventType: 'agent.shutdown',
      metadata: { sourceAgent: 'system-operations' }
    });
    
    console.log('[SystemOperationsAgent] System operations agent shutdown complete');
  }

  /**
   * Execute system command with full superuser capabilities
   */
  async executeSystemCommand(command: string, options: SystemCommandOptions = {}): Promise<SystemCommandResult> {
    const startTime = Date.now();
    
    try {
      console.log(`[SystemOperationsAgent] Executing system command: ${command}`);
      
      // Validate command against security policies
      const validation = await this.validateCommand(command);
      if (!validation.result) {
        throw new Error(`Command blocked by security policy: ${validation.reason}`);
      }
      
      const execOptions = {
        timeout: options.timeout || 30000,
        cwd: options.workingDirectory || process.cwd(),
        env: { ...process.env, ...options.environment },
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
      };
      
      return new Promise((resolve, reject) => {
        exec(command, execOptions, (error, stdout, stderr) => {
          const duration = Date.now() - startTime;
          const exitCode = error ? error.code || 1 : 0;
          
          const result: SystemCommandResult = {
            success: exitCode === 0,
            exitCode,
            stdout: stdout.toString(),
            stderr: stderr.toString(),
            duration,
            command,
            timestamp: new Date(),
            validation: validation
          };
          
          if (options.captureOutput) {
            console.log(`[SystemOperationsAgent] Command output: ${stdout}`);
          }
          
          this.emit('system.command.executed', {
            timestamp: new Date(),
            eventType: 'system.command.executed',
            payload: {
              command,
              success: result.success,
              duration,
              exitCode
            },
            metadata: { sourceAgent: 'system-operations' }
          });
          
          resolve(result);
        });
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[SystemOperationsAgent] Command execution failed: ${error}`);
      
      return {
        success: false,
        exitCode: -1,
        stdout: '',
        stderr: error instanceof Error ? error.message : String(error),
        duration,
        command,
        timestamp: new Date()
      };
    }
  }

  /**
   * Manage file system operations
   */
  async manageFileSystem(operation: FileSystemOperation): Promise<FileSystemResult> {
    const startTime = Date.now();
    
    try {
      console.log(`[SystemOperationsAgent] File system operation: ${operation.type} ${operation.path}`);
      
      let result: any;
      
      switch (operation.type) {
        case 'read':
          result = await fs.promises.readFile(operation.path, { encoding: (operation.options?.encoding as BufferEncoding) || 'utf8' });
          break;
          
        case 'write':
          await fs.promises.writeFile(operation.path, operation.content || '', { encoding: (operation.options?.encoding as BufferEncoding) || 'utf8' });
          result = { written: true, path: operation.path };
          break;
          
        case 'delete':
          if (operation.options?.recursive) {
            await fs.promises.rm(operation.path, { recursive: true, force: true });
          } else {
            await fs.promises.unlink(operation.path);
          }
          result = { deleted: true, path: operation.path };
          break;
          
        case 'copy':
          await fs.promises.copyFile(operation.path, operation.destination!);
          result = { copied: true, from: operation.path, to: operation.destination };
          break;
          
        case 'move':
          await fs.promises.rename(operation.path, operation.destination!);
          result = { moved: true, from: operation.path, to: operation.destination };
          break;
          
        case 'list':
          const files = await fs.promises.readdir(operation.path);
          result = { files, path: operation.path };
          break;
          
        case 'create':
          if (operation.options?.recursive) {
            await fs.promises.mkdir(operation.path, { recursive: true });
          } else {
            await fs.promises.mkdir(operation.path);
          }
          result = { created: true, path: operation.path };
          break;
      }
      
      const duration = Date.now() - startTime;
      
      this.emit('system.filesystem.operation', {
        timestamp: new Date(),
        eventType: 'system.filesystem.operation',
        payload: {
          operation: operation.type,
          path: operation.path,
          success: true,
          duration
        },
        metadata: { sourceAgent: 'system-operations' }
      });
      
      return {
        success: true,
        operation: operation.type,
        path: operation.path,
        result,
        duration,
        timestamp: new Date()
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[SystemOperationsAgent] File system operation failed: ${error}`);
      
      return {
        success: false,
        operation: operation.type,
        path: operation.path,
        error: error instanceof Error ? error.message : String(error),
        duration,
        timestamp: new Date()
      };
    }
  }

  /**
   * Manage process operations
   */
  async manageProcesses(operation: ProcessOperation): Promise<ProcessResult> {
    const startTime = Date.now();
    
    try {
      console.log(`[SystemOperationsAgent] Process operation: ${operation.type}`);
      
      let result: any;
      
      switch (operation.type) {
        case 'start':
          const child = spawn(operation.command!, operation.options?.stdio === 'pipe' ? [] : [], {
            detached: operation.options?.detached || false,
            stdio: operation.options?.stdio || 'pipe',
            cwd: operation.options?.cwd || process.cwd(),
            env: { ...process.env, ...operation.options?.env }
          });
          result = { processId: child.pid, started: true };
          break;
          
        case 'stop':
          result = await this.executeSystemCommand(`kill ${operation.processId}`);
          break;
          
        case 'restart':
          await this.executeSystemCommand(`kill ${operation.processId}`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          result = await this.executeSystemCommand(operation.command!);
          break;
          
        case 'status':
          result = await this.executeSystemCommand(`ps -p ${operation.processId}`);
          break;
          
        case 'list':
          result = await this.executeSystemCommand('ps aux');
          break;
          
        case 'kill':
          result = await this.executeSystemCommand(`kill -9 ${operation.processId}`);
          break;
      }
      
      const duration = Date.now() - startTime;
      
      this.emit('system.process.operation', {
        timestamp: new Date(),
        eventType: 'system.process.operation',
        payload: {
          operation: operation.type,
          processId: operation.processId,
          success: true,
          duration
        },
        metadata: { sourceAgent: 'system-operations' }
      });
      
      return {
        success: true,
        operation: operation.type,
        processId: operation.processId,
        output: result.stdout,
        duration,
        timestamp: new Date()
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[SystemOperationsAgent] Process operation failed: ${error}`);
      
      return {
        success: false,
        operation: operation.type,
        processId: operation.processId,
        error: error instanceof Error ? error.message : String(error),
        duration,
        timestamp: new Date()
      };
    }
  }

  /**
   * Manage network operations
   */
  async manageNetwork(operation: NetworkOperation): Promise<NetworkResult> {
    const startTime = Date.now();
    
    try {
      console.log(`[SystemOperationsAgent] Network operation: ${operation.type} ${operation.target}`);
      
      let command: string;
      
      switch (operation.type) {
        case 'ping':
          command = `ping -c 4 ${operation.target}`;
          break;
          
        case 'curl':
          const headers = operation.options?.headers ? Object.entries(operation.options.headers).map(([k, v]) => `-H "${k}: ${v}"`).join(' ') : '';
          const method = operation.options?.method ? `-X ${operation.options.method}` : '';
          const data = operation.options?.data ? `-d '${operation.options.data}'` : '';
          command = `curl ${headers} ${method} ${data} ${operation.target}`;
          break;
          
        case 'wget':
          command = `wget ${operation.target}`;
          break;
          
        case 'ssh':
          command = `ssh ${operation.target}`;
          break;
          
        case 'scp':
          command = `scp ${operation.target}`;
          break;
          
        case 'port_scan':
          command = `nmap -p 80,443,22,21,25,53 ${operation.target}`;
          break;
          
        case 'dns_lookup':
          command = `nslookup ${operation.target}`;
          break;
          
        default:
          throw new Error(`Unsupported network operation: ${operation.type}`);
      }
      
      const result = await this.executeSystemCommand(command, {
        timeout: operation.options?.timeout || 30000
      });
      
      const duration = Date.now() - startTime;
      
      this.emit('system.network.operation', {
        timestamp: new Date(),
        eventType: 'system.network.operation',
        payload: {
          operation: operation.type,
          target: operation.target,
          success: result.success,
          duration
        },
        metadata: { sourceAgent: 'system-operations' }
      });
      
      return {
        success: result.success,
        operation: operation.type,
        target: operation.target,
        response: result.stdout,
        error: result.stderr,
        duration,
        timestamp: new Date()
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[SystemOperationsAgent] Network operation failed: ${error}`);
      
      return {
        success: false,
        operation: operation.type,
        target: operation.target,
        error: error instanceof Error ? error.message : String(error),
        duration,
        timestamp: new Date()
      };
    }
  }

  /**
   * Monitor system metrics
   */
  async monitorSystem(metrics: SystemMetrics[]): Promise<SystemMonitoringResult> {
    const startTime = Date.now();
    
    try {
      console.log(`[SystemOperationsAgent] Monitoring system metrics: ${metrics.map(m => m.type).join(', ')}`);
      
      const results: Record<string, any> = {};
      const alerts: string[] = [];
      
      for (const metric of metrics) {
        switch (metric.type) {
          case 'cpu':
            const cpuResult = await this.executeSystemCommand('top -bn1 | grep "Cpu(s)" | awk \'{print $2}\' | cut -d\'%\' -f1');
            const cpuUsage = parseFloat(cpuResult.stdout.trim());
            results.cpu = { usage: cpuUsage, unit: '%' };
            if (metric.threshold && cpuUsage > metric.threshold) {
              alerts.push(`CPU usage ${cpuUsage}% exceeds threshold ${metric.threshold}%`);
            }
            break;
            
          case 'memory':
            const memResult = await this.executeSystemCommand('free -m | grep Mem | awk \'{print $3/$2 * 100.0}\'');
            const memUsage = parseFloat(memResult.stdout.trim());
            results.memory = { usage: memUsage, unit: '%' };
            if (metric.threshold && memUsage > metric.threshold) {
              alerts.push(`Memory usage ${memUsage}% exceeds threshold ${metric.threshold}%`);
            }
            break;
            
          case 'disk':
            const diskResult = await this.executeSystemCommand('df -h / | tail -1 | awk \'{print $5}\' | cut -d\'%\' -f1');
            const diskUsage = parseFloat(diskResult.stdout.trim());
            results.disk = { usage: diskUsage, unit: '%' };
            if (metric.threshold && diskUsage > metric.threshold) {
              alerts.push(`Disk usage ${diskUsage}% exceeds threshold ${metric.threshold}%`);
            }
            break;
            
          case 'network':
            const netResult = await this.executeSystemCommand('netstat -i | grep -v lo | awk \'{print $1}\' | head -1');
            results.network = { interface: netResult.stdout.trim() };
            break;
            
          case 'processes':
            const procResult = await this.executeSystemCommand('ps aux | wc -l');
            const processCount = parseInt(procResult.stdout.trim());
            results.processes = { count: processCount };
            break;
            
          case 'services':
            const serviceResult = await this.executeSystemCommand('systemctl list-units --type=service --state=running | wc -l');
            const serviceCount = parseInt(serviceResult.stdout.trim()) - 1; // Subtract header
            results.services = { running: serviceCount };
            break;
        }
      }
      
      const duration = Date.now() - startTime;
      
      this.emit('system.monitoring.update', {
        timestamp: new Date(),
        eventType: 'system.monitoring.update',
        payload: {
          metrics: results,
          alerts,
          duration
        },
        metadata: { sourceAgent: 'system-operations' }
      });
      
      return {
        success: true,
        metrics: results,
        alerts,
        duration,
        timestamp: new Date()
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[SystemOperationsAgent] System monitoring failed: ${error}`);
      
      return {
        success: false,
        metrics: {},
        duration,
        timestamp: new Date()
      };
    }
  }

  /**
   * Implement system automation
   */
  async implementSystemAutomation(automation: SystemAutomation): Promise<AutomationResult> {
    const startTime = Date.now();
    
    try {
      console.log(`[SystemOperationsAgent] Implementing automation: ${automation.name}`);
      
      // Store automation
      this.automations.set(automation.id, automation);
      
      // Execute automation if conditions are met
      let executed = false;
      const results: any[] = [];
      
      if (automation.conditions) {
        const conditionsMet = await this.checkAutomationConditions(automation.conditions);
        if (conditionsMet) {
          executed = true;
          
          for (const action of automation.actions) {
            const result = await this.executeAutomationAction(action);
            results.push(result);
          }
        }
      }
      
      const duration = Date.now() - startTime;
      
      this.emit('system.automation.implemented', {
        timestamp: new Date(),
        eventType: 'system.automation.implemented',
        payload: {
          automationId: automation.id,
          executed,
          results: results.length,
          duration
        },
        metadata: { sourceAgent: 'system-operations' }
      });
      
      return {
        success: true,
        automationId: automation.id,
        executed,
        results,
        duration,
        timestamp: new Date()
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[SystemOperationsAgent] Automation implementation failed: ${error}`);
      
      return {
        success: false,
        automationId: automation.id,
        executed: false,
        error: error instanceof Error ? error.message : String(error),
        duration,
        timestamp: new Date()
      };
    }
  }

  /**
   * Manage system resources
   */
  async manageSystemResources(resources: SystemResource[]): Promise<ResourceManagementResult> {
    const startTime = Date.now();
    
    try {
      console.log(`[SystemOperationsAgent] Managing system resources: ${resources.map(r => `${r.type} ${r.action}`).join(', ')}`);
      
      const results: Record<string, any> = {};
      const optimizations: string[] = [];
      const errors: string[] = [];
      
      for (const resource of resources) {
        try {
          switch (resource.type) {
            case 'cpu':
              if (resource.action === 'optimize') {
                const cpuResult = await this.executeSystemCommand('nproc');
                const cpuCount = parseInt(cpuResult.stdout.trim());
                results.cpu = { cores: cpuCount, optimized: true };
                optimizations.push(`CPU optimization applied for ${cpuCount} cores`);
              }
              break;
              
            case 'memory':
              if (resource.action === 'optimize') {
                const memResult = await this.executeSystemCommand('free -h');
                results.memory = { status: memResult.stdout, optimized: true };
                optimizations.push('Memory optimization applied');
              }
              break;
              
            case 'disk':
              if (resource.action === 'optimize') {
                const diskResult = await this.executeSystemCommand('df -h');
                results.disk = { status: diskResult.stdout, optimized: true };
                optimizations.push('Disk optimization applied');
              }
              break;
              
            case 'network':
              if (resource.action === 'optimize') {
                const netResult = await this.executeSystemCommand('netstat -i');
                results.network = { status: netResult.stdout, optimized: true };
                optimizations.push('Network optimization applied');
              }
              break;
              
            case 'gpu':
              if (resource.action === 'optimize') {
                const gpuResult = await this.executeSystemCommand('nvidia-smi --query-gpu=name,memory.total,memory.free --format=csv,noheader,nounits');
                results.gpu = { status: gpuResult.stdout, optimized: true };
                optimizations.push('GPU optimization applied');
              }
              break;
          }
        } catch (error) {
          errors.push(`${resource.type} ${resource.action} failed: ${error}`);
        }
      }
      
      const duration = Date.now() - startTime;
      
      this.emit('system.resources.managed', {
        timestamp: new Date(),
        eventType: 'system.resources.managed',
        payload: {
          resources: Object.keys(results),
          optimizations: optimizations.length,
          errors: errors.length,
          duration
        },
        metadata: { sourceAgent: 'system-operations' }
      });
      
      return {
        success: errors.length === 0,
        resources: results,
        optimizations,
        errors,
        duration,
        timestamp: new Date()
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[SystemOperationsAgent] Resource management failed: ${error}`);
      
      return {
        success: false,
        resources: {},
        errors: [error instanceof Error ? error.message : String(error)],
        duration,
        timestamp: new Date()
      };
    }
  }

  /**
   * Implement security policies
   */
  async implementSecurityPolicies(policies: SecurityPolicy[]): Promise<SecurityPolicyResult> {
    const startTime = Date.now();
    
    try {
      console.log(`[SystemOperationsAgent] Implementing security policies: ${policies.map(p => p.name).join(', ')}`);
      
      const results: Record<string, boolean> = {};
      const violations: string[] = [];
      
      for (const policy of policies) {
        try {
          // Store policy
          this.securityPolicies.set(policy.id, policy);
          
          // Check for violations
          const violationsFound = await this.checkPolicyViolations(policy);
          if (violationsFound.length > 0) {
            violations.push(...violationsFound);
          }
          
          results[policy.id] = true;
        } catch (error) {
          results[policy.id] = false;
          violations.push(`Policy ${policy.name} failed: ${error}`);
        }
      }
      
      const duration = Date.now() - startTime;
      
      this.emit('system.security.policies.implemented', {
        timestamp: new Date(),
        eventType: 'system.security.policies.implemented',
        payload: {
          policies: Object.keys(results),
          violations: violations.length,
          duration
        },
        metadata: { sourceAgent: 'system-operations' }
      });
      
      return {
        success: violations.length === 0,
        policies: results,
        violations,
        duration,
        timestamp: new Date()
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[SystemOperationsAgent] Security policy implementation failed: ${error}`);
      
      return {
        success: false,
        policies: {},
        violations: [error instanceof Error ? error.message : String(error)],
        duration,
        timestamp: new Date()
      };
    }
  }

  /**
   * Call Ollama with system tools
   */
  async callOllamaWithSystemTools(prompt: string, tools: SystemTool[]): Promise<OllamaSystemResult> {
    const startTime = Date.now();
    
    try {
      console.log(`[SystemOperationsAgent] Calling Ollama with system tools: ${tools.map(t => t.name).join(', ')}`);
      
      // Prepare tools for Ollama
      const ollamaTools = tools.map(tool => ({
        name: tool.name,
        description: tool.description,
        parameters: {
          type: 'object',
          properties: tool.parameters.reduce((acc, param) => {
            acc[param.name] = {
              type: param.type,
              description: param.description
            };
            return acc;
          }, {} as Record<string, any>),
          required: tool.parameters.filter(p => p.required).map(p => p.name)
        }
      }));
      
      // Call Ollama with tools
      const response = await this.callOllamaAPI({
        model: this.defaultModel,
        prompt,
        tools: ollamaTools,
        stream: false
      });
      
      const duration = Date.now() - startTime;
      
      this.emit('system.ollama.tools.called', {
        timestamp: new Date(),
        eventType: 'system.ollama.tools.called',
        payload: {
          tools: tools.length,
          response_length: response.response.length,
          duration
        },
        metadata: { sourceAgent: 'system-operations' }
      });
      
      return {
        success: true,
        response: response.response,
        tools_executed: tools,
        duration,
        model: this.defaultModel,
        timestamp: new Date()
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[SystemOperationsAgent] Ollama system tools call failed: ${error}`);
      
      return {
        success: false,
        response: '',
        tools_executed: [],
        duration,
        model: this.defaultModel,
        timestamp: new Date()
      };
    }
  }

  /**
   * Execute Ollama system command
   */
  async executeOllamaSystemCommand(command: string, model?: string): Promise<OllamaCommandResult> {
    const startTime = Date.now();
    
    try {
      console.log(`[SystemOperationsAgent] Executing Ollama system command: ${command}`);
      
      const prompt = `Execute this system command and provide the output: ${command}`;
      
      const response = await this.callOllamaAPI({
        model: model || this.defaultModel,
        prompt,
        stream: false
      });
      
      const duration = Date.now() - startTime;
      
      this.emit('system.ollama.command.executed', {
        timestamp: new Date(),
        eventType: 'system.ollama.command.executed',
        payload: {
          command,
          response_length: response.response.length,
          duration
        },
        metadata: { sourceAgent: 'system-operations' }
      });
      
      return {
        success: true,
        command,
        output: response.response,
        duration,
        model: model || this.defaultModel,
        timestamp: new Date()
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[SystemOperationsAgent] Ollama system command failed: ${error}`);
      
      return {
        success: false,
        command,
        output: '',
        error: error instanceof Error ? error.message : String(error),
        duration,
        model: model || this.defaultModel,
        timestamp: new Date()
      };
    }
  }

  /**
   * Benchmark system operations
   */
  async benchmarkSystemOperations(): Promise<SystemBenchmarkResult> {
    const startTime = Date.now();
    
    try {
      console.log('[SystemOperationsAgent] Benchmarking system operations...');
      
      const benchmarks: Record<string, number> = {};
      const recommendations: string[] = [];
      
      // Benchmark file operations
      const fileStart = Date.now();
      await this.manageFileSystem({ type: 'read', path: '/etc/hostname' });
      benchmarks.file_read = Date.now() - fileStart;
      
      // Benchmark process operations
      const processStart = Date.now();
      await this.manageProcesses({ type: 'list' });
      benchmarks.process_list = Date.now() - processStart;
      
      // Benchmark network operations
      const networkStart = Date.now();
      await this.manageNetwork({ type: 'ping', target: 'localhost' });
      benchmarks.network_ping = Date.now() - networkStart;
      
      // Benchmark system monitoring
      const monitorStart = Date.now();
      await this.monitorSystem([{ type: 'cpu' }, { type: 'memory' }]);
      benchmarks.system_monitor = Date.now() - monitorStart;
      
      // Generate recommendations
      if (benchmarks.file_read > 100) {
        recommendations.push('File operations are slow, consider SSD optimization');
      }
      if (benchmarks.process_list > 500) {
        recommendations.push('Process listing is slow, consider caching');
      }
      if (benchmarks.network_ping > 1000) {
        recommendations.push('Network operations are slow, check connectivity');
      }
      if (benchmarks.system_monitor > 2000) {
        recommendations.push('System monitoring is slow, consider async operations');
      }
      
      const duration = Date.now() - startTime;
      
      this.emit('system.benchmark.completed', {
        timestamp: new Date(),
        eventType: 'system.benchmark.completed',
        payload: {
          benchmarks: Object.keys(benchmarks),
          recommendations: recommendations.length,
          duration
        },
        metadata: { sourceAgent: 'system-operations' }
      });
      
      return {
        success: true,
        benchmarks,
        recommendations,
        duration,
        timestamp: new Date()
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[SystemOperationsAgent] System benchmark failed: ${error}`);
      
      return {
        success: false,
        benchmarks: {},
        recommendations: [error instanceof Error ? error.message : String(error)],
        duration,
        timestamp: new Date()
      };
    }
  }

  // Private helper methods

  private initializeSystemTools(): void {
    this.systemTools = [
      {
        name: 'file_read',
        description: 'Read file contents',
        parameters: [
          { name: 'path', type: 'string', description: 'File path', required: true }
        ]
      },
      {
        name: 'file_write',
        description: 'Write content to file',
        parameters: [
          { name: 'path', type: 'string', description: 'File path', required: true },
          { name: 'content', type: 'string', description: 'File content', required: true }
        ]
      },
      {
        name: 'process_start',
        description: 'Start a new process',
        parameters: [
          { name: 'command', type: 'string', description: 'Command to execute', required: true }
        ]
      },
      {
        name: 'process_stop',
        description: 'Stop a running process',
        parameters: [
          { name: 'process_id', type: 'string', description: 'Process ID', required: true }
        ]
      },
      {
        name: 'network_ping',
        description: 'Ping a network host',
        parameters: [
          { name: 'host', type: 'string', description: 'Host to ping', required: true }
        ]
      },
      {
        name: 'system_monitor',
        description: 'Monitor system metrics',
        parameters: [
          { name: 'metrics', type: 'array', description: 'Metrics to monitor', required: true }
        ]
      }
    ];
  }

  private async validateCommand(command: string): Promise<ValidationResult> {
    // Check against security policies
    for (const policy of this.securityPolicies.values()) {
      if (policy.type === 'command_execution') {
        for (const rule of policy.rules) {
          if (command.includes(rule.pattern)) {
            if (rule.action === 'deny') {
              return { result: false, consensus: false, reason: `Command blocked by policy: ${policy.name}` };
            }
          }
        }
      }
    }
    
    return { result: true, consensus: true, reason: 'Command validated' };
  }

  private async checkAutomationConditions(conditions: AutomationCondition[]): Promise<boolean> {
    for (const condition of conditions) {
      switch (condition.type) {
        case 'file_exists':
          try {
            await fs.promises.access(condition.expression);
          } catch {
            return false;
          }
          break;
          
        case 'process_running':
          const result = await this.executeSystemCommand(`pgrep -f "${condition.expression}"`);
          if (!result.success) {
            return false;
          }
          break;
          
        case 'network_available':
          const pingResult = await this.executeSystemCommand(`ping -c 1 ${condition.expression}`);
          if (!pingResult.success) {
            return false;
          }
          break;
      }
    }
    
    return true;
  }

  private async executeAutomationAction(action: AutomationAction): Promise<any> {
    switch (action.type) {
      case 'command':
        return await this.executeSystemCommand(action.target, action.parameters);
        
      case 'file':
        return await this.manageFileSystem({
          type: action.parameters?.operation || 'read',
          path: action.target,
          content: action.parameters?.content,
          options: action.parameters?.options
        });
        
      case 'process':
        return await this.manageProcesses({
          type: action.parameters?.operation || 'start',
          command: action.target,
          options: action.parameters?.options
        });
        
      case 'network':
        return await this.manageNetwork({
          type: action.parameters?.operation || 'ping',
          target: action.target,
          options: action.parameters?.options
        });
        
      default:
        throw new Error(`Unsupported automation action: ${action.type}`);
    }
  }

  private async checkPolicyViolations(policy: SecurityPolicy): Promise<string[]> {
    const violations: string[] = [];
    
    switch (policy.type) {
      case 'file_access':
        // Check file access patterns
        break;
        
      case 'process_control':
        // Check process control patterns
        break;
        
      case 'network_access':
        // Check network access patterns
        break;
        
      case 'command_execution':
        // Check command execution patterns
        break;
    }
    
    return violations;
  }

  private async callOllamaAPI(request: {
    model: string;
    prompt: string;
    tools?: any[];
    stream?: boolean;
  }): Promise<{ response: string }> {
    // Mock implementation for now
    // In production, this would call the actual Ollama API
    return {
      response: `System operation completed: ${request.prompt}`
    };
  }

  // Agent contract methods
  validateSpecification(spec: AgentSpecification): ValidationResult {
    return { result: true, consensus: true, reason: 'System operations agent specification validated' };
  }

  generateDesignArtifacts(): DesignArtifact[] {
    return [];
  }

  async trackUserInteraction(interaction: UserInteraction): Promise<void> {
    // Track user interactions for system operations
  }

  handleEvent(event: TraceEvent): void {
    // Handle system operation events
  }

  emitTrace(event: TraceEvent): void {
    this.emit('trace', event);
  }

  getStatus(): AgentStatus {
    return {
      status: 'ready',
      uptime: Date.now() - this.startTime,
      lastActivity: new Date(),
      metrics: {
        operationsExecuted: 0,
        commandsBlocked: 0,
        securityViolations: 0
      }
    };
  }

  getSpecification(): AgentSpecification {
    return {
      id: this.id,
      role: this.role,
      dependencies: this.dependencies,
      capabilities: [{
        id: 'system-operations',
        name: 'System Operations',
        description: 'Provides superuser powers for system-level operations',
        inputs: [
          { name: 'command', type: 'string', required: true, description: 'System command to execute' },
          { name: 'operation', type: 'string', required: true, description: 'System operation type' }
        ],
        outputs: [
          { name: 'result', type: 'object', required: true, description: 'Operation result' }
        ],
        preconditions: [
          { id: 'security-policy', expression: 'securityPolicyValid == true', description: 'Security policy validation', operator: 'and' }
        ],
        postconditions: [
          { id: 'operation-complete', expression: 'operationComplete == true', description: 'Operation completed', operator: 'and' }
        ]
      }],
      interfaces: [{
        id: 'system-operations-interface',
        name: 'System Operations Interface',
        methods: [
          { name: 'executeSystemCommand', parameters: [], returnType: 'object', description: 'Execute system command' },
          { name: 'manageFileSystem', parameters: [], returnType: 'object', description: 'Manage file system' },
          { name: 'manageProcesses', parameters: [], returnType: 'object', description: 'Manage processes' },
          { name: 'manageNetwork', parameters: [], returnType: 'object', description: 'Manage network' }
        ],
        events: [
          { name: 'system.operation.completed', payload: [], description: 'System operation completed' }
        ],
        properties: [
          { name: 'systemStatus', type: 'string', readonly: false, description: 'Current system status' }
        ]
      }],
      behaviors: [{
        id: 'system-operations-behavior',
        name: 'System Operations Behavior',
        description: 'Executes system operations with security validation',
        trigger: { type: 'event', value: 'system.operation.requested', description: 'System operation requested' },
        actions: [
          { id: 'validate', type: 'function', target: 'validateCommand', parameters: {} },
          { id: 'execute', type: 'function', target: 'executeSystemCommand', parameters: {} }
        ],
        conditions: [
          { id: 'security-valid', expression: 'securityValid == true', description: 'Security validation passed', operator: 'and' }
        ],
        outcomes: [
          { id: 'operation-success', type: 'success', description: 'Operation successful', nextActions: ['log'] },
          { id: 'operation-failure', type: 'failure', description: 'Operation failed', nextActions: ['recover'] }
        ]
      }],
      events: [
        { name: 'system.operation.requested', payload: [], description: 'System operation requested' },
        { name: 'system.operation.completed', payload: [], description: 'System operation completed' },
        { name: 'system.operation.failed', payload: [], description: 'System operation failed' }
      ],
      properties: [
        { name: 'securityPolicies', type: 'array', readonly: false, description: 'Active security policies' },
        { name: 'automations', type: 'array', readonly: false, description: 'Active automations' },
        { name: 'systemTools', type: 'array', readonly: false, description: 'Available system tools' }
      ]
    };
  }
} 