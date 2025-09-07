const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super_secreto';
const PORT = process.env.PORT || 3005;
const STUDENTS_URL = process.env.STUDENTS_URL || 'http://localhost:3003/estudiantes';
const COURSES_URL = process.env.COURSES_URL || 'http://localhost:3004/cursos';

// almacén simple de inscripciones
const inscripciones = []; // {id, estudianteId, cursoId}

function auth(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; next();
  });
}

app.get('/inscripciones', auth, async (req, res) => {
  try {
    const [estRes, curRes] = await Promise.all([
      axios.get(STUDENTS_URL, { headers: { Authorization: req.headers['authorization'] }}),
      axios.get(COURSES_URL,  { headers: { Authorization: req.headers['authorization'] }})
    ]);

    const estudiantes = estRes.data;
    const cursos = curRes.data;

    const detalle = inscripciones.map(i => ({
      id: i.id,
      estudiante: estudiantes.find(e => e.id === i.estudianteId) || { id: i.estudianteId, nombre: 'Desconocido'},
      curso: cursos.find(c => c.id === i.cursoId) || { id: i.cursoId, nombre: 'Desconocido'}
    }));

    res.json({ inscripciones: detalle, total: detalle.length });
  } catch (e) {
    res.status(500).json({ error: 'Error al componer inscripciones' });
  }
});

app.post('/inscripciones', auth, (req, res) => {
  const { estudianteId, cursoId } = req.body || {};
  if (!estudianteId || !cursoId) return res.status(400).json({ error: 'estudianteId y cursoId son obligatorios' });
  const id = inscripciones.length + 1;
  inscripciones.push({ id, estudianteId: Number(estudianteId), cursoId: Number(cursoId) });
  res.json({ mensaje: 'Inscripción creada', id });
});

app.listen(PORT, () => {
  console.log(`Enrollments service en http://localhost:${PORT}`);
});
