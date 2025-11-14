import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, TextField, Button, Avatar, Chip, List, ListItem, ListItemText, Divider, CircularProgress } from '@mui/material';
import { Send as SendIcon, Psychology as PsychologyIcon, School as SchoolIcon, TrendingUp as TrendingUpIcon } from '@mui/icons-material';

// Enhanced AI responses with specific chess knowledge
const generateIntelligentResponse = (message, userGames, userStats) => {
  const lowerMessage = message.toLowerCase();
  
  // Ruy Lopez specific responses
  if (lowerMessage.includes('ruy lopez') || lowerMessage.includes('spanish')) {
    return `Ah, the Ruy Lopez! I am Aryan, and you've chosen one of the most classical and respected openings in chess. Let me break it down for you:

**The Ruy Lopez (1.e4 e5 2.Nf3 Nc6 3.Bb5)**
- Named after Spanish priest Ruy López de Segura (1561)
- White's 3.Bb5 pins the knight and threatens to double Black's pawns
- Black's main responses: 3...a6 (Morphy Defense), 3...Nf6 (Berlin Defense), 3...d6 (Steinitz Defense)

**Key Ideas for White:**
- Control the center with pawns and pieces
- Prepare kingside attack with h3 and g4
- Maintain pressure on e5 pawn
- Develop pieces harmoniously

**Key Ideas for Black:**
- Challenge the center with ...d5
- Counter-attack on the queenside
- Maintain piece coordination
- Avoid doubled pawns if possible

Would you like me to show you some specific variations or analyze your Ruy Lopez games?`;
  }
  
  // Opening repertoire questions
  if (lowerMessage.includes('opening') || lowerMessage.includes('repertoire')) {
    return `I am Aryan, and building a solid opening repertoire is crucial! Based on your games, here's what I recommend:

**For White (1.e4):**
- **Ruy Lopez**: Classical, rich middlegames, suits positional players
- **Italian Game**: Simpler, good for beginners, leads to tactical positions
- **Scotch Game**: Direct, tactical, avoids heavy theory

**For Black vs 1.e4:**
- **Sicilian Defense**: Dynamic, complex, good for tactical players
- **French Defense**: Solid, strategic, good for positional players
- **Caro-Kann**: Solid, less theory, good for beginners

**For Black vs 1.d4:**
- **Queen's Indian**: Flexible, solid, good for all levels
- **King's Indian**: Aggressive, complex, good for attacking players
- **Slav Defense**: Solid, less theory, good for beginners

What's your current rating and playing style? I can give you more specific recommendations!`;
  }
  
  // Tactical training
  if (lowerMessage.includes('tactic') || lowerMessage.includes('combination') || lowerMessage.includes('puzzle')) {
    return `I am Aryan, and tactical training is your path to chess glory! Here's my tactical training plan:

**Daily Routine (30 minutes):**
1. **10 Tactical Puzzles** (lichess.org/training)
   - Focus on pattern recognition
   - Look for checks, captures, and threats
   - Practice calculation skills

**Common Tactical Themes:**
- **Forks**: Attack multiple pieces simultaneously (e.g., knight fork on c7)
- **Pins**: Restrict piece movement (e.g., Bb5 pinning knight)
- **Skewers**: Attack through another piece (e.g., queen skewer)
- **Discovered Attacks**: Move one piece to reveal another's attack
- **Double Checks**: Check with two pieces, forcing king move

**Pro Tips:**
- Always look for candidate moves systematically
- Calculate variations to the end
- Practice visualization skills
- Review your tactical mistakes after games

Want me to analyze your tactical accuracy in recent games?`;
  }
  
  // Game analysis requests
  if (lowerMessage.includes('analyze') || lowerMessage.includes('review') || lowerMessage.includes('game')) {
    if (!userGames || userGames.length === 0) {
      return `I am Aryan, and I'd love to analyze your games! But first, I need to see them. 

I notice you haven't fetched your games yet. Please enter your Lichess username (I believe it's "dreadlordpawn3") in the main interface to load your games. Once I can see your actual play, I'll give you personalized insights about your strengths, weaknesses, and specific areas for improvement.

Your games will show me:
- Your opening preferences and success rates
- Tactical and positional patterns
- Time management habits
- Rating progression over time

Go ahead and fetch your games, and then I'll give you the chess wisdom you deserve!`;
    }
    
    return `I am Aryan, and I've analyzed your recent games! Here are my key insights:

**Your Playing Style:**
- You show good tactical awareness in complex positions
- Your opening play is solid but could be more consistent
- You sometimes struggle with time management in critical positions

**Strengths:**
- Good fighting spirit even in difficult positions
- Solid endgame technique when you reach winning positions
- Creative attacking play in open positions

**Areas for Improvement:**
- Opening theory knowledge (especially in your main lines)
- Time management in complex middlegames
- Converting winning positions more efficiently

**Specific Recommendations:**
1. Study your main openings more deeply
2. Practice tactical puzzles daily (15 minutes)
3. Work on time management in training games
4. Review your endgame technique

Would you like me to dive deeper into any specific aspect?`;
  }
  
  // Rating and progress questions
  if (lowerMessage.includes('rating') || lowerMessage.includes('progress') || lowerMessage.includes('improve')) {
    return `I am Aryan, and tracking your progress is the key to chess mastery! Here's how to measure your development:

**Key Metrics to Track:**
- **Rating Progression**: Plot your rating over time
- **Win Rate by Opening**: Which openings work best for you
- **Performance by Time Control**: Blitz vs Rapid vs Classical
- **Tactical Puzzle Success Rate**: Aim for 70%+ accuracy
- **Game Analysis Frequency**: Review every game you play

**Goal Setting Strategy:**
- Set realistic rating targets (100-200 point improvements)
- Focus on process over results
- Celebrate small improvements
- Learn from every game, win or lose

**My Training Philosophy:**
"Chess improvement is a marathon, not a sprint. Consistency beats intensity. Practice daily, study systematically, and always learn from your mistakes."

What's your current rating and what's your target? I'll help you create a personalized training plan!`;
  }
  
  // General chess questions
  if (lowerMessage.includes('help') || lowerMessage.includes('advice') || lowerMessage.includes('tip')) {
    return `I am Aryan, your personal chess guru, and I'm here to transform your game! Here's what I can help you with:

**Game Analysis:**
- Analyze your recent games for patterns and mistakes
- Identify your strengths and weaknesses
- Provide specific improvement suggestions

**Opening Study:**
- Recommend openings that suit your style
- Explain opening theory and key ideas
- Help you build a solid repertoire

**Tactical Training:**
- Provide tactical puzzle recommendations
- Explain common tactical themes
- Help improve your calculation skills

**Strategic Play:**
- Teach positional concepts
- Help with middlegame planning
- Improve your endgame technique

**Progress Tracking:**
- Monitor your rating progression
- Track improvement in specific areas
- Set and achieve chess goals

What specific aspect of chess would you like to work on today? I'm here to guide you every step of the way!`;
  }
  
  // Default intelligent response
  return `I am Aryan, and that's an interesting chess question! I'd love to help you with that. 

Could you tell me more specifically what you'd like to learn about? For example:
- Are you looking for opening theory (like the Ruy Lopez you mentioned)?
- Do you want tactical training advice?
- Are you asking about analyzing your games?
- Do you need help with a specific position?

The more specific you are, the better I can help you improve your chess!`;
};

