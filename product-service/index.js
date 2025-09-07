const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super_secreto';
const PORT = process.env.PORT || 3002;

// Middleware de validación de token (Bearer)
function authMiddleware(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.get('/products', authMiddleware, (req, res) => {
  res.json([
    { id: 1, name: 'Producto A' },
    { id: 2, name: 'Producto B' }
  ]);
});

app.listen(PORT, () => {
  console.log(`Product service corriendo en http://localhost:${PORT}`);
});
