import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import ChargingBar from './ChargingBar';

const openingDatabase = [
  {
    name: "Ruy Lopez",
    pgn: "1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6 8.c3 O-O 9.h3 Nb8 10.d4 Nbd7 11.Nbd2 Bb7 12.Bc2 Re8 13.Nf1 Bf8 14.Ng3 g6 15.Bg5 h6",
    description: "The most popular opening in chess history",
    positionalIdeas: [
      "Control the center with pawns and pieces",
      "Develop knights to natural squares",
      "Prepare kingside attack with h3 and g4",
      "Maintain pressure on e5 pawn"
    ],
    longTermPlans: [
      "Kingside attack with pawn storm",
      "Central breakthrough with d4-d5",
      "Pressure on the queenside",
      "Control of key central squares"
    ],
    pros: [
      "Very well researched and understood",
      "Leads to rich middlegame positions",
      "White maintains slight advantage",
      "Flexible plans for both sides"
    ],
    cons: [
      "Can be very theoretical",
      "Black has many solid defenses",
      "Requires deep preparation",
      "Can lead to drawish positions"
    ],
    keyMoves: [
      { move: "3.Bb5", explanation: "Pin the knight and threaten to double pawns" },
      { move: "4.Ba4", explanation: "Maintain pressure while avoiding exchange" },
      { move: "6.Re1", explanation: "Prepare to support e4 and control e-file" },
      { move: "9.h3", explanation: "Prevent Bg4 pin and prepare kingside expansion" }
    ],
    winRate: "52%",
    popularity: "Very High"
  },
  {
    name: "Sicilian Defense",
    pgn: "1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Be3 e5 7.Nb3 Be6 8.f3 Be7 9.Qd2 O-O 10.O-O-O Nbd7 11.g4 b5 12.g5 Nh5 13.Nd5 Bxd5 14.exd5 Nb6",
    description: "The most popular response to 1.e4",
    positionalIdeas: [
      "Control d4 square with c5",
      "Prepare queenside expansion",
      "Develop pieces harmoniously",
      "Create counterplay on queenside"
    ],
    longTermPlans: [
      "Queenside pawn storm with b5-b4",
      "Central breakthrough with d5",
      "Kingside attack after castling",
      "Pressure on c-file"
    ],
    pros: [
      "Leads to dynamic positions",
      "Black has good winning chances",
      "Many different variations",
      "Rich tactical possibilities"
    ],
    cons: [
      "Complex and theoretical",
      "White has more space",
      "Requires precise play",
      "Can be dangerous if not prepared"
    ],
    keyMoves: [
      { move: "1...c5", explanation: "Control d4 and prepare queenside expansion" },
      { move: "5...a6", explanation: "Prevent Bb5+ and prepare b5" },
      { move: "6...e5", explanation: "Gain space and control d4" },
      { move: "11...b5", explanation: "Queenside expansion and counterplay" }
    ],
    winRate: "48%",
    popularity: "Very High"
  },
  {
    name: "Queen's Gambit",
    pgn: "1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Be7 5.e3 O-O 6.Nf3 h6 7.Bh4 b6 8.cxd5 exd5 9.Bd3 Bb7 10.O-O Nbd7 11.Qc2 c5 12.Rfd1 Qc7 13.dxc5 bxc5",
    description: "Classical positional opening",
    positionalIdeas: [
      "Control the center with pawns",
      "Develop pieces to active squares",
      "Prepare kingside attack",
      "Maintain pressure on d5"
    ],
    longTermPlans: [
      "Kingside attack with pawn storm",
      "Pressure on isolated d5 pawn",
      "Control of key central squares",
      "Queenside expansion"
    ],
    pros: [
      "Positionally sound",
      "Leads to rich middlegames",
      "White has slight advantage",
      "Many different plans"
    ],
    cons: [
      "Can be drawish",
      "Requires patience",
      "Black has solid defenses",
      "Complex endgame play"
    ],
    keyMoves: [
      { move: "2.c4", explanation: "Challenge center and gain space" },
      { move: "4.Bg5", explanation: "Pin knight and create pressure" },
      { move: "8.cxd5", explanation: "Create isolated pawn structure" },
      { move: "11.Qc2", explanation: "Prepare kingside attack" }
    ],
    winRate: "54%",
    popularity: "High"
  }
];

