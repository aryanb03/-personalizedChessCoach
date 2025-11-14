import { useEffect, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { Box, Button, Typography, CircularProgress, Tooltip, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import ChargingBar from './ChargingBar';
import './ChargingBar.css';

function parsePGNMoves(pgn) {
  const chess = new Chess();
  chess.loadPgn(pgn);
  return chess.history({ verbose: true });
}

export default function Board({ pgn }) {
  const [chess] = useState(new Chess());
  const [moveIndex, setMoveIndex] = useState(0);
  const [moves, setMoves] = useState([]);
  const [fen, setFen] = useState(chess.fen());
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const [charge, setCharge] = useState(0);
  const chargeRef = useRef();

  useEffect(() => {
    if (pgn) {
      chess.reset();
      chess.loadPgn(pgn);
      const allMoves = chess.history({ verbose: true });
      setMoves(allMoves);
      setMoveIndex(0);
      chess.reset();
      setFen(chess.fen());
    }
    // eslint-disable-next-line
  }, [pgn]);

  // Charging bar animation while analyzing
  useEffect(() => {
    if (analyzing) {
      setCharge(0);
      chargeRef.current = setInterval(() => {
        setCharge((prev) => (prev >= 100 ? 0 : prev + 2 + Math.random() * 3));
      }, 40);
    } else {
      setCharge(100);
      clearInterval(chargeRef.current);
    }
    return () => clearInterval(chargeRef.current);
  }, [analyzing]);

  // Fetch Stockfish analysis when FEN changes
  useEffect(() => {
    if (!fen) return;
    setAnalyzing(true);
    setAnalysis(null);
    setAnalysisError('');
    fetch('http://localhost:3001/api/engine/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fen }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setAnalysisError(data.error);
        } else {
          setAnalysis(data);
        }
      })
      .catch(() => setAnalysisError('Engine error'))
      .finally(() => setAnalyzing(false));
  }, [fen]);

  const goToMove = (idx) => {
    chess.reset();
    for (let i = 0; i < idx; i++) {
      chess.move(moves[i]);
    }
    setMoveIndex(idx);
    setFen(chess.fen());
    console.log(`Moved to index ${idx}, FEN: ${chess.fen()}`);
  };

  const nextMove = () => {
    if (moveIndex < moves.length) {
      goToMove(moveIndex + 1);
    }
  };
  const prevMove = () => {
    if (moveIndex > 0) {
      goToMove(moveIndex - 1);
    }
  };
  const firstMove = () => goToMove(0);
  const lastMove = () => goToMove(moves.length);

  // Group moves into pairs for display (1. e4 e5, 2. Nf3 Nc6, etc.)
  const groupedMoves = [];
  for (let i = 0; i < moves.length; i += 2) {
    const moveNumber = Math.floor(i / 2) + 1;
    const whiteMove = moves[i];
    const blackMove = moves[i + 1];
    groupedMoves.push({
      number: moveNumber,
      white: whiteMove,
      black: blackMove
    });
  }

  return (
    <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start', maxWidth: '100%', flexWrap: 'wrap' }}>
      {/* Left side - Board and Controls */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minWidth: 350 }}>
        <Chessboard
          position={fen}
          arePiecesDraggable={false}
          boardWidth={300}
          customBoardStyle={{
            boxShadow: '0 0 32px 8px #4b2e83cc',
            borderRadius: 12,
            background: 'radial-gradient(circle at 60% 40%, #2a1d3a 60%, #18141a 100%)',
          }}
          animationDuration={300}
        />
        
        {/* Move Navigation Controls */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button variant="contained" color="primary" onClick={firstMove}>&laquo;</Button>
          <Button variant="contained" color="primary" onClick={prevMove}>&lsaquo;</Button>
          <Typography variant="body1" sx={{ minWidth: 80, textAlign: 'center', color: '#e0d6f6', textShadow: '0 0 8px #4b2e83cc' }}>
            Move {moveIndex} / {moves.length}
          </Typography>
          <Button variant="contained" color="primary" onClick={nextMove}>&rsaquo;</Button>
          <Button variant="contained" color="primary" onClick={lastMove}>&raquo;</Button>
        </Box>
        
        <ChargingBar progress={analyzing ? charge : 100} label={analyzing ? 'Charging Analysis...' : 'Analysis Ready'} />
        
        {/* Analysis Display */}
        <Box sx={{
          mt: 2,
          p: 2,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #221a2f 60%, #4b2e83 100%)',
          boxShadow: '0 0 16px 4px #4b2e8388',
          minWidth: 320,
          color: '#e0d6f6',
          textAlign: 'center',
        }}>
          {analysisError && <Typography color="error">{analysisError}</Typography>}
          {analysis && !analyzing && !analysisError && (
            <>
              <Typography variant="h6" sx={{ color: '#e0d6f6', textShadow: '0 0 8px #4b2e83cc' }}>Stockfish Analysis</Typography>
              <Typography variant="body1">
                <Tooltip title="Engine evaluation (centipawns, positive = White is better)">
                  <span>Eval: <b style={{ color: '#b39ddb' }}>{analysis.eval}</b></span>
                </Tooltip>
              </Typography>
              <Typography variant="body1">
                <Tooltip title="Best move according to Stockfish">
                  <span>Best Move: <b style={{ color: '#b39ddb' }}>{analysis.bestMove}</b></span>
                </Tooltip>
              </Typography>
              {analysis.pv && (
                <Typography variant="body2" sx={{ color: '#b39ddb' }}>
                  PV: {analysis.pv}
                </Typography>
              )}
            </>
          )}
        </Box>
      </Box>

      {/* Right side - Game Notation */}
      <Box sx={{ minWidth: 300, maxWidth: 400 }}>
        <Paper sx={{ 
          background: 'rgba(20, 30, 50, 0.92)', 
          border: '2px solid #00eaff',
          borderRadius: '18px',
          boxShadow: '0 0 32px 4px #00eaff33',
          p: 3,
          maxHeight: '600px',
          overflow: 'auto'
        }}>
          <Typography variant="h5" sx={{ color: '#00eaff', mb: 2, textAlign: 'center', textShadow: '0 0 12px #00eaff99' }}>
            Game Notation
          </Typography>
          
          {moves.length === 0 ? (
            <Typography sx={{ color: '#b3c6e0', textAlign: 'center', fontStyle: 'italic' }}>
              No moves available
            </Typography>
          ) : (
            <List sx={{ p: 0 }}>
              {groupedMoves.map((group, groupIndex) => {
                const whiteMoveIndex = groupIndex * 2;
                const blackMoveIndex = groupIndex * 2 + 1;
                const isWhiteCurrent = moveIndex === whiteMoveIndex;
                const isBlackCurrent = moveIndex === blackMoveIndex;
                
                return (
                  <Box key={group.number}>
                    <ListItem 
                      sx={{ 
                        p: 1, 
                        cursor: 'pointer',
                        borderRadius: 1,
                        mb: 0.5,
                        background: isWhiteCurrent || isBlackCurrent ? 'rgba(0, 234, 255, 0.2)' : 'transparent',
                        border: isWhiteCurrent || isBlackCurrent ? '1px solid #00eaff' : 'none',
                        '&:hover': {
                          background: 'rgba(0, 234, 255, 0.1)',
                        }
                      }}
                      onClick={() => goToMove(whiteMoveIndex)}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#00eaff', 
                                fontWeight: 'bold',
                                minWidth: '30px'
                              }}
                            >
                              {group.number}.
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: isWhiteCurrent ? '#00eaff' : '#e0d6f6',
                                fontWeight: isWhiteCurrent ? 'bold' : 'normal',
                                textShadow: isWhiteCurrent ? '0 0 8px #00eaff' : 'none',
                                flex: 1
                              }}
                            >
                              {group.white ? group.white.san : ''}
                            </Typography>
                            {group.black && (
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: isBlackCurrent ? '#00eaff' : '#e0d6f6',
                                  fontWeight: isBlackCurrent ? 'bold' : 'normal',
                                  textShadow: isBlackCurrent ? '0 0 8px #00eaff' : 'none',
                                  flex: 1
                                }}
                              >
                                {group.black.san}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    
                    {/* If there's a black move, make it clickable separately */}
                    {group.black && (
                      <ListItem 
                        sx={{ 
                          p: 1, 
                          cursor: 'pointer',
                          borderRadius: 1,
                          mb: 0.5,
                          background: isBlackCurrent ? 'rgba(0, 234, 255, 0.2)' : 'transparent',
                          border: isBlackCurrent ? '1px solid #00eaff' : 'none',
                          '&:hover': {
                            background: 'rgba(0, 234, 255, 0.1)',
                          }
                        }}
                        onClick={() => goToMove(blackMoveIndex)}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: '#00eaff', 
                                  fontWeight: 'bold',
                                  minWidth: '30px'
                                }}
                              >
                                {group.number}.
                              </Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: '#e0d6f6',
                                  flex: 1
                                }}
                              >
                                {group.white ? group.white.san : ''}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: isBlackCurrent ? '#00eaff' : '#e0d6f6',
                                  fontWeight: isBlackCurrent ? 'bold' : 'normal',
                                  textShadow: isBlackCurrent ? '0 0 8px #00eaff' : 'none',
                                  flex: 1
                                }}
                              >
                                {group.black.san}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    )}
                  </Box>
                );
              })}
            </List>
          )}
          
          {/* Game Info */}
          <Divider sx={{ my: 2, bgcolor: '#444' }} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#b3c6e0', mb: 1 }}>
              Total Moves: {moves.length}
            </Typography>
            <Typography variant="body2" sx={{ color: '#b3c6e0' }}>
              Current Position: {moveIndex === 0 ? 'Starting Position' : `After ${moveIndex} ${moveIndex === 1 ? 'move' : 'moves'}`}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
