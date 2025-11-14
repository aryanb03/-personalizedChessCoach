const express = require('express');
const cors = require('cors');
const app = express();
const lichessRouter = require('./routes/lichess');
const engineRouter = require('./routes/engine');
const coachRouter = require('./routes/coach');

app.use(cors());
app.use(express.json());

// Mount Lichess API routes
app.use('/api/lichess', lichessRouter);
app.use('/api/engine', engineRouter);
app.use('/api/coach', coachRouter);

app.get('/api/hello', (req, res) => res.json({ message: 'Hello from backend!' }));
app.listen(3001, () => console.log('Backend running on port 3001'));