export default function OpeningAnalysis() {
  const [currentOpeningIndex, setCurrentOpeningIndex] = useState(0);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState(null);

  const currentOpening = openingDatabase[currentOpeningIndex];

  // Safe chess operations with error handling
  const getCurrentPosition = () => {
    try {
      if (!currentOpening) return 'start';
      
      const chess = new Chess();
      chess.loadPgn(currentOpening.pgn);
      const moves = chess.history();
      
      chess.reset();
      for (let i = 0; i < currentMoveIndex && i < moves.length; i++) {
        try {
          chess.move(moves[i]);
        } catch (moveError) {
          console.warn('Invalid move:', moves[i], moveError);
          break;
        }
      }
      
      return chess.fen();
    } catch (error) {
      console.error('Error getting position:', error);
      setError('Error loading chess position');
      return 'start';
    }
  };

  const getCurrentMove = () => {
    try {
      if (!currentOpening) return null;
      
      const chess = new Chess();
      chess.loadPgn(currentOpening.pgn);
      const moves = chess.history();
      
      if (currentMoveIndex < moves.length) {
        return moves[currentMoveIndex];
      }
      return null;
    } catch (error) {
      console.error('Error getting current move:', error);
      return null;
    }
  };

  const getMaxMoves = () => {
    try {
      if (!currentOpening) return 0;
      const chess = new Chess();
      chess.loadPgn(currentOpening.pgn);
      return chess.history().length;
    } catch (error) {
      console.error('Error getting max moves:', error);
      return 0;
    }
  };

  // Auto-play through moves with error handling
  useEffect(() => {
    if (!isPlaying || !currentOpening) return;

    const interval = setInterval(() => {
      setCurrentMoveIndex(prev => {
        const maxMoves = getMaxMoves();
        
        if (prev < maxMoves - 1) {
          return prev + 1;
        } else {
          // Finished this opening, transition to next
          setIsTransitioning(true);
          setTimeout(() => {
            setCurrentOpeningIndex(prev => (prev + 1) % openingDatabase.length);
            setCurrentMoveIndex(0);
            setIsTransitioning(false);
          }, 3000); // 3 second pause
          return prev;
        }
      });
    }, 2500); // 2.5 seconds per move

    return () => clearInterval(interval);
  }, [isPlaying, currentOpening]);

  // Error fallback display
  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        background: 'rgba(20, 30, 50, 0.92)',
        border: '2px solid #e53935',
        borderRadius: '18px',
        boxShadow: '0 0 32px 4px #e5393533'
      }}>
        <Typography variant="h4" sx={{ color: '#e53935', textShadow: '0 0 12px #e5393599' }}>
          {error} - Please refresh the page
        </Typography>
      </Box>
    );
  }

  if (isTransitioning) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        background: 'rgba(20, 30, 50, 0.92)',
        border: '2px solid #00eaff',
        borderRadius: '18px',
        boxShadow: '0 0 32px 4px #00eaff33'
      }}>
        <Typography variant="h4" sx={{ color: '#00eaff', textShadow: '0 0 12px #00eaff99' }}>
          Next Opening Loading...
        </Typography>
      </Box>
    );
  }

  const maxMoves = getMaxMoves();
  const progress = maxMoves > 0 ? ((currentMoveIndex + 1) / maxMoves) * 100 : 0;

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" sx={{ color: '#00eaff', mb: 3, textAlign: 'center', textShadow: '0 0 12px #00eaff99' }}>
        Opening Analysis: {currentOpening?.name || 'Loading...'}
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Left side - Board and Move Info */}
        <Box sx={{ minWidth: 300, maxWidth: 400 }}>
          <Paper sx={{ 
            background: 'rgba(20, 30, 50, 0.92)', 
            border: '2px solid #00eaff',
            borderRadius: '18px',
            boxShadow: '0 0 32px 4px #00eaff33',
            p: 3,
            mb: 2
          }}>
            <Chessboard
              position={getCurrentPosition()}
              arePiecesDraggable={false}
              boardWidth={300}
              customBoardStyle={{
                boxShadow: '0 0 24px 4px #4b2e83cc',
                borderRadius: 12,
              }}
              animationDuration={300}
            />
            
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#00eaff', mb: 1 }}>
                Move {currentMoveIndex + 1} / {maxMoves}
              </Typography>
              
              {getCurrentMove() && (
                <Typography variant="body1" sx={{ color: '#b3c6e0', mb: 2 }}>
                  Current Move: <strong>{getCurrentMove()}</strong>
                </Typography>
              )}
              
              <ChargingBar 
                progress={progress} 
                label="Opening Progress"
              />
            </Box>
          </Paper>
        </Box>

        {/* Right side - Analysis */}
        <Box sx={{ minWidth: 400, maxWidth: 600 }}>
          <Paper sx={{ 
            background: 'rgba(20, 30, 50, 0.92)', 
            border: '2px solid #00eaff',
            borderRadius: '18px',
            boxShadow: '0 0 32px 4px #00eaff33',
            p: 3
          }}>
            <Typography variant="h5" sx={{ color: '#00eaff', mb: 2 }}>
              {currentOpening?.description || 'Loading opening details...'}
            </Typography>

            {/* Stats */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Chip label={`Win Rate: ${currentOpening?.winRate || 'N/A'}`} sx={{ background: '#00eaff22', color: '#00eaff' }} />
              <Chip label={`Popularity: ${currentOpening?.popularity || 'N/A'}`} sx={{ background: '#00eaff22', color: '#00eaff' }} />
            </Box>

            {/* Positional Ideas */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#b3c6e0', mb: 1 }}>Positional Ideas</Typography>
              <ul style={{ color: '#e0d6f6', paddingLeft: '20px' }}>
                {currentOpening?.positionalIdeas?.map((idea, idx) => (
                  <li key={idx}>{idea}</li>
                )) || <li>Loading positional ideas...</li>}
              </ul>
            </Box>

            {/* Long-term Plans */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#b3c6e0', mb: 1 }}>Long-term Plans</Typography>
              <ul style={{ color: '#e0d6f6', paddingLeft: '20px' }}>
                {currentOpening?.longTermPlans?.map((plan, idx) => (
                  <li key={idx}>{plan}</li>
                )) || <li>Loading long-term plans...</li>}
              </ul>
            </Box>

            {/* Pros and Cons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ color: '#4caf50', mb: 1 }}>Pros</Typography>
                <ul style={{ color: '#e0d6f6', paddingLeft: '20px' }}>
                  {currentOpening?.pros?.map((pro, idx) => (
                    <li key={idx}>{pro}</li>
                  )) || <li>Loading pros...</li>}
                </ul>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ color: '#f44336', mb: 1 }}>Cons</Typography>
                <ul style={{ color: '#e0d6f6', paddingLeft: '20px' }}>
                  {currentOpening?.cons?.map((con, idx) => (
                    <li key={idx}>{con}</li>
                  )) || <li>Loading cons...</li>}
                </ul>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Controls */}
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            background: isPlaying ? '#e53935' : '#00eaff',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 0 16px 4px rgba(0, 234, 255, 0.3)',
            transition: 'all 0.3s ease',
            marginRight: '10px'
          }}
        >
          {isPlaying ? 'Pause' : 'Play'} Analysis
        </button>
        
        <button 
          onClick={() => {
            setCurrentOpeningIndex(prev => (prev + 1) % openingDatabase.length);
            setCurrentMoveIndex(0);
          }}
          style={{
            background: '#4b2e83',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 0 16px 4px rgba(75, 46, 131, 0.3)',
            transition: 'all 0.3s ease'
          }}
        >
          Next Opening
        </button>
      </Box>
    </Box>
  );
} 