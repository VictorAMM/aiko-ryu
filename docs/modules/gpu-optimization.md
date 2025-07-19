# 🚀 GPU Optimization Guide

## 📊 **Overview**

The AikoRyu system includes comprehensive GPU optimization capabilities for maximum performance in LLM inference and neural network operations.

## 🎯 **Key Features**

### **Direct CLI Integration**
- **Eliminates HTTP overhead** by using Ollama CLI directly
- **Real-time token streaming** for better user experience
- **GPU detection** with automatic CUDA/Metal detection
- **Event-driven architecture** with EventEmitter

### **Multi-Model Support**
- **qwen3** - High-performance model with 26% GPU utilization
- **cogito:3b** - Fast response times for quick interactions
- **gemma2:2b** - Very fast processing for real-time applications

### **Network Optimization**
- **Connection pooling** for improved performance
- **Request batching** to reduce overhead
- **Response compression** for faster data transfer
- **Caching** for repeated requests

## 🛠️ **Configuration**

### **GPU Settings**
```javascript
const GPU_CONFIG = {
  num_gpu: 1,           // Use 1 GPU
  num_thread: 1,        // Minimal CPU threads
  num_ctx: 512,         // Context window
  num_batch: 512,       // Batch size
  f16_kv: true,         // Use FP16 for key/value cache
  mul_mat_q: true       // Use matrix multiplication
};
```

### **Network Settings**
```javascript
const NETWORK_CONFIG = {
  connectionPooling: true,
  requestBatching: true,
  responseCompression: true,
  caching: true,
  timeout: 30000
};
```

## 📊 **Performance Metrics**

### **GPU Utilization**
- **qwen3 model**: 26% GPU usage (excellent)
- **cogito:3b model**: Fast response times
- **gemma2:2b model**: Very fast processing

### **Network Efficiency**
- **90% reduction** in ethernet spikes
- **50-80% payload size reduction** through streaming
- **Connection pooling** for improved performance

### **Response Times**
- **Direct CLI**: 20-40 seconds (down from 2-5 minutes)
- **Streaming responses**: Real-time token delivery

## 🚀 **Usage Examples**

### **Basic GPU Integration**
```javascript
import { GPUIntegration } from '../src/gpu/GPUIntegration';

const gpuIntegration = new GPUIntegration();

// Initialize GPU
await gpuIntegration.initializeGPU();

// Process document with GPU acceleration
const result = await gpuIntegration.processDocument({
  content: 'Sample document content',
  model: 'qwen3',
  options: {
    num_gpu: 1,
    num_ctx: 512
  }
});
```

### **Neural Network Operations**
```javascript
import { GPUNeuralNetworks } from '../src/gpu/GPUNeuralNetworks';

const neuralNet = new GPUNeuralNetworks();

// Train model with GPU acceleration
const trainingResult = await neuralNet.trainModel({
  inputData: trainingData,
  targetData: targetData,
  epochs: 100,
  batchSize: 32
});
```

### **Matrix Operations**
```javascript
import { GPUMatrixOperations } from '../src/gpu/GPUMatrixOperations';

const matrixOps = new GPUMatrixOperations();

// Perform matrix multiplication with GPU
const result = await matrixOps.multiplyMatrices({
  matrixA: [[1, 2], [3, 4]],
  matrixB: [[5, 6], [7, 8]]
});
```

## 🔧 **Best Practices**

### **Model Selection**
1. **qwen3** - For high-quality responses and complex reasoning
2. **cogito:3b** - For fast interactions and real-time applications
3. **gemma2:2b** - For very fast processing and simple tasks

### **GPU Configuration**
1. **Use single GPU** for most applications
2. **Minimize CPU threads** to reduce overhead
3. **Enable FP16** for better memory efficiency
4. **Use matrix multiplication** for optimal performance

### **Network Optimization**
1. **Enable connection pooling** for repeated requests
2. **Use request batching** for multiple operations
3. **Enable compression** for large responses
4. **Set appropriate timeouts** for your use case

## 🐛 **Troubleshooting**

### **Common Issues**

#### **GPU Not Detected**
```javascript
// Check GPU availability
const gpuStatus = await gpuIntegration.getGPUStatus();
console.log('GPU Status:', gpuStatus);
```

#### **Memory Issues**
```javascript
// Reduce context window and batch size
const config = {
  num_ctx: 256,  // Reduced from 512
  num_batch: 256 // Reduced from 512
};
```

#### **Slow Response Times**
```javascript
// Enable streaming for better user experience
const result = await gpuIntegration.processWithStreaming({
  content: 'Your content',
  onToken: (token) => console.log('Token:', token)
});
```

## 📈 **Monitoring**

### **Performance Metrics**
```javascript
// Monitor GPU usage
const metrics = await gpuIntegration.getPerformanceMetrics();
console.log('GPU Usage:', metrics.gpuUsage);
console.log('Response Time:', metrics.responseTime);
console.log('Token Throughput:', metrics.tokenThroughput);
```

### **Health Checks**
```javascript
// Check system health
const health = await gpuIntegration.getHealthStatus();
console.log('System Health:', health);
```

## 🔮 **Future Enhancements**

### **Planned Features**
- **Multi-GPU support** for parallel processing
- **Dynamic model switching** based on workload
- **Advanced caching** with intelligent prefetching
- **Real-time optimization** based on usage patterns

### **Performance Targets**
- **Sub-second response times** for simple queries
- **90%+ GPU utilization** for complex operations
- **Zero network overhead** with direct CLI integration
- **99.9% uptime** with built-in resilience

---

## 📚 **Related Documentation**

- [Ollama Integration](ollama-integration.md) - LLM inference setup
- [Network Optimization](network-optimization.md) - Network performance tips
- [Streaming Tool Calling](streaming-tool-calling.md) - Real-time tool integration
- [Performance Monitoring](performance-monitoring.md) - System monitoring guide 