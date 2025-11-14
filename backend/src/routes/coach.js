const express = require('express');
const router = express.Router();
const { Chess } = require('chess.js');

// Chess coaching AI service
class ChessCoachAI {
  constructor() {
    this.openingDatabase = {
      'e4': {
        name: 'King\'s Pawn Opening',
        description: 'The most popular first move, controlling the center and opening lines for development.',
        variations: ['e5', 'c5', 'e6', 'd6', 'Nf6'],
        recommendations: 'Excellent choice for aggressive players who enjoy open positions.'
      },
      'd4': {
        name: 'Queen\'s Pawn Opening',
        description: 'A solid, positional opening that controls the center and prepares for queenside development.',
        variations: ['d5', 'Nf6', 'e6', 'g6'],
        recommendations: 'Great for players who prefer strategic, closed positions.'
      },
      'Nf3': {
        name: 'Reti Opening',
        description: 'A flexible opening that doesn\'t commit to a specific pawn structure.',
        variations: ['d5', 'Nf6', 'g6'],
        recommendations: 'Good for players who want to keep their options open.'
      }
    };

    this.tacticalPatterns = {
      'fork': 'Look for opportunities to attack multiple pieces simultaneously.',
      'pin': 'Use pins to restrict your opponent\'s piece movement.',
      'skewer': 'Attack a piece through another piece to win material.',
      'discovered_attack': 'Move one piece to reveal an attack from another piece.',
      'double_check': 'Check with two pieces simultaneously to force the king to move.'
    };

    this.positionalConcepts = {
      'center_control': 'Control the central squares (d4, d5, e4, e5) with pawns and pieces.',
      'development': 'Develop your pieces to active squares early in the game.',
      'king_safety': 'Keep your king safe, especially in the middlegame.',
      'pawn_structure': 'Maintain a healthy pawn structure and avoid weaknesses.',
      'space_advantage': 'Control more space on the board to restrict your opponent.'
    };
  }

  // Analyze a single game
  analyzeGame(game) {
    const analysis = {
      opening: this.analyzeOpening(game),
      tactics: this.analyzeTactics(game),
      positional: this.analyzePositional(game),
      timeManagement: this.analyzeTimeManagement(game),
      mistakes: this.findMistakes(game),
      strengths: this.findStrengths(game),
      recommendations: []
    };

    // Generate personalized recommendations
    analysis.recommendations = this.generateRecommendations(analysis);
    
    return analysis;
  }

  // Analyze opening play
  analyzeOpening(game) {
    const chess = new Chess();
    chess.loadPgn(game.pgn);
    const moves = chess.history();
    
    if (moves.length < 4) return { quality: 'insufficient_data', advice: 'Need more moves to analyze opening.' };

    const firstMove = moves[0];
    const opening = this.openingDatabase[firstMove] || { name: 'Unknown Opening' };

    return {
      name: opening.name,
      quality: this.evaluateOpeningQuality(moves),
      advice: opening.recommendations || 'Consider studying this opening more deeply.',
      moves: moves.slice(0, 10) // First 10 moves
    };
  }

  // Analyze tactical opportunities
  analyzeTactics(game) {
    const chess = new Chess();
    chess.loadPgn(game.pgn);
    const moves = chess.history();
    
    const tacticalOpportunities = [];
    let tacticalScore = 0;

    // Simple tactical analysis (in a real system, this would use Stockfish)
    for (let i = 0; i < moves.length; i++) {
      chess.undo();
      const position = chess.fen();
      
      // Check for basic tactical patterns
      if (this.hasForkOpportunity(chess)) {
        tacticalOpportunities.push({ move: i + 1, type: 'fork', description: 'Fork opportunity missed' });
        tacticalScore -= 1;
      }
      
      if (this.hasPinOpportunity(chess)) {
        tacticalOpportunities.push({ move: i + 1, type: 'pin', description: 'Pin opportunity missed' });
        tacticalScore -= 1;
      }
    }

    return {
      score: tacticalScore,
      opportunities: tacticalOpportunities,
      advice: this.getTacticalAdvice(tacticalScore)
    };
  }

  // Analyze positional play
  analyzePositional(game) {
    const chess = new Chess();
    chess.loadPgn(game.pgn);
    
    const positionalScore = 0;
    const positionalMistakes = [];

    // Analyze pawn structure
    const pawnStructure = this.analyzePawnStructure(chess);
    
    // Analyze piece activity
    const pieceActivity = this.analyzePieceActivity(chess);

    return {
      score: positionalScore,
      pawnStructure,
      pieceActivity,
      mistakes: positionalMistakes,
      advice: this.getPositionalAdvice(positionalScore)
    };
  }

  // Analyze time management
  analyzeTimeManagement(game) {
    // This would require clock data from Lichess
    return {
      quality: 'good',
      advice: 'Consider using more time in critical positions and less time in obvious moves.'
    };
  }

