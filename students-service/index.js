const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super_secreto';
const PORT = process.env.PORT || 3003;

function auth(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; next();
  });
}

const estudiantesRouter = require('./routes/estudiantes')(pool, auth);
app.use('/estudiantes', estudiantesRouter);

app.listen(PORT, () => {
  console.log(`Students service en http://localhost:${PORT}`);
});
