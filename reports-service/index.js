const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super_secreto';
const PORT = process.env.PORT || 3006;
const ENROLLMENTS_URL = process.env.ENROLLMENTS_URL || 'http://localhost:3005/inscripciones';

function auth(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; next();
  });
}

// GET /reportes/resumen -> total por curso
app.get('/reportes/resumen', auth, async (req, res) => {
  try {
    const { data } = await axios.get(ENROLLMENTS_URL, { headers: { Authorization: req.headers['authorization'] }});
    const conteo = {};
    for (const i of data.inscripciones) {
      const nombreCurso = i.curso?.nombre || `Curso ${i.curso?.id || '?'}`;
      conteo[nombreCurso] = (conteo[nombreCurso] || 0) + 1;
    }
    res.json({ totalInscripciones: data.total, porCurso: conteo });
  } catch (e) {
    res.status(500).json({ error: 'No se pudo generar el reporte' });
  }
});

app.listen(PORT, () => {
  console.log(`Reports service en http://localhost:${PORT}`);
});
