import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Chessboard } from 'react-chessboard';
import ChargingBar from './ChargingBar';

export default function LiveLichessGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch('http://localhost:3001/api/lichess/tv')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setGames(data.slice(0, 4)); // Show top 4 games
        } else {
          setError('No live games found.');
        }
      })
      .catch(() => setError('Failed to fetch live games.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Typography variant="h3" sx={{ color: '#00eaff', mb: 2, textShadow: '0 0 12px #00eaff99' }}>
        Live Top Lichess Games
      </Typography>
      {loading && <ChargingBar progress={80} label="Fetching live games..." />}
      {error && <Typography color="error">{error}</Typography>}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
        {games.map((game, idx) => (
          <Box key={idx} sx={{
            background: 'rgba(20, 30, 50, 0.92)',
            border: '2px solid #00eaff',
            borderRadius: '14px',
            boxShadow: '0 0 24px 2px #00eaff33',
            p: 2,
            minWidth: 180,
            maxWidth: 220,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <Chessboard
              position={game.fen}
              arePiecesDraggable={false}
              boardWidth={120}
              customBoardStyle={{
                boxShadow: '0 0 16px 2px #4b2e83cc',
                borderRadius: 8,
              }}
            />
            <Typography variant="body2" sx={{ color: '#e0d6f6', mt: 1 }}>
              {game.white.name} ({game.white.rating}) vs {game.black.name} ({game.black.rating})
            </Typography>
            <Typography variant="caption" sx={{ color: '#b3c6e0' }}>
              {game.clock ? `Time: ${game.clock}` : ''}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
} 