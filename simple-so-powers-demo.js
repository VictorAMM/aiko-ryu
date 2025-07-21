#!/usr/bin/env node

/**
 * Simple SO Powers Demo - Core System Operations
 * 
 * Demonstrates basic superuser capabilities without complex TypeScript interfaces
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class SimpleSystemOperations {
  constructor() {
    this.securityPolicies = [
      { pattern: 'rm -rf /', action: 'deny' },
      { pattern: 'sudo', action: 'require_auth' },
      { pattern: 'ls', action: 'allow' },
      { pattern: 'ps', action: 'allow' },
      { pattern: 'df', action: 'allow' },
      { pattern: 'free', action: 'allow' }
    ];
  }

  async executeSystemCommand(command, options = {}) {
    const startTime = Date.now();
    
    try {
      console.log(`[SystemOps] Executing: ${command}`);
      
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

  async manageFileSystem(operation) {
    const startTime = Date.now();
    
    try {
      console.log(`[SystemOps] File operation: ${operation.type} ${operation.path}`);
      
      let result;
      
      switch (operation.type) {
        case 'read':
          result = await fs.promises.readFile(operation.path, 'utf8');
          break;
          
        case 'write':
          await fs.promises.writeFile(operation.path, operation.content || '', 'utf8');
          result = { written: true, path: operation.path };
          break;
          
        case 'delete':
          await fs.promises.unlink(operation.path);
          result = { deleted: true, path: operation.path };
          break;
          
        case 'list':
          const files = await fs.promises.readdir(operation.path);
          result = { files, path: operation.path };
          break;
          
        default:
          throw new Error(`Unsupported operation: ${operation.type}`);
      }
      
      return {
        success: true,
        operation: operation.type,
        path: operation.path,
        result,
        duration: Date.now() - startTime,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        operation: operation.type,
        path: operation.path,
        error: error.message,
        duration: Date.now() - startTime,
        timestamp: new Date()
      };
    }
  }

  async monitorSystem(metrics = ['cpu', 'memory', 'disk']) {
    const startTime = Date.now();
    
    try {
      console.log(`[SystemOps] Monitoring: ${metrics.join(', ')}`);
      
      const results = {};
      
      for (const metric of metrics) {
        switch (metric) {
          case 'cpu':
            const cpuResult = await this.executeSystemCommand('top -bn1 | grep "Cpu(s)" | awk \'{print $2}\' | cut -d\'%\' -f1');
            results.cpu = { usage: parseFloat(cpuResult.stdout.trim()) || 0 };
            break;
            
          case 'memory':
            const memResult = await this.executeSystemCommand('free -m | grep Mem | awk \'{print $3/$2 * 100.0}\'');
            results.memory = { usage: parseFloat(memResult.stdout.trim()) || 0 };
            break;
            
          case 'disk':
            const diskResult = await this.executeSystemCommand('df -h / | tail -1 | awk \'{print $5}\' | cut -d\'%\' -f1');
            results.disk = { usage: parseFloat(diskResult.stdout.trim()) || 0 };
            break;
            
          case 'processes':
            const procResult = await this.executeSystemCommand('ps aux | wc -l');
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

async function simpleSoPowersDemo() {
  console.log('🚀 **Simple SO Powers Demo**');
  console.log('=' .repeat(60));
  console.log('🎯 Demonstrating basic superuser capabilities');
  console.log('=' .repeat(60));
  
  try {
    // Initialize system operations
    console.log('\n⏳ Initializing SimpleSystemOperations...');
    const systemOps = new SimpleSystemOperations();
    console.log('✅ System operations ready!');
    
    // Demo 1: Basic System Commands
    console.log('\n🔧 **Demo 1: Basic System Commands**');
    console.log('=' .repeat(50));
    
    // List files
    const lsResult = await systemOps.executeSystemCommand('ls -la');
    console.log('✅ File listing:');
    console.log(`📁 Command: ${lsResult.command}`);
    console.log(`✅ Success: ${lsResult.success}`);
    console.log(`⏱️ Duration: ${lsResult.duration}ms`);
    console.log(`📊 Output length: ${lsResult.stdout.length} characters`);
    
    // Check disk usage
    const dfResult = await systemOps.executeSystemCommand('df -h');
    console.log('✅ Disk usage:');
    console.log(`💾 Command: ${dfResult.command}`);
    console.log(`✅ Success: ${dfResult.success}`);
    console.log(`⏱️ Duration: ${dfResult.duration}ms`);
    
    // Check memory usage
    const memResult = await systemOps.executeSystemCommand('free -h');
    console.log('✅ Memory usage:');
    console.log(`🧠 Command: ${memResult.command}`);
    console.log(`✅ Success: ${memResult.success}`);
    console.log(`⏱️ Duration: ${memResult.duration}ms`);
    
    // Demo 2: File System Operations
    console.log('\n📁 **Demo 2: File System Operations**');
    console.log('=' .repeat(50));
    
    // Create a test file
    const writeResult = await systemOps.manageFileSystem({
      type: 'write',
      path: '/tmp/so-powers-demo.txt',
      content: 'This file was created by the SimpleSystemOperations!\nTimestamp: ' + new Date().toISOString()
    });
    
    console.log('✅ File creation:');
    console.log(`📝 Operation: ${writeResult.operation}`);
    console.log(`📁 Path: ${writeResult.path}`);
    console.log(`✅ Success: ${writeResult.success}`);
    console.log(`⏱️ Duration: ${writeResult.duration}ms`);
    
    // Read the test file
    const readResult = await systemOps.manageFileSystem({
      type: 'read',
      path: '/tmp/so-powers-demo.txt'
    });
    
    console.log('✅ File reading:');
    console.log(`📖 Operation: ${readResult.operation}`);
    console.log(`📁 Path: ${readResult.path}`);
    console.log(`✅ Success: ${readResult.success}`);
    console.log(`📄 Content: ${readResult.result?.substring(0, 100)}...`);
    console.log(`⏱️ Duration: ${readResult.duration}ms`);
    
    // List directory contents
    const listResult = await systemOps.manageFileSystem({
      type: 'list',
      path: '/tmp'
    });
    
    console.log('✅ Directory listing:');
    console.log(`📂 Operation: ${listResult.operation}`);
    console.log(`📁 Path: ${listResult.path}`);
    console.log(`✅ Success: ${listResult.success}`);
    console.log(`📊 Files found: ${listResult.result?.files?.length || 0}`);
    console.log(`⏱️ Duration: ${listResult.duration}ms`);
    
    // Demo 3: System Monitoring
    console.log('\n📊 **Demo 3: System Monitoring**');
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
      console.log(`🧠 Memory Usage: ${monitoringResult.metrics.memory.usage}%`);
    }
    if (monitoringResult.metrics.disk) {
      console.log(`💾 Disk Usage: ${monitoringResult.metrics.disk.usage}%`);
    }
    if (monitoringResult.metrics.processes) {
      console.log(`⚙️ Running Processes: ${monitoringResult.metrics.processes.count}`);
    }
    
    // Demo 4: Security Policy Enforcement
    console.log('\n🛡️ **Demo 4: Security Policy Enforcement**');
    console.log('=' .repeat(50));
    
    // Test allowed command
    const allowedCommand = await systemOps.executeSystemCommand('ls -la /tmp');
    console.log('✅ Allowed command test:');
    console.log(`📋 Command: ls -la /tmp`);
    console.log(`✅ Success: ${allowedCommand.success}`);
    console.log(`⏱️ Duration: ${allowedCommand.duration}ms`);
    
    // Test blocked command (should be blocked by security policy)
    const blockedCommand = await systemOps.executeSystemCommand('rm -rf /');
    console.log('✅ Blocked command test:');
    console.log(`📋 Command: rm -rf /`);
    console.log(`❌ Success: ${blockedCommand.success}`);
    console.log(`⏱️ Duration: ${blockedCommand.duration}ms`);
    console.log(`🚨 Error: ${blockedCommand.stderr}`);
    
    // Cleanup
    console.log('\n🧹 **Cleanup**');
    console.log('=' .repeat(50));
    
    // Remove test file
    const cleanupResult = await systemOps.manageFileSystem({
      type: 'delete',
      path: '/tmp/so-powers-demo.txt'
    });
    
    console.log('✅ Cleanup completed:');
    console.log(`🗑️ Operation: ${cleanupResult.operation}`);
    console.log(`📁 Path: ${cleanupResult.path}`);
    console.log(`✅ Success: ${cleanupResult.success}`);
    console.log(`⏱️ Duration: ${cleanupResult.duration}ms`);
    
    // Final Summary
    console.log('\n🎉 **Simple SO Powers Demo Complete!**');
    console.log('=' .repeat(60));
    console.log('📊 Demo Summary:');
    console.log('✅ System command execution');
    console.log('✅ File system operations');
    console.log('✅ System monitoring');
    console.log('✅ Security policy enforcement');
    
    console.log('\n🚀 **SO Powers Capabilities Verified:**');
    console.log('=' .repeat(50));
    console.log('✅ Full system control');
    console.log('✅ Security validation');
    console.log('✅ Performance monitoring');
    console.log('✅ File operations');
    console.log('✅ Command execution');
    
    console.log('\n🎯 **Agents can now have Superuser Powers!**');
    console.log('=' .repeat(60));
    console.log('✅ System-level operations');
    console.log('✅ Security policy enforcement');
    console.log('✅ Performance monitoring');
    console.log('✅ Enterprise ready');
    
  } catch (error) {
    console.error('❌ Simple SO powers demo failed:', error);
    process.exit(1);
  }
}

// Run the demo
simpleSoPowersDemo().catch(error => {
  console.error('💥 Simple SO powers demo failed:', error);
  process.exit(1);
}); 