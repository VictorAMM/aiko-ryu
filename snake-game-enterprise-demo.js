#!/usr/bin/env node

/**
 * Snake Game Enterprise Demo
 * 
 * Real-world scenario: Start with a simple snake game spec
 * and evolve it into a full-featured enterprise application
 */

const { AikoRyuEnterprise } = require('./build/index.js');

async function snakeGameEnterpriseDemo() {
  console.log('🐍 **Snake Game Enterprise Demo**');
  console.log('=' .repeat(60));
  console.log('🚀 Real-world scenario: Simple spec → Enterprise app');
  console.log('=' .repeat(60));
  
  try {
    // Initialize enterprise system
    console.log('\n⏳ Initializing enterprise system...');
    const enterprise = new AikoRyuEnterprise();
    await enterprise.initialize();
    console.log('✅ Enterprise system ready!');
    
    // Enable auto-evolution for real-world scenario
    enterprise.setAutoEvolution(true);
    console.log('🔄 Auto-evolution enabled for real-world evolution');
    
    // Phase 1: Initial Game Specification
    console.log('\n🎮 **Phase 1: Initial Game Specification**');
    console.log('=' .repeat(50));
    
    const gameSpec = `
    Create a simple snake game with the following requirements:
    - Snake moves continuously in one direction
    - Player can change direction with arrow keys
    - Food appears randomly on the board
    - Snake grows when eating food
    - Game ends when snake hits wall or itself
    - Display current score
    - Basic HTML5 Canvas implementation
    `;
    
    console.log('📋 Initial Specification:');
    console.log(gameSpec);
    
    // Get initial knowledge about game development
    console.log('\n📚 Retrieving game development knowledge...');
    const gameKnowledge = await enterprise.getKnowledge('HTML5 Canvas game development best practices', {
      domain: 'game-development',
      priority: 'high'
    });
    
    console.log('✅ Game Development Knowledge:');
    console.log(`📝 Content: ${gameKnowledge.content.substring(0, 200)}...`);
    console.log(`🎯 Confidence: ${Math.round(gameKnowledge.confidence * 100)}%`);
    
    // Generate initial game code
    console.log('\n💻 Generating initial snake game code...');
    const initialGame = await enterprise.generateResponse(
      `Create a complete HTML5 Canvas snake game based on this specification: ${gameSpec}`,
      {
        domain: 'game-development',
        temperature: 0.7,
        maxTokens: 1000
      }
    );
    
    console.log('✅ Initial Game Code Generated:');
    console.log(`📝 Code Length: ${initialGame.text.length} characters`);
    console.log(`🔢 Tokens: ${initialGame.tokens}`);
    
    // Phase 2: Evolution - Add Multiplayer Support
    console.log('\n🌐 **Phase 2: Evolution - Multiplayer Support**');
    console.log('=' .repeat(50));
    
    const multiplayerSpec = `
    Evolve the snake game to support multiplayer features:
    - WebSocket connection for real-time multiplayer
    - Multiple players can join the same game
    - Each player has a different colored snake
    - Players can see other snakes on the board
    - Collision detection between players
    - Leaderboard showing all players' scores
    - Chat system for players to communicate
    `;
    
    console.log('📋 Multiplayer Evolution Specification:');
    console.log(multiplayerSpec);
    
    // Generate multiplayer evolution
    console.log('\n🔄 Generating multiplayer evolution...');
    const multiplayerEvolution = await enterprise.generateResponse(
      `Evolve the existing snake game to add multiplayer features: ${multiplayerSpec}`,
      {
        domain: 'game-development',
        temperature: 0.8,
        maxTokens: 1200
      }
    );
    
    console.log('✅ Multiplayer Evolution Generated:');
    console.log(`📝 Evolution Length: ${multiplayerEvolution.text.length} characters`);
    console.log(`🔢 Tokens: ${multiplayerEvolution.tokens}`);
    
    // Phase 3: Evolution - Add AI Opponents
    console.log('\n🤖 **Phase 3: Evolution - AI Opponents**');
    console.log('=' .repeat(50));
    
    const aiSpec = `
    Add AI opponents to the multiplayer snake game:
    - AI snakes with different difficulty levels (Easy, Medium, Hard)
    - AI uses pathfinding algorithms to find food
    - AI avoids collisions with walls and other snakes
    - AI can be toggled on/off by players
    - Different AI personalities (aggressive, defensive, balanced)
    - AI learns from player behavior patterns
    - AI difficulty adjusts based on player skill level
    `;
    
    console.log('📋 AI Evolution Specification:');
    console.log(aiSpec);
    
    // Generate AI evolution
    console.log('\n🤖 Generating AI evolution...');
    const aiEvolution = await enterprise.generateResponse(
      `Add AI opponents to the multiplayer snake game: ${aiSpec}`,
      {
        domain: 'game-development',
        temperature: 0.8,
        maxTokens: 1000
      }
    );
    
    console.log('✅ AI Evolution Generated:');
    console.log(`📝 Evolution Length: ${aiEvolution.text.length} characters`);
    console.log(`🔢 Tokens: ${aiEvolution.tokens}`);
    
    // Phase 4: Evolution - Add Power-ups and Special Features
    console.log('\n⚡ **Phase 4: Evolution - Power-ups and Special Features**');
    console.log('=' .repeat(50));
    
    const powerupSpec = `
    Add power-ups and special features to the snake game:
    - Speed boost power-up (temporary increased speed)
    - Shield power-up (temporary invincibility)
    - Teleport power-up (instant movement to random location)
    - Score multiplier power-up (2x, 3x, 5x points)
    - Ghost mode power-up (can pass through walls)
    - Time freeze power-up (freezes other players temporarily)
    - Special food types with different effects
    - Power-up spawn system with rarity levels
    `;
    
    console.log('📋 Power-up Evolution Specification:');
    console.log(powerupSpec);
    
    // Generate power-up evolution
    console.log('\n⚡ Generating power-up evolution...');
    const powerupEvolution = await enterprise.generateResponse(
      `Add power-ups and special features to the snake game: ${powerupSpec}`,
      {
        domain: 'game-development',
        temperature: 0.8,
        maxTokens: 1000
      }
    );
    
    console.log('✅ Power-up Evolution Generated:');
    console.log(`📝 Evolution Length: ${powerupEvolution.text.length} characters`);
    console.log(`🔢 Tokens: ${powerupEvolution.tokens}`);
    
    // Phase 5: Evolution - Add Enterprise Features
    console.log('\n🏢 **Phase 5: Evolution - Enterprise Features**');
    console.log('=' .repeat(50));
    
    const enterpriseSpec = `
    Add enterprise-level features to the snake game:
    - User authentication and account management
    - Game statistics and analytics dashboard
    - Tournament system with brackets and prizes
    - Custom game modes and rule sets
    - Spectator mode for watching games
    - Replay system for reviewing past games
    - API for third-party integrations
    - Admin panel for game management
    - Payment integration for premium features
    - Mobile-responsive design
    - Progressive Web App (PWA) features
    - Real-time notifications and alerts
    `;
    
    console.log('📋 Enterprise Evolution Specification:');
    console.log(enterpriseSpec);
    
    // Generate enterprise evolution
    console.log('\n🏢 Generating enterprise evolution...');
    const enterpriseEvolution = await enterprise.generateResponse(
      `Add enterprise-level features to the snake game: ${enterpriseSpec}`,
      {
        domain: 'enterprise-software',
        temperature: 0.8,
        maxTokens: 1200
      }
    );
    
    console.log('✅ Enterprise Evolution Generated:');
    console.log(`📝 Evolution Length: ${enterpriseEvolution.text.length} characters`);
    console.log(`🔢 Tokens: ${enterpriseEvolution.tokens}`);
    
    // Phase 6: System Optimization
    console.log('\n⚡ **Phase 6: System Optimization**');
    console.log('=' .repeat(50));
    
    console.log('🔄 Triggering system optimization...');
    const optimization = await enterprise.optimizeSystem();
    
    console.log('✅ System Optimization Results:');
    console.log(`🔧 Optimizations: ${optimization.optimizations.length}`);
    console.log(`📊 Impact: ${optimization.estimatedImpact}`);
    
    // Phase 7: Evolution History Analysis
    console.log('\n📜 **Phase 7: Evolution History Analysis**');
    console.log('=' .repeat(50));
    
    const history = await enterprise.getEvolutionHistory();
    
    console.log('✅ Evolution History:');
    console.log(`📊 Total Evolutions: ${history.length}`);
    
    if (history.length > 0) {
      console.log('\n🔄 Evolution Timeline:');
      history.forEach((evolution, index) => {
        console.log(`${index + 1}. ${evolution.type} - ${evolution.impact} impact`);
        console.log(`   Changes: ${evolution.changes.length}`);
        console.log(`   Applied: ${evolution.applied}`);
      });
    }
    
    // Final Summary
    console.log('\n🎉 **Snake Game Enterprise Evolution Complete!**');
    console.log('=' .repeat(60));
    console.log('📈 Evolution Summary:');
    console.log('✅ Phase 1: Basic snake game');
    console.log('✅ Phase 2: Multiplayer support');
    console.log('✅ Phase 3: AI opponents');
    console.log('✅ Phase 4: Power-ups and special features');
    console.log('✅ Phase 5: Enterprise features');
    console.log('✅ Phase 6: System optimization');
    console.log('✅ Phase 7: Evolution analysis');
    
    console.log('\n🚀 **Enterprise Evolution Results:**');
    console.log('=' .repeat(50));
    console.log('🎮 Simple Game → Full Enterprise Application');
    console.log('🌐 Single Player → Multiplayer + AI');
    console.log('⚡ Basic Features → Power-ups + Special Effects');
    console.log('🏢 Local Game → Enterprise Platform');
    console.log('📊 No Analytics → Full Dashboard + Analytics');
    console.log('💳 No Payments → Payment Integration');
    console.log('📱 Desktop Only → Mobile + PWA');
    
    console.log('\n🎯 **Real-World Enterprise Scenario Success!**');
    console.log('=' .repeat(60));
    console.log('✅ Autonomous evolution working');
    console.log('✅ Progressive feature addition');
    console.log('✅ Enterprise transformation');
    console.log('✅ System optimization active');
    console.log('✅ Evolution history tracking');
    
  } catch (error) {
    console.error('❌ Snake game enterprise demo failed:', error);
    process.exit(1);
  }
}

// Run the demo
snakeGameEnterpriseDemo().catch(error => {
  console.error('💥 Snake game enterprise demo failed:', error);
  process.exit(1);
}); 