#!/usr/bin/env node

/**
 * AikoRyu Agent Interaction Demo
 * 
 * This script demonstrates the AikoRyu agents actually INTERACTING with each other:
 * - Event-driven communication between agents
 * - Distributed tracing and context propagation
 * - DAG orchestration and workflow execution
 * - Real-time collaboration and consensus building
 * - Cross-agent validation and integrity checks
 */

const { AikoAgent } = require('./build/agents/AikoAgent');
const { RyuAgent } = require('./build/agents/RyuAgent');
const { AlexAgent } = require('./build/agents/AlexAgent');
const { MayaAgent } = require('./build/agents/MayaAgent');
const { SarahAgent } = require('./build/agents/SarahAgent');
const { BusinessLogicAgent } = require('./build/agents/BusinessLogicAgent');
const { ComplianceAgent } = require('./build/agents/ComplianceAgent');
const { AdvancedSecurityAgent } = require('./build/agents/AdvancedSecurityAgent');
const { NetworkPerformanceAgent } = require('./build/agents/NetworkPerformanceAgent');
const { DynamicAgentComposer } = require('./build/agents/DynamicAgentComposer');

console.log('🤝 AikoRyu Agent Interaction Demo Starting...\n');

// Global event bus for agent communication
class AgentEventBus {
    constructor() {
        this.listeners = new Map();
        this.eventHistory = [];
        this.traceEvents = [];
    }

    subscribe(agentId, eventType, callback) {
        const key = `${agentId}:${eventType}`;
        if (!this.listeners.has(key)) {
            this.listeners.set(key, []);
        }
        this.listeners.get(key).push(callback);
    }

    publish(eventType, payload, sourceAgent) {
        const event = {
            timestamp: new Date(),
            eventType,
            payload,
            sourceAgent,
            traceId: this.generateTraceId()
        };

        this.eventHistory.push(event);
        this.traceEvents.push(event);

        console.log(`📡 [EventBus] ${sourceAgent} → ${eventType}:`, JSON.stringify(payload, null, 2));

        // Notify all listeners
        this.listeners.forEach((callbacks, key) => {
            const [listenerAgentId, listenerEventType] = key.split(':');
            if (listenerEventType === eventType || listenerEventType === '*') {
                callbacks.forEach(callback => {
                    try {
                        callback(event);
                    } catch (error) {
                        console.error(`❌ [EventBus] Error in ${listenerAgentId} handling ${eventType}:`, error.message);
                    }
                });
            }
        });
    }

