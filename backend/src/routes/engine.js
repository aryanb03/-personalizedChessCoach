const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

// POST /api/engine/analyze
router.post('/analyze', async (req, res) => {
  const { fen } = req.body;
  if (!fen) return res.status(400).json({ error: 'FEN is required' });

  const stockfishPath = path.join(__dirname, '../engines/stockfish');
  let engine;
  try {
    engine = spawn(stockfishPath);
  } catch (err) {
    return res.status(500).json({ error: 'Stockfish engine not available on server.' });
  }

  let bestMove = null;
  let evalScore = null;
  let pv = null;
  let resolved = false;

  const handleLine = (line) => {
    if (typeof line !== 'string') line = line.toString();
    if (line.startsWith('info') && line.includes('score')) {
      const match = line.match(/score (cp|mate) (-?\d+)/);
      if (match) {
        if (match[1] === 'cp') {
          evalScore = (parseInt(match[2], 10) / 100.0).toFixed(2);
        } else if (match[1] === 'mate') {
          evalScore = `#${match[2]}`;
        }
      }
      const pvMatch = line.match(/ pv (.+)$/);
      if (pvMatch) {
        pv = pvMatch[1];
      }
    }
    if (line.startsWith('bestmove')) {
      bestMove = line.split(' ')[1];
      if (!resolved) {
        resolved = true;
        engine.kill();
        res.json({ bestMove, eval: evalScore, pv });
      }
    }
  };

  try {
    engine.stdout.on('data', (data) => {
      data.toString().split('\n').forEach(handleLine);
    });
    engine.stderr.on('data', (data) => {
      // Log errors but don't crash
    });
    engine.on('error', (err) => {
      if (!resolved) {
        resolved = true;
        res.status(500).json({ error: 'Stockfish engine error.' });
      }
    });
    engine.stdin.write('uci\n');
    engine.stdin.write('ucinewgame\n');
    engine.stdin.write(`position fen ${fen}\n`);
    engine.stdin.write('go depth 15\n');
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        engine.kill();
        res.status(504).json({ error: 'Engine timeout' });
      }
    }, 8000);
  } catch (err) {
    if (!resolved) {
      resolved = true;
      res.status(500).json({ error: 'Engine error', details: err.message });
    }
  }
});

module.exports = router; 