const express = require('express');
const router = express.Router();

module.exports = (pool, auth) => {

  // GET /estudiantes
  router.get('/', auth, async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM estudiantes');
      res.json(rows);
    } catch (e) {
      res.status(500).json({ error: 'Error al obtener estudiantes' });
    }
  });

  // POST /estudiantes
  router.post('/', auth, async (req, res) => {
    const { nombre, carrera } = req.body || {};
    if (!nombre || !carrera) return res.status(400).json({ error: 'Nombre y carrera son obligatorios' });
    try {
      const [r] = await pool.query('INSERT INTO estudiantes (nombre, carrera) VALUES (?, ?)', [nombre, carrera]);
      res.json({ mensaje: 'Estudiante agregado', id: r.insertId });
    } catch (e) {
      res.status(500).json({ error: 'Error al insertar en la base de datos' });
    }
  });

  // PUT /estudiantes/:id
  router.put('/:id', auth, async (req, res) => {
    const { nombre, carrera } = req.body || {};
    const { id } = req.params;
    try {
      const [r] = await pool.query('UPDATE estudiantes SET nombre=?, carrera=? WHERE id=?', [nombre, carrera, id]);
      res.json({ mensaje: 'Estudiante actualizado', changed: r.changedRows });
    } catch (e) {
      res.status(500).json({ error: 'Error al actualizar' });
    }
  });

  // DELETE /estudiantes/:id
  router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM estudiantes WHERE id=?', [id]);
      res.json({ mensaje: 'Estudiante eliminado' });
    } catch (e) {
      res.status(500).json({ error: 'Error al eliminar' });
    }
  });

  return router;
};
