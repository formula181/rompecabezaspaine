import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Simple file-based store
const DATA_PATH = process.env.SCORES_FILE || path.join(__dirname, 'scores.json');

function loadScores(){
  try { return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8')); }
  catch(e){ return []; }
}
function saveScores(arr){
  fs.writeFileSync(DATA_PATH, JSON.stringify(arr, null, 2));
}

app.get('/api/scores', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit||'10',10), 50);
  const scores = loadScores()
    .sort((a,b)=> b.score - a.score || a.seconds - b.seconds || a.moves - b.moves)
    .slice(0, limit);
  res.json(scores);
});

app.post('/api/scores', (req, res) => {
  const { name, score, seconds, moves, level } = req.body || {};
  if (!name || !Number.isFinite(score)) return res.status(400).json({error: 'bad payload'});
  const entry = {
    name: String(name).slice(0,30),
    score: Math.max(1, Math.floor(score)),
    seconds: Math.max(0, Math.floor(seconds||0)),
    moves: Math.max(0, Math.floor(moves||0)),
    level: Math.max(1, Math.floor(level||1)),
    timestamp: Date.now()
  };
  const all = loadScores();
  all.push(entry);
  saveScores(all);
  res.json({ok: true});
});

// Serve static if desired (optional): uncomment to host frontend too
// app.use(express.static(path.join(__dirname, '..')));

app.listen(PORT, () => {
  console.log('Leaderboard server running on port ' + PORT);
});
