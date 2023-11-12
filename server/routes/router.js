const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Asegúrate de haber instalado esta librería
require('dotenv').config();
const router = express.Router();
const pool = require('../db/conexion');

// Función para hashear la contraseña
async function hashContrasena(contrasena) {
  const saltRounds = 10;
  const hashedContrasena = await bcrypt.hash(contrasena, saltRounds);
  return hashedContrasena;
}

// Agrega medicamento
router.post('/medicamentos', async (req, res) => {
  try {
    const { usuario_id, medicamento_id, cantidad_mg, intervalo_horas, cada_cuanto_dias } = req.body;

    // Realiza la inserción del medicamento en la base de datos
    await pool.query(
      'INSERT INTO detalles_dosis (usuario_id, medicamento_id, cantidad_mg, intervalo_horas, cada_cuanto_dias) VALUES ($1, $2, $3, $4, $5)',
      [usuario_id, medicamento_id, cantidad_mg, intervalo_horas, cada_cuanto_dias]
    );

    res.status(201).send('Medicamento agregado con éxito');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar el medicamento');
  }
});

// Muestra los medicamentos
router.get('/medicamentos/:usuario_id', async (req, res) => {
  try {
    const usuario_id = req.params.usuario_id;

    // Consulta la base de datos para obtener los medicamentos del usuario
    const { rows } = await pool.query(
      'SELECT * FROM detalles_dosis WHERE usuario_id = $1',
      [usuario_id]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los medicamentos');
  }
});

// Actualiza medicamento
router.put('/medicamentos/:dosis_id', async (req, res) => {
  try {
    const dosis_id = req.params.dosis_id;
    const { cantidad_mg, intervalo_horas, cada_cuanto_dias } = req.body;

    // Realiza la actualización del medicamento en la base de datos
    await pool.query(
      'UPDATE detalles_dosis SET cantidad_mg = $1, intervalo_horas = $2, cada_cuanto_dias = $3 WHERE dosis_id = $4',
      [cantidad_mg, intervalo_horas, cada_cuanto_dias, dosis_id]
    );

    res.status(200).send('Medicamento actualizado con éxito');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar el medicamento');
  }
});

// Elimina medicamento
router.delete('/medicamentos/:dosis_id', async (req, res) => {
  try {
    const dosis_id = req.params.dosis_id;

    // Realiza la eliminación del medicamento en la base de datos
    await pool.query(
      'DELETE FROM detalles_dosis WHERE dosis_id = $1',
      [dosis_id]
    );

    res.status(204).send('Medicamento eliminado con éxito');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar el medicamento');
  }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Realiza la autenticación y responde adecuadamente
    if (email === 'usuario1@example.com' && password === 'contrasena1') {
      // Genera un token JWT
      const token = jwt.sign({ email }, process.env.SECRET_KEY);

      // Responde con el token
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Credenciales incorrectas' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
});

// Ruta para obtener todos los usuarios
router.get('/usuarios', async (req, res) => {
  try {
    // Consulta la base de datos para obtener todos los usuarios
    const { rows } = await pool.query('SELECT * FROM usuarios');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los usuarios');
  }
});

// Función para registrar un nuevo usuario
async function registrarUsuario(usuario) {
  const { nombre, correo, contrasena } = usuario;
  const hashedContrasena = await hashContrasena(contrasena);

  // Realizamos la inserción del usuario en la base de datos
  await pool.query(
    'INSERT INTO usuarios (nombre, correo, contrasena) VALUES ($1, $2, $3)',
    [nombre, correo, hashedContrasena]
  );
}

// Ruta para registrar un nuevo usuario
router.post('/registro', async (req, res) => {
  try {
    const usuario = req.body;

    // Llamada a la función para registrar usuario
    await registrarUsuario(usuario);

    res.status(200).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
