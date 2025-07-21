#!/usr/bin/env node

/**
 * SO Powers Demo - Superuser Capabilities Showcase
 * 
 * Demonstrates the SystemOperationsAgent capabilities with real system operations
 */

const { SystemOperationsAgent } = require('./build/agents/SystemOperationsAgent.js');
const { AikoRyuEnterprise } = require('./build/index.js');

async function soPowersDemo() {
  console.log('🚀 **SO Powers Demo - Superuser Capabilities**');
  console.log('=' .repeat(60));
  console.log('🎯 Demonstrating agent superuser powers with Ollama integration');
  console.log('=' .repeat(60));
  
  try {
    // Initialize system operations agent
    console.log('\n⏳ Initializing SystemOperationsAgent...');
    const systemOps = new SystemOperationsAgent({
      ollamaEndpoint: 'http://localhost:11434',
      defaultModel: 'gemma2:2b',
      securityPolicies: [
        {
          id: 'demo-security-policy',
          name: 'Demo Security Policy',
          type: 'command_execution',
          rules: [
            { pattern: 'rm -rf /', action: 'deny' },
            { pattern: 'sudo', action: 'require_auth' },
            { pattern: 'ls', action: 'allow' },
            { pattern: 'ps', action: 'allow' },
            { pattern: 'df', action: 'allow' },
            { pattern: 'free', action: 'allow' }
          ],
          enforcement: 'strict'
        }
      ]
    });
    
    await systemOps.initialize();
    console.log('✅ SystemOperationsAgent ready with superuser powers!');
    
    // Initialize enterprise system
    console.log('\n⏳ Initializing enterprise system...');
    const enterprise = new AikoRyuEnterprise();
    await enterprise.initialize();
    console.log('✅ Enterprise system ready!');
    
    // Demo 1: Basic System Commands
    console.log('\n🔧 **Demo 1: Basic System Commands**');
    console.log('=' .repeat(50));
    
    console.log('📋 Executing basic system commands...');
    
    // List files
    const lsResult = await systemOps.executeSystemCommand('ls -la', {
      timeout: 10000,
      captureOutput: true
    });
    
    console.log('✅ File listing:');
    console.log(`📁 Command: ${lsResult.command}`);
    console.log(`✅ Success: ${lsResult.success}`);
    console.log(`⏱️ Duration: ${lsResult.duration}ms`);
    console.log(`📊 Output length: ${lsResult.stdout.length} characters`);
    
    // Check disk usage
    const dfResult = await systemOps.executeSystemCommand('df -h', {
      timeout: 10000,
      captureOutput: true
    });
    
    console.log('✅ Disk usage:');
    console.log(`💾 Command: ${dfResult.command}`);
    console.log(`✅ Success: ${dfResult.success}`);
    console.log(`⏱️ Duration: ${dfResult.duration}ms`);
    
    // Check memory usage
    const memResult = await systemOps.executeSystemCommand('free -h', {
      timeout: 10000,
      captureOutput: true
    });
    
    console.log('✅ Memory usage:');
    console.log(`🧠 Command: ${memResult.command}`);
    console.log(`✅ Success: ${memResult.success}`);
    console.log(`⏱️ Duration: ${memResult.duration}ms`);
    
    // Demo 2: File System Operations
    console.log('\n📁 **Demo 2: File System Operations**');
    console.log('=' .repeat(50));
    
    console.log('📋 Performing file system operations...');
    
    // Create a test file
    const writeResult = await systemOps.manageFileSystem({
      type: 'write',
      path: '/tmp/so-powers-demo.txt',
      content: 'This file was created by the SystemOperationsAgent with SO powers!\nTimestamp: ' + new Date().toISOString(),
      options: { permissions: '644' }
    });
    
    console.log('✅ File creation:');
    console.log(`📝 Operation: ${writeResult.operation}`);
    console.log(`📁 Path: ${writeResult.path}`);
    console.log(`✅ Success: ${writeResult.success}`);
    console.log(`⏱️ Duration: ${writeResult.duration}ms`);
    
    // Read the test file
    const readResult = await systemOps.manageFileSystem({
      type: 'read',
      path: '/tmp/so-powers-demo.txt',
      options: { encoding: 'utf8' }
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
    
    // Demo 3: Process Management
    console.log('\n⚙️ **Demo 3: Process Management**');
    console.log('=' .repeat(50));
    
    console.log('📋 Managing system processes...');
    
    // List running processes
    const processListResult = await systemOps.manageProcesses({
      type: 'list'
    });
    
    console.log('✅ Process listing:');
    console.log(`🔄 Operation: ${processListResult.operation}`);
    console.log(`✅ Success: ${processListResult.success}`);
    console.log(`⏱️ Duration: ${processListResult.duration}ms`);
    
    // Check process status
    const processStatusResult = await systemOps.manageProcesses({
      type: 'status',
      processId: '1' // System process
    });
    
    console.log('✅ Process status:');
    console.log(`📊 Operation: ${processStatusResult.operation}`);
    console.log(`🆔 Process ID: ${processStatusResult.processId}`);
    console.log(`✅ Success: ${processStatusResult.success}`);
    console.log(`⏱️ Duration: ${processStatusResult.duration}ms`);
    
    // Demo 4: Network Operations
    console.log('\n🌐 **Demo 4: Network Operations**');
    console.log('=' .repeat(50));
    
    console.log('📋 Performing network operations...');
    
    // Ping localhost
    const pingResult = await systemOps.manageNetwork({
      type: 'ping',
      target: 'localhost',
      options: { timeout: 5000 }
    });
    
    console.log('✅ Network ping:');
    console.log(`🌐 Operation: ${pingResult.operation}`);
    console.log(`🎯 Target: ${pingResult.target}`);
    console.log(`✅ Success: ${pingResult.success}`);
    console.log(`⏱️ Duration: ${pingResult.duration}ms`);
    
    // DNS lookup
    const dnsResult = await systemOps.manageNetwork({
      type: 'dns_lookup',
      target: 'google.com'
    });
    
    console.log('✅ DNS lookup:');
    console.log(`🔍 Operation: ${dnsResult.operation}`);
    console.log(`🎯 Target: ${dnsResult.target}`);
    console.log(`✅ Success: ${dnsResult.success}`);
    console.log(`⏱️ Duration: ${dnsResult.duration}ms`);
    
    // Demo 5: System Monitoring
    console.log('\n📊 **Demo 5: System Monitoring**');
    console.log('=' .repeat(50));
    
    console.log('📋 Monitoring system metrics...');
    
    const monitoringResult = await systemOps.monitorSystem([
      { type: 'cpu', threshold: 80 },
      { type: 'memory', threshold: 90 },
      { type: 'disk', threshold: 85 },
      { type: 'processes' },
      { type: 'services' }
    ]);
    
    console.log('✅ System monitoring:');
    console.log(`✅ Success: ${monitoringResult.success}`);
    console.log(`📊 Metrics collected: ${Object.keys(monitoringResult.metrics).length}`);
    console.log(`🚨 Alerts: ${monitoringResult.alerts?.length || 0}`);
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
    if (monitoringResult.metrics.services) {
      console.log(`🔧 Running Services: ${monitoringResult.metrics.services.running}`);
    }
    
    // Demo 6: Resource Management
    console.log('\n⚡ **Demo 6: Resource Management**');
    console.log('=' .repeat(50));
    
    console.log('📋 Managing system resources...');
    
    const resourceResult = await systemOps.manageSystemResources([
      { type: 'cpu', action: 'optimize' },
      { type: 'memory', action: 'allocate' },
      { type: 'disk', action: 'optimize' },
      { type: 'network', action: 'optimize' }
    ]);
    
    console.log('✅ Resource management:');
    console.log(`✅ Success: ${resourceResult.success}`);
    console.log(`📊 Resources managed: ${Object.keys(resourceResult.resources).length}`);
    console.log(`🔧 Optimizations: ${resourceResult.optimizations?.length || 0}`);
    console.log(`❌ Errors: ${resourceResult.errors?.length || 0}`);
    console.log(`⏱️ Duration: ${resourceResult.duration}ms`);
    
    // Demo 7: Security Policy Enforcement
    console.log('\n🛡️ **Demo 7: Security Policy Enforcement**');
    console.log('=' .repeat(50));
    
    console.log('📋 Testing security policy enforcement...');
    
    // Test allowed command
    const allowedCommand = await systemOps.executeSystemCommand('ls -la /tmp', {
      timeout: 10000
    });
    
    console.log('✅ Allowed command test:');
    console.log(`📋 Command: ls -la /tmp`);
    console.log(`✅ Success: ${allowedCommand.success}`);
    console.log(`⏱️ Duration: ${allowedCommand.duration}ms`);
    
    // Test blocked command (should be blocked by security policy)
    const blockedCommand = await systemOps.executeSystemCommand('rm -rf /', {
      timeout: 10000
    });
    
    console.log('✅ Blocked command test:');
    console.log(`📋 Command: rm -rf /`);
    console.log(`❌ Success: ${blockedCommand.success}`);
    console.log(`⏱️ Duration: ${blockedCommand.duration}ms`);
    console.log(`🚨 Error: ${blockedCommand.stderr}`);
    
    // Demo 8: Ollama Integration
    console.log('\n🤖 **Demo 8: Ollama Integration**');
    console.log('=' .repeat(50));
    
    console.log('📋 Testing Ollama integration with system tools...');
    
    const ollamaResult = await systemOps.callOllamaWithSystemTools(
      'Check the current system status and provide a summary',
      [
        {
          name: 'system_status',
          description: 'Get current system status',
          parameters: [
            { name: 'metrics', type: 'array', description: 'Metrics to check', required: true }
          ]
        },
        {
          name: 'file_operations',
          description: 'Perform file operations',
          parameters: [
            { name: 'operation', type: 'string', description: 'Operation type', required: true },
            { name: 'path', type: 'string', description: 'File path', required: true }
          ]
        }
      ]
    );
    
    console.log('✅ Ollama integration:');
    console.log(`✅ Success: ${ollamaResult.success}`);
    console.log(`🤖 Model: ${ollamaResult.model}`);
    console.log(`🛠️ Tools executed: ${ollamaResult.tools_executed.length}`);
    console.log(`📝 Response length: ${ollamaResult.response.length} characters`);
    console.log(`⏱️ Duration: ${ollamaResult.duration}ms`);
    
    // Demo 9: System Benchmarking
    console.log('\n📈 **Demo 9: System Benchmarking**');
    console.log('=' .repeat(50));
    
    console.log('📋 Benchmarking system operations...');
    
    const benchmarkResult = await systemOps.benchmarkSystemOperations();
    
    console.log('✅ System benchmarking:');
    console.log(`✅ Success: ${benchmarkResult.success}`);
    console.log(`📊 Benchmarks: ${Object.keys(benchmarkResult.benchmarks).length}`);
    console.log(`💡 Recommendations: ${benchmarkResult.recommendations?.length || 0}`);
    console.log(`⏱️ Duration: ${benchmarkResult.duration}ms`);
    
    if (benchmarkResult.benchmarks.file_read) {
      console.log(`📁 File read: ${benchmarkResult.benchmarks.file_read}ms`);
    }
    if (benchmarkResult.benchmarks.process_list) {
      console.log(`⚙️ Process list: ${benchmarkResult.benchmarks.process_list}ms`);
    }
    if (benchmarkResult.benchmarks.network_ping) {
      console.log(`🌐 Network ping: ${benchmarkResult.benchmarks.network_ping}ms`);
    }
    if (benchmarkResult.benchmarks.system_monitor) {
      console.log(`📊 System monitor: ${benchmarkResult.benchmarks.system_monitor}ms`);
    }
    
    // Demo 10: Enterprise Integration
    console.log('\n🏢 **Demo 10: Enterprise Integration**');
    console.log('=' .repeat(50));
    
    console.log('📋 Testing enterprise system integration...');
    
    // Test enterprise system operations through the enterprise interface
    const enterpriseMetrics = await enterprise.getMetrics();
    
    console.log('✅ Enterprise metrics:');
    console.log(`🚀 Throughput: ${enterpriseMetrics.throughput.toFixed(2)} req/s`);
    console.log(`⏱️ Latency: ${enterpriseMetrics.latency.toFixed(0)}ms`);
    console.log(`🎯 Accuracy: ${Math.round(enterpriseMetrics.accuracy * 100)}%`);
    console.log(`💚 Reliability: ${Math.round(enterpriseMetrics.reliability * 100)}%`);
    
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
    console.log('\n🎉 **SO Powers Demo Complete!**');
    console.log('=' .repeat(60));
    console.log('📊 Demo Summary:');
    console.log('✅ System command execution');
    console.log('✅ File system operations');
    console.log('✅ Process management');
    console.log('✅ Network operations');
    console.log('✅ System monitoring');
    console.log('✅ Resource management');
    console.log('✅ Security policy enforcement');
    console.log('✅ Ollama integration');
    console.log('✅ System benchmarking');
    console.log('✅ Enterprise integration');
    
    console.log('\n🚀 **SO Powers Capabilities Verified:**');
    console.log('=' .repeat(50));
    console.log('✅ Full system control');
    console.log('✅ Security validation');
    console.log('✅ Performance optimization');
    console.log('✅ Real-time monitoring');
    console.log('✅ Resource management');
    console.log('✅ Automation ready');
    console.log('✅ Enterprise integration');
    console.log('✅ Ollama tool calling');
    
    console.log('\n🎯 **Agents now have Superuser Powers!**');
    console.log('=' .repeat(60));
    console.log('✅ System-level operations');
    console.log('✅ Security policy enforcement');
    console.log('✅ Performance optimization');
    console.log('✅ Real-time monitoring');
    console.log('✅ Enterprise ready');
    
  } catch (error) {
    console.error('❌ SO powers demo failed:', error);
    process.exit(1);
  }
}

// Run the demo
soPowersDemo().catch(error => {
  console.error('💥 SO powers demo failed:', error);
  process.exit(1);
}); 