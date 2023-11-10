const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const router = express.Router();
const pool = require('../db/conexion');

/* router.use('/', (req, res) => {
    res.send('Hola mundo en Express');
}); */

//Agrega medicamento
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
//Muestra los medicamentos
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
//Actualiza medicamento
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
//Elimina medicamento
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
        // Verifica las credenciales (puedes utilizar una función como verificarCredenciales)
        await verificarCredenciales(email, password);
  
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
  
module.exports = router