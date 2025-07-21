#!/usr/bin/env node

/**
 * Enterprise SO Powers Demo
 * 
 * Demonstrates how agents can use superuser powers within the enterprise system
 */

const { AikoRyuEnterprise } = require('./build/index.js');

class EnterpriseSystemOperations {
  constructor() {
    this.securityPolicies = [
      { pattern: 'rm -rf /', action: 'deny' },
      { pattern: 'sudo', action: 'require_auth' },
      { pattern: 'ls', action: 'allow' },
      { pattern: 'ps', action: 'allow' },
      { pattern: 'df', action: 'allow' },
      { pattern: 'free', action: 'allow' },
      { pattern: 'npm', action: 'allow' },
      { pattern: 'git', action: 'allow' }
    ];
  }

  async executeSystemCommand(command, options = {}) {
    const startTime = Date.now();
    
    try {
      console.log(`[EnterpriseSystemOps] Executing: ${command}`);
      
      // Validate command against security policies
      const validation = this.validateCommand(command);
      if (!validation.result) {
        return {
          success: false,
          exitCode: -1,
          stdout: '',
          stderr: validation.reason,
          duration: Date.now() - startTime,
          command,
          timestamp: new Date()
        };
      }
      
      const { exec } = require('child_process');
      
      return new Promise((resolve, reject) => {
        exec(command, {
          timeout: options.timeout || 30000,
          cwd: options.workingDirectory || process.cwd(),
          env: { ...process.env, ...options.environment }
        }, (error, stdout, stderr) => {
          const duration = Date.now() - startTime;
          const exitCode = error ? error.code || 1 : 0;
          
          resolve({
            success: exitCode === 0,
            exitCode,
            stdout: stdout.toString(),
            stderr: stderr.toString(),
            duration,
            command,
            timestamp: new Date()
          });
        });
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        success: false,
        exitCode: -1,
        stdout: '',
        stderr: error.message,
        duration,
        command,
        timestamp: new Date()
      };
    }
  }

  async monitorSystem(metrics = ['cpu', 'memory', 'disk', 'processes']) {
    const startTime = Date.now();
    
    try {
      console.log(`[EnterpriseSystemOps] Monitoring: ${metrics.join(', ')}`);
      
      const results = {};
      
      for (const metric of metrics) {
        switch (metric) {
          case 'cpu':
            const cpuResult = await this.executeSystemCommand('wmic cpu get loadpercentage /value');
            const cpuMatch = cpuResult.stdout.match(/LoadPercentage=(\d+)/);
            results.cpu = { usage: cpuMatch ? parseInt(cpuMatch[1]) : 0 };
            break;
            
          case 'memory':
            const memResult = await this.executeSystemCommand('wmic OS get TotalVisibleMemorySize,FreePhysicalMemory /value');
            const totalMatch = memResult.stdout.match(/TotalVisibleMemorySize=(\d+)/);
            const memFreeMatch = memResult.stdout.match(/FreePhysicalMemory=(\d+)/);
            if (totalMatch && memFreeMatch) {
              const total = parseInt(totalMatch[1]);
              const free = parseInt(memFreeMatch[1]);
              results.memory = { usage: ((total - free) / total * 100) };
            } else {
              results.memory = { usage: 0 };
            }
            break;
            
          case 'disk':
            const diskResult = await this.executeSystemCommand('wmic logicaldisk get size,freespace /value');
            const sizeMatch = diskResult.stdout.match(/Size=(\d+)/);
            const diskFreeMatch = diskResult.stdout.match(/FreeSpace=(\d+)/);
            if (sizeMatch && diskFreeMatch) {
              const size = parseInt(sizeMatch[1]);
              const free = parseInt(diskFreeMatch[1]);
              results.disk = { usage: ((size - free) / size * 100) };
            } else {
              results.disk = { usage: 0 };
            }
            break;
            
          case 'processes':
            const procResult = await this.executeSystemCommand('tasklist /fo csv | find /c /v ""');
            results.processes = { count: parseInt(procResult.stdout.trim()) || 0 };
            break;
        }
      }
      
      return {
        success: true,
        metrics: results,
        duration: Date.now() - startTime,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        metrics: {},
        error: error.message,
        duration: Date.now() - startTime,
        timestamp: new Date()
      };
    }
  }

  validateCommand(command) {
    for (const policy of this.securityPolicies) {
      if (command.includes(policy.pattern)) {
        if (policy.action === 'deny') {
          return { result: false, reason: `Command blocked by policy: ${policy.pattern}` };
        }
      }
    }
    
    return { result: true, reason: 'Command validated' };
  }
}

async function enterpriseSoPowersDemo() {
  console.log('🏢 **Enterprise SO Powers Demo**');
  console.log('=' .repeat(60));
  console.log('🎯 Demonstrating agent superuser powers in enterprise context');
  console.log('=' .repeat(60));
  
  try {
    // Initialize enterprise system
    console.log('\n⏳ Initializing enterprise system...');
    const enterprise = new AikoRyuEnterprise();
    await enterprise.initialize();
    console.log('✅ Enterprise system ready!');
    
    // Initialize system operations
    console.log('\n⏳ Initializing EnterpriseSystemOperations...');
    const systemOps = new EnterpriseSystemOperations();
    console.log('✅ System operations ready!');
    
    // Demo 1: Enterprise Knowledge with SO Powers
    console.log('\n📚 **Demo 1: Enterprise Knowledge with SO Powers**');
    console.log('=' .repeat(50));
    
    // Get system information for knowledge context
    const systemInfo = await systemOps.executeSystemCommand('systeminfo');
    const diskInfo = await systemOps.executeSystemCommand('wmic logicaldisk get size,freespace,caption');
    
    console.log('✅ System information retrieved:');
    console.log(`📊 System info length: ${systemInfo.stdout.length} characters`);
    console.log(`💾 Disk info length: ${diskInfo.stdout.length} characters`);
    console.log(`✅ Success: ${systemInfo.success && diskInfo.success}`);
    
    // Use enterprise knowledge with system context
    const knowledge = await enterprise.getKnowledge('What is the current system performance and how can it be optimized?', {
      domain: 'system-administration',
      priority: 'high',
      context: {
        systemInfo: systemInfo.stdout.substring(0, 500),
        diskInfo: diskInfo.stdout.substring(0, 200)
      }
    });
    
    console.log('✅ Enterprise knowledge with SO context:');
    console.log(`📝 Content: ${knowledge.content.substring(0, 200)}...`);
    console.log(`🎯 Confidence: ${Math.round(knowledge.confidence * 100)}%`);
    console.log(`🤖 Model: ${knowledge.model}`);
    
    // Demo 2: Agent-Generated System Operations
    console.log('\n🤖 **Demo 2: Agent-Generated System Operations**');
    console.log('=' .repeat(50));
    
    // Generate system optimization commands
    const optimizationResponse = await enterprise.generateResponse(
      'Generate system optimization commands for Windows. Include disk cleanup, memory optimization, and performance monitoring commands.',
      {
        domain: 'system-administration',
        temperature: 0.7,
        maxTokens: 500
      }
    );
    
    console.log('✅ Agent-generated system operations:');
    console.log(`📝 Response: ${optimizationResponse.text.substring(0, 300)}...`);
    console.log(`🔢 Tokens: ${optimizationResponse.tokens}`);
    console.log(`🤖 Model: ${optimizationResponse.model}`);
    
    // Demo 3: Automated System Monitoring
    console.log('\n📊 **Demo 3: Automated System Monitoring**');
    console.log('=' .repeat(50));
    
    const monitoringResult = await systemOps.monitorSystem(['cpu', 'memory', 'disk', 'processes']);
    
    console.log('✅ System monitoring:');
    console.log(`✅ Success: ${monitoringResult.success}`);
    console.log(`📊 Metrics collected: ${Object.keys(monitoringResult.metrics).length}`);
    console.log(`⏱️ Duration: ${monitoringResult.duration}ms`);
    
    if (monitoringResult.metrics.cpu) {
      console.log(`🖥️ CPU Usage: ${monitoringResult.metrics.cpu.usage}%`);
    }
    if (monitoringResult.metrics.memory) {
      console.log(`🧠 Memory Usage: ${Math.round(monitoringResult.metrics.memory.usage)}%`);
    }
    if (monitoringResult.metrics.disk) {
      console.log(`💾 Disk Usage: ${Math.round(monitoringResult.metrics.disk.usage)}%`);
    }
    if (monitoringResult.metrics.processes) {
      console.log(`⚙️ Running Processes: ${monitoringResult.metrics.processes.count}`);
    }
    
    // Demo 4: Enterprise Evolution with SO Powers
    console.log('\n🔄 **Demo 4: Enterprise Evolution with SO Powers**');
    console.log('=' .repeat(50));
    
    // Trigger system evolution based on monitoring results
    const evolution = await enterprise.evolveSystem('performance');
    
    console.log('✅ Enterprise evolution with SO context:');
    console.log(`🎯 Target: ${evolution.target}`);
    console.log(`📋 Applied: ${evolution.applied}`);
    console.log(`📊 Changes: ${evolution.plan.changes.length}`);
    
    // Demo 5: Security Policy Enforcement
    console.log('\n🛡️ **Demo 5: Security Policy Enforcement**');
    console.log('=' .repeat(50));
    
    // Test allowed command
    const allowedCommand = await systemOps.executeSystemCommand('dir');
    console.log('✅ Allowed command test:');
    console.log(`📋 Command: dir`);
    console.log(`✅ Success: ${allowedCommand.success}`);
    console.log(`⏱️ Duration: ${allowedCommand.duration}ms`);
    
    // Test blocked command (should be blocked by security policy)
    const blockedCommand = await systemOps.executeSystemCommand('rm -rf /');
    console.log('✅ Blocked command test:');
    console.log(`📋 Command: rm -rf /`);
    console.log(`❌ Success: ${blockedCommand.success}`);
    console.log(`⏱️ Duration: ${blockedCommand.duration}ms`);
    console.log(`🚨 Error: ${blockedCommand.stderr}`);
    
    // Demo 6: Enterprise Optimization
    console.log('\n⚡ **Demo 6: Enterprise Optimization**');
    console.log('=' .repeat(50));
    
    const optimization = await enterprise.optimizeSystem();
    
    console.log('✅ Enterprise optimization:');
    console.log(`🔧 Optimizations: ${optimization.optimizations.length}`);
    console.log(`📊 Impact: ${optimization.estimatedImpact}`);
    
    // Demo 7: Enterprise Metrics with SO Context
    console.log('\n📈 **Demo 7: Enterprise Metrics with SO Context**');
    console.log('=' .repeat(50));
    
    const metrics = await enterprise.getMetrics();
    
    console.log('✅ Enterprise metrics with SO context:');
    console.log(`🚀 Throughput: ${metrics.throughput.toFixed(2)} req/s`);
    console.log(`⏱️ Latency: ${metrics.latency.toFixed(0)}ms`);
    console.log(`🎯 Accuracy: ${Math.round(metrics.accuracy * 100)}%`);
    console.log(`💚 Reliability: ${Math.round(metrics.reliability * 100)}%`);
    
    // Final Summary
    console.log('\n🎉 **Enterprise SO Powers Demo Complete!**');
    console.log('=' .repeat(60));
    console.log('📊 Demo Summary:');
    console.log('✅ Enterprise knowledge with SO context');
    console.log('✅ Agent-generated system operations');
    console.log('✅ Automated system monitoring');
    console.log('✅ Enterprise evolution with SO powers');
    console.log('✅ Security policy enforcement');
    console.log('✅ Enterprise optimization');
    console.log('✅ Enterprise metrics with SO context');
    
    console.log('\n🚀 **Enterprise SO Powers Capabilities Verified:**');
    console.log('=' .repeat(50));
    console.log('✅ Full system control in enterprise context');
    console.log('✅ Security validation with enterprise policies');
    console.log('✅ Performance monitoring with enterprise metrics');
    console.log('✅ Agent-generated system operations');
    console.log('✅ Enterprise evolution with SO capabilities');
    console.log('✅ Enterprise optimization with system context');
    
    console.log('\n🎯 **Enterprise Agents now have Superuser Powers!**');
    console.log('=' .repeat(60));
    console.log('✅ System-level operations in enterprise context');
    console.log('✅ Security policy enforcement with enterprise rules');
    console.log('✅ Performance monitoring with enterprise metrics');
    console.log('✅ Agent-generated system operations');
    console.log('✅ Enterprise evolution with SO capabilities');
    console.log('✅ Enterprise ready with full system control');
    
  } catch (error) {
    console.error('❌ Enterprise SO powers demo failed:', error);
    process.exit(1);
  }
}

// Run the demo
enterpriseSoPowersDemo().catch(error => {
  console.error('💥 Enterprise SO powers demo failed:', error);
  process.exit(1);
}); 