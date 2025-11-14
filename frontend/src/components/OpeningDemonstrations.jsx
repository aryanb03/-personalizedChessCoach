import { useEffect, useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import ChargingBar from './ChargingBar';

// Popular openings database
const openings = [
  {
    name: "Ruy Lopez",
    pgn: "1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6 8.c3 O-O 9.h3 Nb8 10.d4 Nbd7 11.Nbd2 Bb7 12.Bc2 Re8 13.Nf1 Bf8 14.Ng3 g6 15.Bg5 h6",
    description: "The most popular opening in chess history",
    winRate: "52%",
    popularity: "Very High"
  },
  {
    name: "Sicilian Defense",
    pgn: "1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Be3 e5 7.Nb3 Be6 8.f3 Be7 9.Qd2 O-O 10.O-O-O Nbd7 11.g4 b5 12.g5 Nh5 13.Nd5 Bxd5 14.exd5 Nb6",
    description: "The most popular response to 1.e4",
    winRate: "48%",
    popularity: "Very High"
  },
  {
    name: "Queen's Gambit",
    pgn: "1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Be7 5.e3 O-O 6.Nf3 h6 7.Bh4 b6 8.cxd5 exd5 9.Bd3 Bb7 10.O-O Nbd7 11.Qc2 c5 12.Rfd1 Qc7 13.dxc5 bxc5",
    description: "Classical positional opening",
    winRate: "54%",
    popularity: "High"
  },
  {
    name: "King's Indian Defense",
    pgn: "1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.Nf3 O-O 6.Be2 e5 7.Be3 Ng4 8.Bg5 f6 9.Bh4 Nc6 10.d5 Ne7 11.Nd2 Nh6 12.O-O f5 13.exf5 gxf5",
    description: "Dynamic counter-attacking defense",
    winRate: "46%",
    popularity: "High"
  }
];

export default function OpeningDemonstrations() {
  const [currentMoveIndexes, setCurrentMoveIndexes] = useState([0, 0, 0, 0]);
  const [currentOpenings, setCurrentOpenings] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);

  // Initialize with random openings
  useEffect(() => {
    const randomOpenings = [];
    for (let i = 0; i < 4; i++) {
      randomOpenings.push(openings[Math.floor(Math.random() * openings.length)]);
    }
    setCurrentOpenings(randomOpenings);
  }, []);

  // Auto-play moves
  useEffect(() => {
    if (!isPlaying || currentOpenings.length === 0) return;

    const interval = setInterval(() => {
      setCurrentMoveIndexes(prev => {
        const newIndexes = [...prev];
        console.log('Current indexes before update:', prev);
        
        for (let i = 0; i < 4; i++) {
          const chess = new Chess();
          chess.loadPgn(currentOpenings[i].pgn);
          const maxMoves = chess.history().length;
          
          if (newIndexes[i] < maxMoves - 1) {
            newIndexes[i]++;
            console.log(`Board ${i}: Incremented to move ${newIndexes[i]}`);
          } else {
            // Reset to new opening
            newIndexes[i] = 0;
            const newOpening = openings[Math.floor(Math.random() * openings.length)];
            setCurrentOpenings(prevOpenings => {
              const newOpenings = [...prevOpenings];
              newOpenings[i] = newOpening;
              console.log(`Board ${i}: Switched to ${newOpening.name}`);
              return newOpenings;
            });
          }
        }
        
        console.log('New indexes after update:', newIndexes);
        return newIndexes;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying, currentOpenings]);

  const getBoardPosition = (boardIndex) => {
    if (!currentOpenings[boardIndex]) return 'start';
    
    const chess = new Chess();
    chess.loadPgn(currentOpenings[boardIndex].pgn);
    const moves = chess.history();
    const currentIndex = currentMoveIndexes[boardIndex] || 0;
    
    // Reset and play moves up to current index
    chess.reset();
    for (let i = 0; i < currentIndex && i < moves.length; i++) {
      try {
        chess.move(moves[i]);
      } catch (error) {
        console.error(`Error applying move ${i}:`, moves[i], error);
      }
    }
    
    const fen = chess.fen();
    console.log(`Board ${boardIndex}: Move ${currentIndex}, FEN: ${fen}`);
    return fen;
  };

  const getMaxMoves = (boardIndex) => {
    if (!currentOpenings[boardIndex]) return 1;
    const chess = new Chess();
    chess.loadPgn(currentOpenings[boardIndex].pgn);
    return chess.history().length;
  };

  if (currentOpenings.length === 0) {
    return (
      <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ color: '#00eaff' }}>
          Loading Opening Demonstrations...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" sx={{ color: '#00eaff', mb: 3, textAlign: 'center', textShadow: '0 0 12px #00eaff99' }}>
        Live Opening Demonstrations
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[0, 1, 2, 3].map((boardIndex) => (
          <Grid item xs={12} sm={6} key={boardIndex}>
            <Box sx={{
              background: 'rgba(20, 30, 50, 0.92)',
              border: '2px solid #00eaff',
              borderRadius: '18px',
              boxShadow: '0 0 32px 4px #00eaff33',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Typography variant="h5" sx={{ color: '#00eaff', mb: 2, textShadow: '0 0 8px #00eaff99' }}>
                {currentOpenings[boardIndex]?.name || 'Loading...'}
              </Typography>
              
              <Chessboard
                key={`board-${boardIndex}-${currentMoveIndexes[boardIndex]}`}
                position={getBoardPosition(boardIndex)}
                arePiecesDraggable={false}
                boardWidth={200}
                customBoardStyle={{
                  boxShadow: '0 0 24px 4px #4b2e83cc',
                  borderRadius: 12,
                }}
                animationDuration={300}
              />
              
              <Box sx={{ mt: 2, textAlign: 'center', width: '100%' }}>
                <Typography variant="body2" sx={{ color: '#b3c6e0', mb: 1 }}>
                  Move {currentMoveIndexes[boardIndex] || 0} / {getMaxMoves(boardIndex)}
                </Typography>
                
                <ChargingBar 
                  progress={((currentMoveIndexes[boardIndex] || 0) / getMaxMoves(boardIndex)) * 100} 
                  label={`${currentOpenings[boardIndex]?.name || 'Opening'} Progress`}
                />
                
                <Typography variant="caption" sx={{ color: '#888', display: 'block', mt: 1 }}>
                  Win Rate: {currentOpenings[boardIndex]?.winRate || 'N/A'} | 
                  Popularity: {currentOpenings[boardIndex]?.popularity || 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
      
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
            transition: 'all 0.3s ease'
          }}
        >
          {isPlaying ? 'Pause' : 'Play'} Demonstrations
        </button>
      </Box>
    </Box>
  );
} 