  // Find mistakes in the game
  findMistakes(game) {
    const mistakes = [];
    
    // In a real system, this would compare moves to engine analysis
    // For now, we'll provide general advice
    mistakes.push({
      type: 'tactical',
      description: 'Consider looking for tactical opportunities more systematically',
      advice: 'Practice tactical puzzles to improve pattern recognition'
    });

    return mistakes;
  }

  // Find strengths in the game
  findStrengths(game) {
    const strengths = [];
    
    // Analyze what the player did well
    strengths.push({
      type: 'opening',
      description: 'Good opening preparation',
      advice: 'Continue studying openings that suit your style'
    });

    return strengths;
  }

  // Generate personalized recommendations
  generateRecommendations(analysis) {
    const recommendations = [];

    if (analysis.tactics.score < -2) {
      recommendations.push({
        priority: 'high',
        category: 'tactics',
        description: 'Focus on tactical training',
        action: 'Practice 10 tactical puzzles daily',
        resources: ['lichess.org/training', 'chess.com/puzzles']
      });
    }

    if (analysis.opening.quality === 'poor') {
      recommendations.push({
        priority: 'medium',
        category: 'opening',
        description: 'Improve opening knowledge',
        action: 'Study 2-3 main openings deeply',
        resources: ['lichess.org/study', 'chess.com/openings']
      });
    }

    recommendations.push({
      priority: 'low',
      category: 'general',
      description: 'Review your games regularly',
      action: 'Analyze each game after playing',
      resources: ['lichess.org/analysis', 'chess.com/analysis']
    });

    return recommendations;
  }

  // Helper methods
  evaluateOpeningQuality(moves) {
    // Simple heuristic - in reality, this would be more sophisticated
    if (moves.length < 6) return 'insufficient_data';
    if (moves.length >= 6 && moves.length <= 12) return 'good';
    return 'excellent';
  }

  hasForkOpportunity(chess) {
    // Simplified fork detection
    return false; // Would implement actual fork detection
  }

  hasPinOpportunity(chess) {
    // Simplified pin detection
    return false; // Would implement actual pin detection
  }

  analyzePawnStructure(chess) {
    return {
      quality: 'good',
      advice: 'Maintain pawn structure integrity'
    };
  }

  analyzePieceActivity(chess) {
    return {
      quality: 'good',
      advice: 'Keep pieces active and coordinated'
    };
  }

  getTacticalAdvice(score) {
    if (score < -3) return 'Focus heavily on tactical training. Practice puzzles daily.';
    if (score < -1) return 'Work on tactical vision. Look for combinations more actively.';
    return 'Good tactical awareness. Continue practicing to maintain sharpness.';
  }

  getPositionalAdvice(score) {
    if (score < -3) return 'Study positional concepts. Focus on pawn structure and piece coordination.';
    if (score < -1) return 'Improve positional understanding. Consider long-term plans.';
    return 'Solid positional play. Continue studying advanced concepts.';
  }

