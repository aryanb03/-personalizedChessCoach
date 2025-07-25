#!/bin/bash

# Exit on error
set -e

echo "==> Creating backend..."
mkdir -p backend/src/{routes,controllers,services,utils} backend/tests
cd backend
npm init -y
npm install express cors dotenv
npm install --save-dev nodemon
cat <<EOT > src/index.js
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.get('/api/hello', (req, res) => res.json({ message: 'Hello from backend!' }));
app.listen(3001, () => console.log('Backend running on port 3001'));
EOT
npx json -I -f package.json -e 'this.scripts={"start":"node src/index.js","dev":"nodemon src/index.js"}'
cd ..

echo "==> Creating frontend (Vite + React)..."
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install chess.js react-chessboard react-router-dom
cd ..

echo "==> Creating .gitignore and README.md..."
cat <<EOT > .gitignore
node_modules/
dist/
.env
.DS_Store
EOT

cat <<EOT > README.md
# ChessAgent

A chess platform that analyzes your games, identifies your style and weaknesses, and recommends moves tailored to your improvement.
EOT

echo "==> Initializing git..."
git init
git add .
git commit -m "Initial project scaffolding"

echo "==> All done!"
echo "To start the backend: cd backend && npm run dev"
echo "To start the frontend: cd frontend && npm run dev"
