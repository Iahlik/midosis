const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const router = express.Router();
const pool = require('../db/conexion');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token requerido' });

  try {
    req.user = jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch {
    res.status(403).json({ message: 'Token inválido o expirado' });
  }
}

// Inicio de sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña requeridos' });
    }

    const result = await pool.query(
      'SELECT * FROM usuarios WHERE correo_electronico = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const usuario = result.rows[0];
    const contrasenaValida = await bcrypt.compare(password, usuario.contrasena);

    if (!contrasenaValida) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: usuario.usuario_id, email: usuario.correo_electronico },
      process.env.SECRET_KEY,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: usuario.usuario_id,
        nombre: usuario.nombre,
        correo_electronico: usuario.correo_electronico,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Registrar nuevo usuario
router.post('/usuarios', async (req, res) => {
  try {
    const { nombre, correo_electronico, contrasena } = req.body;

    if (!nombre || !correo_electronico || !contrasena) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    if (contrasena.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const existing = await pool.query(
      'SELECT usuario_id FROM usuarios WHERE correo_electronico = $1',
      [correo_electronico]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }

    const hashedContrasena = await bcrypt.hash(contrasena, 10);

    await pool.query(
      'INSERT INTO usuarios (nombre, correo_electronico, contrasena) VALUES ($1, $2, $3)',
      [nombre, correo_electronico, hashedContrasena]
    );

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener datos del usuario autenticado
router.get('/usuarios/me', verifyToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT usuario_id, nombre, correo_electronico FROM usuarios WHERE usuario_id = $1',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener medicamentos del usuario (con nombre del medicamento)
router.get('/medicamentos/:usuario_id', verifyToken, async (req, res) => {
  try {
    const usuario_id = parseInt(req.params.usuario_id, 10);

    if (req.user.id !== usuario_id) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    const { rows } = await pool.query(
      `SELECT dd.dosis_id, dd.usuario_id, dd.medicamento_id,
              m.nombre AS nombre_medicamento,
              dd.cantidad_mg, dd.intervalo_horas, dd.cada_cuanto_dias
       FROM detalles_dosis dd
       JOIN medicamentos m ON dd.medicamento_id = m.medicamento_id
       WHERE dd.usuario_id = $1`,
      [usuario_id]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los medicamentos' });
  }
});

// Agregar medicamento
router.post('/medicamentos', verifyToken, async (req, res) => {
  try {
    const { usuario_id, medicamento_id, cantidad_mg, intervalo_horas, cada_cuanto_dias } = req.body;

    if (!usuario_id || !medicamento_id || !cantidad_mg || !intervalo_horas || !cada_cuanto_dias) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    await pool.query(
      'INSERT INTO detalles_dosis (usuario_id, medicamento_id, cantidad_mg, intervalo_horas, cada_cuanto_dias) VALUES ($1, $2, $3, $4, $5)',
      [usuario_id, medicamento_id, cantidad_mg, intervalo_horas, cada_cuanto_dias]
    );

    res.status(201).json({ message: 'Medicamento agregado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar el medicamento' });
  }
});

// Actualizar medicamento
router.put('/medicamentos/:dosis_id', verifyToken, async (req, res) => {
  try {
    const dosis_id = parseInt(req.params.dosis_id, 10);
    const { cantidad_mg, intervalo_horas, cada_cuanto_dias } = req.body;

    await pool.query(
      'UPDATE detalles_dosis SET cantidad_mg = $1, intervalo_horas = $2, cada_cuanto_dias = $3 WHERE dosis_id = $4',
      [cantidad_mg, intervalo_horas, cada_cuanto_dias, dosis_id]
    );

    res.status(200).json({ message: 'Medicamento actualizado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el medicamento' });
  }
});

// Eliminar medicamento
router.delete('/medicamentos/:dosis_id', verifyToken, async (req, res) => {
  try {
    const dosis_id = parseInt(req.params.dosis_id, 10);

    await pool.query('DELETE FROM detalles_dosis WHERE dosis_id = $1', [dosis_id]);

    res.status(200).json({ message: 'Medicamento eliminado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el medicamento' });
  }
});

// Listar medicamentos disponibles (catálogo)
router.get('/catalogo-medicamentos', verifyToken, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT medicamento_id, nombre FROM medicamentos ORDER BY nombre');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener catálogo' });
  }
});

module.exports = router;
