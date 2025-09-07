const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super_secreto';
const PORT = process.env.PORT || 3004;

function auth(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; next();
  });
}

const cursosRouter = require('./routes/cursos')(pool, auth);
app.use('/cursos', cursosRouter);

app.listen(PORT, () => {
  console.log(`Courses service en http://localhost:${PORT}`);
});
