const express = require('express');
const router = express.Router();

module.exports = (pool, auth) => {
  router.get('/', auth, async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM cursos');
      res.json(rows);
    } catch (e) {
      res.status(500).json({ error: 'Error al obtener cursos' });
    }
  });

  router.post('/', auth, async (req, res) => {
    const { nombre, creditos } = req.body || {};
    if (!nombre || creditos == null) return res.status(400).json({ error: 'Nombre y créditos son obligatorios' });
    try {
      const [r] = await pool.query('INSERT INTO cursos (nombre, creditos) VALUES (?, ?)', [nombre, creditos]);
      res.json({ mensaje: 'Curso agregado', id: r.insertId });
    } catch (e) {
      res.status(500).json({ error: 'Error al insertar curso' });
    }
  });

  return router;
};
