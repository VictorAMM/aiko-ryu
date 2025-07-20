import { GPUAccelerator } from '../src/agents/GPUAccelerator';

describe('GPUAccelerator', () => {
  let gpuAccelerator: GPUAccelerator;

  beforeEach(() => {
    gpuAccelerator = new GPUAccelerator();
  });

  describe('Basic Properties', () => {
    it('should have correct id and role', () => {
      expect(gpuAccelerator.id).toBe('gpu-accelerator');
      expect(gpuAccelerator.role).toBe('GPU Accelerator');
    });

    it('should have required dependencies', () => {
      expect(gpuAccelerator.dependencies).toContain('aiko');
      expect(gpuAccelerator.dependencies).toContain('ryu');
      expect(gpuAccelerator.dependencies).toContain('sarah');
    });
  });

  describe('Lifecycle', () => {
    it('should initialize successfully', async () => {
      await expect(gpuAccelerator.initialize()).resolves.not.toThrow();
    });

    it('should shutdown gracefully', async () => {
      await gpuAccelerator.initialize();
      await expect(gpuAccelerator.shutdown()).resolves.not.toThrow();
    });

    it('should return valid status', () => {
      const status = gpuAccelerator.getStatus();
      expect(status).toHaveProperty('status');
      expect(status).toHaveProperty('uptime');
      expect(status.uptime).toBeGreaterThan(0);
    });
  });

  describe('Core GPU Acceleration', () => {
    beforeEach(async () => {
      await gpuAccelerator.initialize();
    });

    it('should accelerate neural network', async () => {
      const model = {
        id: 'test-model',
        architecture: 'cnn' as const,
        layers: [
          { type: 'convolutional' as const, parameters: { filters: 32, kernelSize: 3, stride: 1, padding: 1, units: 0 }, activation: 'relu' },
          { type: 'dense' as const, parameters: { units: 512, filters: 0, kernelSize: 0, stride: 0, padding: 0 }, activation: 'relu' },
          { type: 'dense' as const, parameters: { units: 10, filters: 0, kernelSize: 0, stride: 0, padding: 0 }, activation: 'softmax' }
        ],
        parameters: 1000000,
        inputShape: [28, 28, 1],
        outputShape: [10],
        precision: 'fp32' as const,
        batchSize: 32
      };

      const result = await gpuAccelerator.accelerateNeuralNetwork(model);
      
      expect(result.success).toBe(true);
      expect(result.speedupFactor).toBeGreaterThan(0);
      expect(result.memoryUsage).toBeGreaterThanOrEqual(0);
      expect(result.powerConsumption).toBeGreaterThanOrEqual(0);
      expect(result.throughput).toBeGreaterThan(0);
      expect(result.latency).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(result.optimizationApplied)).toBe(true);
    });

    it('should accelerate inference', async () => {
      const model = {
        id: 'test-inference-model',
        modelType: 'classification' as const,
        inputSize: [784],
        outputSize: [10],
        batchSize: 32,
        precision: 'fp32' as const,
        optimization: 'tensorrt' as const
      };

      const result = await gpuAccelerator.accelerateInference(model);
      
      expect(result.success).toBe(true);
      expect(result.inferenceTime).toBeGreaterThan(0);
      expect(result.throughput).toBeGreaterThan(0);
      expect(result.accuracy).toBeGreaterThanOrEqual(0);
      expect(result.powerEfficiency).toBeGreaterThanOrEqual(0);
      expect(result.memoryUsage).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(result.optimizations)).toBe(true);
    });

    it('should parallelize computation', async () => {
      const task = {
        id: 'test-task',
        type: 'matrix-multiplication' as const,
        dataSize: 1000000,
        complexity: 'O(n³)' as const,
        parallelism: 4,
        memoryRequirements: 1024
      };

      const result = await gpuAccelerator.parallelizeComputation(task);
      
      expect(result.success).toBe(true);
      expect(result.coresUtilized).toBeGreaterThan(0);
      expect(result.speedupAchieved).toBeGreaterThan(0);
      expect(result.efficiency).toBeGreaterThanOrEqual(0);
      expect(['optimal', 'good', 'fair', 'poor']).toContain(result.loadBalancing);
      expect(Array.isArray(result.bottlenecks)).toBe(true);
    });

    it('should optimize memory transfer', async () => {
      const transfer = {
        source: 'cpu-to-gpu' as const,
        dataSize: 1024,
        bandwidth: 1000,
        latency: 10,
        optimization: 'pinned-memory' as const
      };

      const result = await gpuAccelerator.optimizeMemoryTransfer(transfer);
      
      expect(result.success).toBe(true);
      expect(result.bandwidthUtilized).toBeGreaterThanOrEqual(0);
      expect(result.transferTime).toBeGreaterThan(0);
      expect(result.memoryEfficiency).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(result.optimizationApplied)).toBe(true);
    });
  });

  describe('Advanced GPU Features', () => {
    beforeEach(async () => {
      await gpuAccelerator.initialize();
    });

    it('should monitor GPU resources', async () => {
      const result = await gpuAccelerator.monitorGPUResources();
      
      expect(result.gpuCount).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(result.memoryUsage)).toBe(true);
      expect(Array.isArray(result.utilization)).toBe(true);
      expect(Array.isArray(result.temperature)).toBe(true);
      expect(Array.isArray(result.powerConsumption)).toBe(true);
      expect(Array.isArray(result.memoryBandwidth)).toBe(true);
      expect(Array.isArray(result.computeCapability)).toBe(true);
    });

    it('should manage GPU allocation', async () => {
      const requests = [
        {
          id: 'request-1',
          memoryRequired: 2048,
          computeCapability: '8.0',
          priority: 'high' as const,
          duration: 3600,
          taskType: 'training' as const
        },
        {
          id: 'request-2',
          memoryRequired: 1024,
          computeCapability: '7.5',
          priority: 'medium' as const,
          duration: 1800,
          taskType: 'inference' as const
        }
      ];

      const result = await gpuAccelerator.manageGPUAllocation(requests);
      
      expect(result.success).toBe(true);
      expect(Array.isArray(result.allocatedGPUs)).toBe(true);
      expect(Array.isArray(result.memoryAllocated)).toBe(true);
      expect(result.estimatedDuration).toBeGreaterThan(0);
      expect(Array.isArray(result.conflicts)).toBe(true);
    });

    it('should optimize GPU utilization', async () => {
      const result = await gpuAccelerator.optimizeGPUUtilization();
      
      expect(result.success).toBe(true);
      expect(result.utilizationImproved).toBeGreaterThanOrEqual(0);
      expect(result.powerEfficiency).toBeGreaterThanOrEqual(0);
      expect(result.memoryEfficiency).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(result.optimizations)).toBe(true);
    });

    it('should implement tensor operations', async () => {
      const tensors = [
        {
          id: 'tensor-1',
          operation: 'add' as const,
          inputTensors: [
            { id: 'input-1', shape: [100, 100], dataType: 'float32' as const, device: 'gpu' as const, memory: 40000 },
            { id: 'input-2', shape: [100, 100], dataType: 'float32' as const, device: 'gpu' as const, memory: 40000 }
          ],
          outputShape: [100, 100],
          precision: 'fp32' as const
        }
      ];

      const result = await gpuAccelerator.implementTensorOperations(tensors);
      
      expect(result.success).toBe(true);
      expect(result.operationsCompleted).toBeGreaterThan(0);
      expect(result.totalTime).toBeGreaterThan(0);
      expect(result.memoryUsage).toBeGreaterThanOrEqual(0);
      expect(result.throughput).toBeGreaterThan(0);
      expect(result.accuracy).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Event Handling', () => {
    beforeEach(async () => {
      await gpuAccelerator.initialize();
    });

    it('should handle matrix operation events', async () => {
      await expect(gpuAccelerator.handleEvent('matrix.accelerate', {
        operation: 'multiplication',
        matrices: []
      })).resolves.not.toThrow();
    });

    it('should handle inference events', async () => {
      await expect(gpuAccelerator.handleEvent('inference.accelerate', {
        model: { layers: [] },
        input: []
      })).resolves.not.toThrow();
    });

    it('should handle training events', async () => {
      await expect(gpuAccelerator.handleEvent('training.accelerate', {
        model: { layers: [] },
        dataset: { features: [], labels: [] }
      })).resolves.not.toThrow();
    });

    it('should handle unknown events gracefully', async () => {
      await expect(gpuAccelerator.handleEvent('unknown.event', {})).resolves.not.toThrow();
    });
  });

  describe('DDD/SDD Compliance', () => {
    it('should validate specifications', () => {
      const spec = {
        id: 'test-spec',
        role: 'test-role',
        dependencies: [],
        capabilities: [{
          id: 'cap-1',
          name: 'gpu_acceleration',
          description: 'GPU acceleration capability',
          inputs: [],
          outputs: [],
          preconditions: [],
          postconditions: []
        }],
        interfaces: [],
        behaviors: [],
        constraints: [],
        designIntent: {
          purpose: 'test',
          userGoals: [],
          successMetrics: [],
          designPrinciples: [],
          accessibilityRequirements: []
        },
        userRequirements: [],
        validationRules: []
      };

      const result = gpuAccelerator.validateSpecification(spec);
      expect(result).toHaveProperty('result');
      expect(result).toHaveProperty('consensus');
    });

    it('should generate design artifacts', () => {
      const artifacts = gpuAccelerator.generateDesignArtifacts();
      expect(Array.isArray(artifacts)).toBe(true);
    });

    it('should track user interactions', () => {
      const interaction = {
        id: 'test-interaction',
        userId: 'test-user',
        sessionId: 'test-session',
        action: 'accelerate_operation',
        context: { operation: 'matrix_multiplication' },
        timestamp: new Date(),
        outcome: 'success' as const
      };

      expect(() => gpuAccelerator.trackUserInteraction(interaction)).not.toThrow();
    });
  });
}); 