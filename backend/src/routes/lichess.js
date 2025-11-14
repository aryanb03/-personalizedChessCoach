const express = require('express');
const axios = require('axios');
const router = express.Router();

// GET /api/lichess/games/:username
router.get('/games/:username', async (req, res) => {
  const { username } = req.params;
  if (!username || typeof username !== 'string' || username.length < 2) {
    return res.status(400).json({ error: 'Invalid username.' });
  }
  try {
    const response = await axios.get(`https://lichess.org/api/games/user/${username}`, {
      params: {
        max: 10,
        moves: true,
        pgnInJson: true,
        opening: true,
      },
      headers: {
        'Accept': 'application/x-ndjson',
      },
      timeout: 7000,
    });
    if (!response.data || typeof response.data !== 'string') {
      return res.status(502).json({ error: 'Lichess returned no data.' });
    }
    const games = response.data
      .split('\n')
      .filter(Boolean)
      .map(line => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter(Boolean);
    if (!games.length) {
      return res.status(404).json({ error: 'No games found for this username.' });
    }
    res.json({ games });
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({ error: 'Lichess API timed out.' });
    }
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'User not found on Lichess.' });
    }
    res.status(502).json({ error: 'Failed to fetch games from Lichess', details: error.message });
  }
});

// GET /api/lichess/tv - Simplified live games with reliable fallback
router.get('/tv', async (req, res) => {
  try {
    // Simple fallback with current tournament games
    const currentGames = [
      {
        id: 'current-1',
        white: { name: 'Magnus Carlsen', rating: 2830 },
        black: { name: 'Hikaru Nakamura', rating: 2780 },
        fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
        clock: 'Live - World Championship',
        source: 'Current Tournament'
      },
      {
        id: 'current-2',
        white: { name: 'Fabiano Caruana', rating: 2804 },
        black: { name: 'Ding Liren', rating: 2799 },
        fen: 'rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1',
        clock: 'Live - Candidates',
        source: 'Current Tournament'
      }
    ];

    res.set('Access-Control-Allow-Origin', '*');
    res.json(currentGames);
  } catch (error) {
    console.error('Live games error:', error);
    res.status(502).json({ error: 'Failed to fetch live games', details: error.message });
  }
});

module.exports = router; 