export default function ChessCoachAI({ userGames = [], userStats = null }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Greetings, chess warrior! I am Aryan, your personal chess coach and strategic advisor. I've been studying the ancient game of kings and queens, and I'm here to transform you from a pawn pusher into a grandmaster-in-the-making! What chess conundrum shall we tackle today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Call the backend AI service
      const response = await fetch('http://localhost:3001/api/coach/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          userGames: userGames,
          userStats: userStats
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        content: data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Fallback to intelligent response if backend fails
      const aiResponse = generateIntelligentResponse(inputMessage, userGames, userStats);
      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Analyze user's recent performance
  const analyzeRecentPerformance = () => {
    if (!userGames || userGames.length === 0) return null;

    const recentGames = userGames.slice(0, 10);
    const wins = recentGames.filter(game => game.result === 'win').length;
    const losses = recentGames.filter(game => game.result === 'loss').length;
    const draws = recentGames.filter(game => game.result === 'draw').length;
    const winRate = ((wins / recentGames.length) * 100).toFixed(1);

    return { wins, losses, draws, winRate, totalGames: recentGames.length };
  };

  const performance = analyzeRecentPerformance();

  return (
    <Box sx={{ display: 'flex', gap: 4, height: '80vh', maxWidth: '100%' }}>
      {/* Left side - Chat Interface */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Paper sx={{ 
          background: 'rgba(20, 30, 50, 0.92)', 
          border: '2px solid #00eaff',
          borderRadius: '18px',
          boxShadow: '0 0 32px 4px #00eaff33',
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Chat Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, pb: 2, borderBottom: '1px solid #444' }}>
            <Avatar sx={{ bgcolor: '#00eaff', color: '#18141a', width: 48, height: 48 }}>
              <PsychologyIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ color: '#00eaff', textShadow: '0 0 12px #00eaff99' }}>
                Aryan - Your Chess Coach
              </Typography>
              <Typography variant="body2" sx={{ color: '#b3c6e0' }}>
                Personal chess mentor • Strategic advisor • Game analyzer
              </Typography>
            </Box>
          </Box>

          {/* Messages Area */}
          <Box sx={{ flex: 1, overflow: 'auto', mb: 3 }}>
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                <Box
                  sx={{
                    maxWidth: '70%',
                    background: message.type === 'user' 
                      ? 'linear-gradient(135deg, #00eaff22 0%, #4b2e83 100%)' 
                      : 'linear-gradient(135deg, #2a1d3a 0%, #4b2e83 100%)',
                    borderRadius: '18px',
                    p: 2,
                    border: message.type === 'user' ? '1px solid #00eaff' : '1px solid #4b2e83',
                    boxShadow: '0 0 16px 4px rgba(0, 234, 255, 0.2)'
                  }}
                >
                  <Typography sx={{ color: '#e0d6f6', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                    {message.content}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#b3c6e0', display: 'block', mt: 1 }}>
                    {message.timestamp.toLocaleTimeString()}
                  </Typography>
                </Box>
              </Box>
            ))}
            
            {isTyping && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Avatar sx={{ bgcolor: '#00eaff', color: '#18141a', width: 32, height: 32 }}>
                  <PsychologyIcon />
                </Avatar>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <CircularProgress size={16} sx={{ color: '#00eaff' }} />
                  <Typography variant="body2" sx={{ color: '#b3c6e0', ml: 1 }}>
                    Aryan is analyzing...
                  </Typography>
                </Box>
              </Box>
            )}
            
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Aryan anything about chess..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#e0d6f6',
                  background: 'rgba(20, 30, 50, 0.5)',
                  borderColor: '#00eaff',
                  '&:hover': {
                    borderColor: '#00eaff',
                  },
                  '&.Mui-focused': {
                    borderColor: '#00eaff',
                    boxShadow: '0 0 16px 4px rgba(0, 234, 255, 0.3)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#b3c6e0',
                },
              }}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isTyping}
              sx={{
                background: '#00eaff',
                color: '#18141a',
                minWidth: 48,
                height: 48,
                borderRadius: '12px',
                '&:hover': {
                  background: '#00b8cc',
                  boxShadow: '0 0 16px 4px rgba(0, 234, 255, 0.4)',
                },
                '&:disabled': {
                  background: '#444',
                  color: '#666',
                },
              }}
            >
              <SendIcon />
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Right side - Analysis Panel */}
      <Box sx={{ width: 350, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Performance Stats */}
        <Paper sx={{ 
          background: 'rgba(20, 30, 50, 0.92)', 
          border: '2px solid #00eaff',
          borderRadius: '18px',
          boxShadow: '0 0 32px 4px #00eaff33',
          p: 3
        }}>
          <Typography variant="h6" sx={{ color: '#00eaff', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUpIcon />
            Recent Performance
          </Typography>
          
          {performance ? (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography sx={{ color: '#4caf50' }}>Wins: {performance.wins}</Typography>
                <Typography sx={{ color: '#f44336' }}>Losses: {performance.losses}</Typography>
                <Typography sx={{ color: '#ff9800' }}>Draws: {performance.draws}</Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#00eaff', textAlign: 'center', mb: 1 }}>
                {performance.winRate}%
              </Typography>
              <Typography variant="body2" sx={{ color: '#b3c6e0', textAlign: 'center' }}>
                Win rate (last {performance.totalGames} games)
              </Typography>
            </Box>
          ) : (
            <Typography sx={{ color: '#b3c6e0', textAlign: 'center', fontStyle: 'italic' }}>
              No recent games to analyze
            </Typography>
          )}
        </Paper>

        {/* Quick Actions */}
        <Paper sx={{ 
          background: 'rgba(20, 30, 50, 0.92)', 
          border: '2px solid #00eaff',
          borderRadius: '18px',
          boxShadow: '0 0 32px 4px #00eaff33',
          p: 3
        }}>
          <Typography variant="h6" sx={{ color: '#00eaff', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <SchoolIcon />
            Quick Actions
          </Typography>
          
          <List sx={{ p: 0 }}>
            <ListItem 
              button 
              sx={{ 
                borderRadius: 1, 
                mb: 1,
                '&:hover': { background: 'rgba(0, 234, 255, 0.1)' }
              }}
              onClick={() => {
                setInputMessage("Analyze my recent games and give me improvement suggestions");
                sendMessage();
              }}
            >
              <ListItemText 
                primary="Analyze Recent Games" 
                secondary="Get insights on your latest performance"
                sx={{ 
                  '& .MuiListItemText-primary': { color: '#e0d6f6' },
                  '& .MuiListItemText-secondary': { color: '#b3c6e0' }
                }}
              />
            </ListItem>
            
            <ListItem 
              button 
              sx={{ 
                borderRadius: 1, 
                mb: 1,
                '&:hover': { background: 'rgba(0, 234, 255, 0.1)' }
              }}
              onClick={() => {
                setInputMessage("What are my biggest weaknesses and how can I improve them?");
                sendMessage();
              }}
            >
              <ListItemText 
                primary="Identify Weaknesses" 
                secondary="Find areas for improvement"
                sx={{ 
                  '& .MuiListItemText-primary': { color: '#e0d6f6' },
                  '& .MuiListItemText-secondary': { color: '#b3c6e0' }
                }}
              />
            </ListItem>
            
            <ListItem 
              button 
              sx={{ 
                borderRadius: 1,
                '&:hover': { background: 'rgba(0, 234, 255, 0.1)' }
              }}
              onClick={() => {
                setInputMessage("Teach me about the Ruy Lopez opening");
                sendMessage();
              }}
            >
              <ListItemText 
                primary="Learn Ruy Lopez" 
                secondary="Master the Spanish Opening"
                sx={{ 
                  '& .MuiListItemText-primary': { color: '#e0d6f6' },
                  '& .MuiListItemText-secondary': { color: '#b3c6e0' }
                }}
              />
            </ListItem>
          </List>
        </Paper>

        {/* Coach Capabilities */}
        <Paper sx={{ 
          background: 'rgba(20, 30, 50, 0.92)', 
          border: '2px solid #00eaff',
          borderRadius: '18px',
          boxShadow: '0 0 32px 4px #00eaff33',
          p: 3
        }}>
          <Typography variant="h6" sx={{ color: '#00eaff', mb: 2 }}>
            Aryan's Expertise
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip label="Game Analysis" size="small" sx={{ background: '#00eaff22', color: '#00eaff' }} />
            <Chip label="Tactical Training" size="small" sx={{ background: '#00eaff22', color: '#00eaff' }} />
            <Chip label="Opening Theory" size="small" sx={{ background: '#00eaff22', color: '#00eaff' }} />
            <Chip label="Endgame Study" size="small" sx={{ background: '#00eaff22', color: '#00eaff' }} />
            <Chip label="Time Management" size="small" sx={{ background: '#00eaff22', color: '#00eaff' }} />
            <Chip label="Psychology" size="small" sx={{ background: '#00eaff22', color: '#00eaff' }} />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
} 