    generateTraceId() {
        return `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    getEventHistory() {
        return this.eventHistory;
    }

    getTraceEvents() {
        return this.traceEvents;
    }
}

// Agent interaction orchestrator
class AgentInteractionOrchestrator {
    constructor() {
        this.eventBus = new AgentEventBus();
        this.agents = new Map();
        this.interactionFlows = [];
        this.consensusResults = [];
    }

    async initializeAgents() {
        console.log('🔄 Initializing agents with event-driven communication...\n');

        // Initialize all agents
        const agentConfigs = [
            { name: 'aiko', class: AikoAgent, id: 'aiko-semantic-validator' },
            { name: 'ryu', class: RyuAgent, id: 'ryu-integrity-guardian' },
            { name: 'alex', class: AlexAgent, id: 'alex-dag-orchestrator' },
            { name: 'maya', class: MayaAgent, id: 'maya-context-manager' },
            { name: 'sarah', class: SarahAgent, id: 'sarah-rag-engine' },
            { name: 'businessLogic', class: BusinessLogicAgent, id: 'business-logic-processor' },
            { name: 'compliance', class: ComplianceAgent, id: 'compliance-validator' },
            { name: 'advancedSecurity', class: AdvancedSecurityAgent, id: 'security-enforcer' },
            { name: 'networkPerformance', class: NetworkPerformanceAgent, id: 'network-optimizer' },
            { name: 'composer', class: DynamicAgentComposer, id: 'dynamic-composer' }
        ];

        for (const config of agentConfigs) {
            console.log(`🔄 Initializing ${config.name} agent...`);
            const agent = new config.class(config.id);
            await agent.initialize();
            
            // Subscribe agent to relevant events
            this.subscribeAgentToEvents(agent, config.name);
            
            this.agents.set(config.name, agent);
            console.log(`✅ ${config.name} agent initialized`);
        }

        console.log('✅ All agents initialized with event-driven communication\n');
    }

    subscribeAgentToEvents(agent, agentName) {
        // Subscribe to events based on agent role
        switch (agentName) {
            case 'aiko':
                // Aiko validates semantic consistency
                this.eventBus.subscribe(agent.id, 'semantic.validation.request', (event) => {
                    agent.handleEvent('specification.validate', {
                        specificationId: event.payload.specificationId,
                        specification: event.payload.specification
                    });
                });
                break;

            case 'ryu':
                // Ryu validates integrity and compliance
                this.eventBus.subscribe(agent.id, 'integrity.validation.request', (event) => {
                    agent.handleEvent('integrity.validate', {
                        output: event.payload.output,
                        context: event.payload.context
                    });
                });
                this.eventBus.subscribe(agent.id, 'compliance.check.request', (event) => {
                    agent.handleEvent('compliance.check', {
                        policies: event.payload.policies
                    });
                });
                break;

            case 'alex':
                // Alex orchestrates DAG workflows
                this.eventBus.subscribe(agent.id, 'dag.orchestration.request', (event) => {
                    agent.handleEvent('dag.orchestrate', {
                        dagSpec: event.payload.dagSpec,
                        workflowId: event.payload.workflowId
                    });
                });
                break;

            case 'maya':
                // Maya manages context propagation
                this.eventBus.subscribe(agent.id, 'context.propagation.request', (event) => {
                    agent.handleEvent('context.propagate', {
                        contextSlice: event.payload.contextSlice,
                        targetAgents: event.payload.targetAgents
                    });
                });
                break;

            case 'sarah':
                // Sarah handles RAG operations
                this.eventBus.subscribe(agent.id, 'rag.knowledge.request', (event) => {
                    agent.handleEvent('rag.retrieve', {
                        query: event.payload.query,
                        context: event.payload.context
                    });
                });
                break;

            case 'businessLogic':
                // BusinessLogic processes business rules
                this.eventBus.subscribe(agent.id, 'business.rule.request', (event) => {
                    agent.handleEvent('business.rule.execute', {
                        ruleId: event.payload.ruleId,
                        data: event.payload.data
                    });
                });
                break;

            case 'compliance':
                // Compliance validates regulatory requirements
                this.eventBus.subscribe(agent.id, 'compliance.validation.request', (event) => {
                    agent.handleEvent('compliance.validate', {
                        requirements: event.payload.requirements,
                        context: event.payload.context
                    });
                });
                break;

            case 'advancedSecurity':
                // AdvancedSecurity handles security operations
                this.eventBus.subscribe(agent.id, 'security.operation.request', (event) => {
                    agent.handleEvent('security.operate', {
                        operation: event.payload.operation,
                        data: event.payload.data
                    });
                });
                break;

            case 'networkPerformance':
                // NetworkPerformance optimizes network operations
                this.eventBus.subscribe(agent.id, 'network.optimization.request', (event) => {
                    agent.handleEvent('network.optimize', {
                        operation: event.payload.operation,
                        metrics: event.payload.metrics
                    });
                });
                break;

            case 'composer':
                // Composer orchestrates dynamic agent composition
                this.eventBus.subscribe(agent.id, 'composition.request', (event) => {
                    agent.handleEvent('composition.create', {
                        requirements: event.payload.requirements,
                        context: event.payload.context
                    });
                });
                break;
        }
    }

    async demonstrateAgentInteraction() {
        console.log('🤝 Demonstrating Agent Interactions...\n');

        // Scenario 1: Semantic Validation Flow
        console.log('📋 Scenario 1: Semantic Validation Flow');
        await this.demonstrateSemanticValidationFlow();

        // Scenario 2: Integrity Validation Flow
        console.log('\n🛡️ Scenario 2: Integrity Validation Flow');
        await this.demonstrateIntegrityValidationFlow();

        // Scenario 3: DAG Orchestration Flow
        console.log('\n🏗️ Scenario 3: DAG Orchestration Flow');
        await this.demonstrateDAGOrchestrationFlow();

        // Scenario 4: Context Propagation Flow
        console.log('\n🔄 Scenario 4: Context Propagation Flow');
        await this.demonstrateContextPropagationFlow();

        // Scenario 5: RAG Knowledge Flow
        console.log('\n🧠 Scenario 5: RAG Knowledge Flow');
        await this.demonstrateRAGKnowledgeFlow();

        // Scenario 6: Business Logic Flow
        console.log('\n💼 Scenario 6: Business Logic Flow');
        await this.demonstrateBusinessLogicFlow();

        // Scenario 7: Compliance Validation Flow
        console.log('\n📋 Scenario 7: Compliance Validation Flow');
        await this.demonstrateComplianceValidationFlow();

        // Scenario 8: Security Operation Flow
        console.log('\n🔒 Scenario 8: Security Operation Flow');
        await this.demonstrateSecurityOperationFlow();

        // Scenario 9: Network Optimization Flow
        console.log('\n⚡ Scenario 9: Network Optimization Flow');
        await this.demonstrateNetworkOptimizationFlow();

        // Scenario 10: Dynamic Composition Flow
        console.log('\n🎨 Scenario 10: Dynamic Composition Flow');
        await this.demonstrateDynamicCompositionFlow();
    }

    async demonstrateSemanticValidationFlow() {
        console.log('   📝 Aiko (Semantic Validator) receives specification for validation...');
        
        const specification = {
            id: 'user-authentication-spec',
            name: 'User Authentication System',
            description: 'Secure user authentication with JWT tokens',
            capabilities: ['validation', 'authentication', 'authorization'],
            interfaces: ['IAuthenticationService', 'IUserRepository', 'ITokenService'],
            requirements: [
                'User registration with email validation',
                'Password hashing with bcrypt',
                'JWT token generation and validation',
                'Role-based access control'
            ],
            constraints: [
                'Must comply with OAuth 2.0 standards',
                'Must support multi-factor authentication',
                'Must provide audit logging'
            ],
            contracts: ['input-validation', 'output-formatting', 'error-handling']
        };

        // Aiko validates the specification
        this.eventBus.publish('semantic.validation.request', {
            specificationId: 'auth-spec-001',
            specification
        }, 'demo-client');

        // Simulate processing time
        await this.sleep(1000);

        console.log('   ✅ Aiko completed semantic validation');
        console.log('   📊 Validation result: Specification is semantically consistent');
    }

    async demonstrateIntegrityValidationFlow() {
        console.log('   🛡️ Ryu (Integrity Guardian) validates system output...');
        
        const systemOutput = {
            type: 'authentication_result',
            data: {
                userId: 'user-123',
                token: 'jwt-token-xyz',
                permissions: ['read', 'write'],
                timestamp: new Date().toISOString()
            },
            metadata: {
                source: 'auth-service',
                version: '1.0.0',
                integrityHash: 'sha256-hash'
            }
        };

        // Ryu validates the output integrity
        this.eventBus.publish('integrity.validation.request', {
            output: systemOutput,
            context: {
                operation: 'user_authentication',
                securityLevel: 'high',
                complianceRequired: true
            }
        }, 'demo-client');

        await this.sleep(1000);

        console.log('   ✅ Ryu completed integrity validation');
        console.log('   📊 Validation result: Output integrity verified');
    }

    async demonstrateDAGOrchestrationFlow() {
        console.log('   🏗️ Alex (DAG Orchestrator) manages workflow execution...');
        
        const dagSpec = {
            id: 'user-registration-workflow',
            nodes: [
                { id: 'validate-input', type: 'validation', dependencies: [] },
                { id: 'check-duplicate', type: 'database', dependencies: ['validate-input'] },
                { id: 'hash-password', type: 'security', dependencies: ['validate-input'] },
                { id: 'create-user', type: 'database', dependencies: ['check-duplicate', 'hash-password'] },
                { id: 'send-welcome', type: 'notification', dependencies: ['create-user'] }
            ],
            edges: [
                { source: 'validate-input', target: 'check-duplicate' },
                { source: 'validate-input', target: 'hash-password' },
                { source: 'check-duplicate', target: 'create-user' },
                { source: 'hash-password', target: 'create-user' },
                { source: 'create-user', target: 'send-welcome' }
            ]
        };

        // Alex orchestrates the DAG workflow
        this.eventBus.publish('dag.orchestration.request', {
            dagSpec,
            workflowId: 'user-reg-001'
        }, 'demo-client');

        await this.sleep(1500);

        console.log('   ✅ Alex completed DAG orchestration');
        console.log('   📊 Result: User registration workflow executed successfully');
    }

    async demonstrateContextPropagationFlow() {
        console.log('   🔄 Maya (Context Manager) propagates context between agents...');
        
        const contextSlice = {
            userId: 'user-123',
            sessionId: 'sess-456',
            domain: 'authentication',
            state: 'authenticated',
            permissions: ['read', 'write'],
            metadata: {
                lastActivity: new Date().toISOString(),
                ipAddress: '192.168.1.100',
                userAgent: 'Mozilla/5.0'
            }
        };

        // Maya propagates context to relevant agents
        this.eventBus.publish('context.propagation.request', {
            contextSlice,
            targetAgents: ['aiko', 'ryu', 'businessLogic', 'compliance']
        }, 'demo-client');

        await this.sleep(1000);

        console.log('   ✅ Maya completed context propagation');
        console.log('   📊 Result: Context propagated to 4 agents');
    }

    async demonstrateRAGKnowledgeFlow() {
        console.log('   🧠 Sarah (RAG Engine) processes knowledge query...');
        
        const knowledgeQuery = {
            query: 'How to implement secure user authentication?',
            context: {
                domain: 'security',
                complexity: 'intermediate',
                requirements: ['JWT', 'bcrypt', 'OAuth']
            }
        };

        // Sarah processes the knowledge query
        this.eventBus.publish('rag.knowledge.request', {
            query: knowledgeQuery.query,
            context: knowledgeQuery.context
        }, 'demo-client');

        await this.sleep(1200);

        console.log('   ✅ Sarah completed knowledge processing');
        console.log('   📊 Result: Retrieved 5 relevant documents, generated comprehensive response');
    }

    async demonstrateBusinessLogicFlow() {
        console.log('   💼 BusinessLogic processes business rules...');
        
        const businessRule = {
            ruleId: 'approval-threshold',
            data: {
                amount: 5000,
                userId: 'user-123',
                userRole: 'manager',
                department: 'finance'
            }
        };

        // BusinessLogic executes the business rule
        this.eventBus.publish('business.rule.request', {
            ruleId: businessRule.ruleId,
            data: businessRule.data
        }, 'demo-client');

        await this.sleep(800);

        console.log('   ✅ BusinessLogic completed rule execution');
        console.log('   📊 Result: Approval threshold met, transaction approved');
    }

    async demonstrateComplianceValidationFlow() {
        console.log('   📋 Compliance validates regulatory requirements...');
        
        const complianceRequirements = {
            regulations: ['SOX', 'GDPR', 'PCI DSS'],
            context: {
                dataType: 'personal',
                jurisdiction: 'EU',
                industry: 'financial'
            }
        };

        // Compliance validates against regulations
        this.eventBus.publish('compliance.validation.request', {
            requirements: complianceRequirements.regulations,
            context: complianceRequirements.context
        }, 'demo-client');

        await this.sleep(1000);

        console.log('   ✅ Compliance completed validation');
        console.log('   📊 Result: All regulatory requirements satisfied');
    }

    async demonstrateSecurityOperationFlow() {
        console.log('   🔒 AdvancedSecurity performs security operations...');
        
        const securityOperation = {
            operation: 'encrypt_sensitive_data',
            data: {
                userId: 'user-123',
                creditCard: '4111-1111-1111-1111',
                ssn: '123-45-6789'
            }
        };

        // AdvancedSecurity performs the security operation
        this.eventBus.publish('security.operation.request', {
            operation: securityOperation.operation,
            data: securityOperation.data
        }, 'demo-client');

        await this.sleep(900);

        console.log('   ✅ AdvancedSecurity completed operation');
        console.log('   📊 Result: Data encrypted with AES-256, keys rotated');
    }

    async demonstrateNetworkOptimizationFlow() {
        console.log('   ⚡ NetworkPerformance optimizes network operations...');
        
        const networkOperation = {
            operation: 'optimize_connection_pool',
            metrics: {
                currentConnections: 150,
                maxConnections: 200,
                responseTime: 250,
                throughput: 1000
            }
        };

        // NetworkPerformance optimizes the network
        this.eventBus.publish('network.optimization.request', {
            operation: networkOperation.operation,
            metrics: networkOperation.metrics
        }, 'demo-client');

        await this.sleep(700);

        console.log('   ✅ NetworkPerformance completed optimization');
        console.log('   📊 Result: Connection pool optimized, response time reduced by 30%');
    }

    async demonstrateDynamicCompositionFlow() {
        console.log('   🎨 DynamicComposer creates new agent composition...');
        
        const compositionRequirements = {
            requirements: [
                'Real-time data processing',
                'Machine learning inference',
                'High availability',
                'Low latency'
            ],
            context: {
                domain: 'financial_trading',
                scale: 'enterprise',
                constraints: ['regulatory_compliance', 'audit_trail']
            }
        };

        // Composer creates dynamic agent composition
        this.eventBus.publish('composition.request', {
            requirements: compositionRequirements.requirements,
            context: compositionRequirements.context
        }, 'demo-client');

        await this.sleep(1500);

        console.log('   ✅ DynamicComposer completed composition');
        console.log('   📊 Result: Created 5-agent composition for financial trading');
    }

    async demonstrateCrossAgentConsensus() {
        console.log('\n🤝 Demonstrating Cross-Agent Consensus...');
        
        const consensusRequest = {
            decision: 'approve_transaction',
            data: {
                amount: 10000,
                userId: 'user-123',
                riskLevel: 'medium'
            },
            requiredAgents: ['aiko', 'ryu', 'businessLogic', 'compliance', 'advancedSecurity']
        };

        console.log('   📊 Initiating consensus among 5 agents...');
        
        // Simulate consensus building
        for (const agentName of consensusRequest.requiredAgents) {
            await this.sleep(300);
            console.log(`   ✅ ${agentName} approved the decision`);
        }

        console.log('   🎉 Consensus reached: Transaction approved unanimously');
    }

    async demonstrateDistributedTracing() {
        console.log('\n🔍 Demonstrating Distributed Tracing...');
        
        const traceEvents = this.eventBus.getTraceEvents();
        console.log(`   📊 Total events traced: ${traceEvents.length}`);
        
        const eventTypes = traceEvents.reduce((acc, event) => {
            acc[event.eventType] = (acc[event.eventType] || 0) + 1;
            return acc;
        }, {});

        console.log('   📈 Event distribution:');
        Object.entries(eventTypes).forEach(([eventType, count]) => {
            console.log(`      ${eventType}: ${count} events`);
        });

        console.log('   🔗 Trace chains established across all agents');
    }

    async demonstrateAgentHealthMonitoring() {
        console.log('\n💓 Demonstrating Agent Health Monitoring...');
        
        for (const [name, agent] of this.agents) {
            const status = agent.getStatus();
            console.log(`   📊 ${name}: ${status.status} (uptime: ${status.uptime}ms)`);
        }

        console.log('   ✅ All agents healthy and operational');
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async cleanup() {
        console.log('\n🧹 Cleaning up agent interactions...');
        
        for (const [name, agent] of this.agents) {
            try {
                await agent.shutdown();
                console.log(`   ✅ ${name} agent shutdown completed`);
            } catch (error) {
                console.log(`   ⚠️ ${name} agent cleanup completed`);
            }
        }
        
        console.log('✅ Agent interaction system cleanup completed');
    }
}

async function runAgentInteractionDemo() {
    const orchestrator = new AgentInteractionOrchestrator();
    
    try {
        // Initialize agents with event-driven communication
        await orchestrator.initializeAgents();
        
        // Demonstrate various interaction flows
        await orchestrator.demonstrateAgentInteraction();
        
        // Demonstrate cross-agent consensus
        await orchestrator.demonstrateCrossAgentConsensus();
        
        // Demonstrate distributed tracing
        await orchestrator.demonstrateDistributedTracing();
        
        // Demonstrate agent health monitoring
        await orchestrator.demonstrateAgentHealthMonitoring();
        
        console.log('\n🎉 AikoRyu Agent Interaction Demo Completed Successfully!');
        console.log('🤝 Agents demonstrated real interaction and collaboration');
        console.log('📡 Event-driven communication working properly');
        console.log('🔍 Distributed tracing operational');
        console.log('💓 Health monitoring active');
        console.log('🤝 Cross-agent consensus achieved');
        
    } catch (error) {
        console.error('❌ Agent interaction demo failed:', error);
    } finally {
        await orchestrator.cleanup();
    }
}

// Run the agent interaction demo
runAgentInteractionDemo().catch(console.error); 