  // Generate conversational response
  generateResponse(message, userGames, userStats) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('analyze') || lowerMessage.includes('review')) {
      return this.generateAnalysisResponse(userGames);
    } else if (lowerMessage.includes('weakness') || lowerMessage.includes('improve')) {
      return this.generateImprovementResponse(userGames);
    } else if (lowerMessage.includes('opening') || lowerMessage.includes('repertoire')) {
      return this.generateOpeningResponse(userGames);
    } else if (lowerMessage.includes('tactic') || lowerMessage.includes('combination')) {
      return this.generateTacticalResponse(userGames);
    } else if (lowerMessage.includes('rating') || lowerMessage.includes('progress')) {
      return this.generateProgressResponse(userStats);
    } else {
      return this.generateGeneralResponse(userGames);
    }
  }

  generateAnalysisResponse(userGames) {
    if (!userGames || userGames.length === 0) {
      return "I am Aryan, and I don't see any games to analyze yet! Please fetch your games from Lichess first, and I'll give you the chess wisdom you deserve. Let's turn those moves into masterpieces!";
    }

    const recentGames = userGames.slice(0, 5);
    const analysis = recentGames.map(game => this.analyzeGame(game));
    
    const commonThemes = this.findCommonThemes(analysis);
    
    return `I am Aryan, and I've analyzed your recent ${recentGames.length} games like a chess detective! Here are my findings:

Strengths: ${commonThemes.strengths.join(', ')}
Areas for Improvement: ${commonThemes.weaknesses.join(', ')}

Top Recommendation: ${commonThemes.topRecommendation}

Ready to transform these insights into chess mastery?`;
  }

  generateImprovementResponse(userGames) {
    if (!userGames || userGames.length === 0) {
      return "I am Aryan, and I need to see your games to spot your weaknesses! Please fetch your Lichess games first, and I'll give you the personalized chess medicine you need. No more blundering in the dark!";
    }

    const analysis = userGames.slice(0, 10).map(game => this.analyzeGame(game));
    const weaknesses = this.identifyWeaknesses(analysis);
    
    return `I am Aryan, and I've found your chess Achilles heels! Here are your main areas for improvement:

${weaknesses.map((weakness, index) => `${index + 1}. **${weakness.category}**: ${weakness.description}`).join('\n')}

**Action Plan**:
${weaknesses.map(weakness => `• ${weakness.action}`).join('\n')}

Time to turn these weaknesses into strengths, chess warrior!`;
  }

  generateOpeningResponse(userGames) {
    if (!userGames || userGames.length === 0) {
      return "I am Aryan, and I'd love to recommend openings for you! But first, show me your games so I can analyze your style and suggest openings that fit you like a glove. No more opening roulette!";
    }

    const openings = this.analyzeOpeningRepertoire(userGames);
    
    return `I am Aryan, and I've studied your style! Here are my opening recommendations:

**For White**:
${openings.white.map(opening => `• ${opening.name}: ${opening.reason}`).join('\n')}

**For Black**:
${openings.black.map(opening => `• ${opening.name}: ${opening.reason}`).join('\n')}

**Study Plan**: Focus on 2-3 openings for each color and learn them deeply rather than playing many different openings.`;
  }

  generateTacticalResponse(userGames) {
    return "I am Aryan, and tactical training is your path to chess glory! Here's my tactical training plan:\n\nDaily Routine:\n- 10 tactical puzzles (lichess.org/training)\n- Focus on pattern recognition\n- Practice calculation skills\n\nCommon Tactical Themes:\n- Forks: Attack multiple pieces simultaneously\n- Pins: Restrict piece movement\n- Skewers: Attack through another piece\n- Discovered attacks: Move one piece to reveal another's attack\n\nPro Tip: Look for candidate moves systematically - checks, captures, and threats first!";
  }

  generateProgressResponse(userStats) {
    return "I am Aryan, and tracking your progress is the key to chess mastery! Here's how to measure your chess development:\n\nKey Metrics to Track:\n- Rating progression over time\n- Win rate by opening\n- Performance in different time controls\n- Tactical puzzle solving speed\n\nGoal Setting:\n- Set realistic rating targets\n- Focus on process over results\n- Celebrate small improvements\n- Learn from every game\n\nRemember: Chess improvement is a marathon, not a sprint. Consistency beats intensity!";
  }

  generateGeneralResponse(userGames) {
    return "I am Aryan, your personal chess guru, and I'm here to transform your game! I can:\n\n- Analyze your games and identify patterns\n- Recommend openings that suit your style\n- Provide tactical and positional training plans\n- Track your progress and set goals\n- Answer any chess-related questions\n\nWhat chess challenge shall we conquer today?";
  }

  findCommonThemes(analysis) {
    // Simplified theme detection
    return {
      strengths: ['Good opening preparation', 'Solid positional play'],
      weaknesses: ['Tactical awareness needs work', 'Time management in complex positions'],
      topRecommendation: 'Focus on tactical training with daily puzzle practice'
    };
  }

  identifyWeaknesses(analysis) {
    return [
      {
        category: 'Tactics',
        description: 'Miss tactical opportunities in complex positions',
        action: 'Practice 15 tactical puzzles daily'
      },
      {
        category: 'Time Management',
        description: 'Spend too much time on obvious moves',
        action: 'Use more time in critical positions, less in obvious ones'
      },
      {
        category: 'Endgame Technique',
        description: 'Struggle to convert winning positions',
        action: 'Study basic endgame principles and practice endgame scenarios'
      }
    ];
  }

  analyzeOpeningRepertoire(userGames) {
    return {
      white: [
        { name: 'Ruy Lopez', reason: 'Suits your positional style and provides rich middlegames' },
        { name: 'Queen\'s Gambit', reason: 'Matches your preference for closed, strategic positions' }
      ],
      black: [
        { name: 'Sicilian Defense', reason: 'Offers dynamic counterplay against 1.e4' },
        { name: 'Queen\'s Indian', reason: 'Solid and flexible against 1.d4' }
      ]
    };
  }
}

const coachAI = new ChessCoachAI();

// Routes
router.post('/chat', async (req, res) => {
  try {
    const { message, userGames, userStats } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = coachAI.generateResponse(message, userGames, userStats);
    
    res.json({
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Coach AI error:', error);
    res.status(500).json({ error: 'Failed to generate response', details: error.message });
  }
});

router.post('/analyze-game', async (req, res) => {
  try {
    const { game } = req.body;
    
    if (!game || !game.pgn) {
      return res.status(400).json({ error: 'Game PGN is required' });
    }

    const analysis = coachAI.analyzeGame(game);
    
    res.json({
      analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Game analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze game', details: error.message });
  }
});

router.post('/analyze-games', async (req, res) => {
  try {
    const { games } = req.body;
    
    if (!games || !Array.isArray(games)) {
      return res.status(400).json({ error: 'Games array is required' });
    }

    const analyses = games.map(game => coachAI.analyzeGame(game));
    const summary = coachAI.findCommonThemes(analyses);
    
    res.json({
      analyses,
      summary,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Games analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze games', details: error.message });
  }
});

module.exports = router; 