const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { Resend } = require('resend');
require('dotenv').config();
const router = express.Router();
const pool = require('../db/conexion');

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

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
      [email.toLowerCase()]
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

    const emailNormalizado = correo_electronico.toLowerCase();

    const existing = await pool.query(
      'SELECT usuario_id FROM usuarios WHERE correo_electronico = $1',
      [emailNormalizado]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }

    const hashedContrasena = await bcrypt.hash(contrasena, 10);

    await pool.query(
      'INSERT INTO usuarios (nombre, correo_electronico, contrasena) VALUES ($1, $2, $3)',
      [nombre, emailNormalizado, hashedContrasena]
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
              dd.cantidad_mg, dd.intervalo_horas, dd.cada_cuanto_dias,
              dd.hora_inicio
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
    const { usuario_id, medicamento_id, cantidad_mg, intervalo_horas, cada_cuanto_dias, hora_inicio } = req.body;

    if (!usuario_id || !medicamento_id || !cantidad_mg || !intervalo_horas) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    await pool.query(
      `INSERT INTO detalles_dosis
         (usuario_id, medicamento_id, cantidad_mg, intervalo_horas, cada_cuanto_dias, hora_inicio)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [usuario_id, medicamento_id, cantidad_mg, intervalo_horas, cada_cuanto_dias, hora_inicio || null]
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
    const { medicamento_id, cantidad_mg, intervalo_horas, cada_cuanto_dias, hora_inicio } = req.body;

    await pool.query(
      `UPDATE detalles_dosis
       SET medicamento_id = COALESCE($1, medicamento_id),
           cantidad_mg = $2, intervalo_horas = $3, cada_cuanto_dias = $4,
           hora_inicio = $5
       WHERE dosis_id = $6`,
      [medicamento_id || null, cantidad_mg, intervalo_horas, cada_cuanto_dias, hora_inicio || null, dosis_id]
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

// Agregar medicamento al catálogo (crea si no existe, retorna existente si ya está)
router.post('/catalogo-medicamentos', verifyToken, async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre || !nombre.trim()) return res.status(400).json({ error: 'Nombre requerido' });

    const existing = await pool.query(
      'SELECT medicamento_id FROM medicamentos WHERE LOWER(nombre) = LOWER($1)',
      [nombre.trim()]
    );
    if (existing.rows.length > 0) return res.json(existing.rows[0]);

    const { rows } = await pool.query(
      'INSERT INTO medicamentos (nombre) VALUES ($1) RETURNING medicamento_id',
      [nombre.trim()]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar al catálogo' });
  }
});

// Recuperar contraseña — genera token y envía email
router.post('/recuperar-contrasena', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email requerido' });

    const { rows } = await pool.query(
      'SELECT usuario_id FROM usuarios WHERE correo_electronico = $1',
      [email.toLowerCase()]
    );

    // Respuesta genérica siempre para no revelar si el email existe
    if (rows.length === 0) return res.json({ message: 'Si el correo existe, recibirás el enlace.' });

    const token = crypto.randomBytes(32).toString('hex');
    const expira = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await pool.query(
      `INSERT INTO reset_tokens (usuario_id, token, expira_en)
       VALUES ($1, $2, $3)
       ON CONFLICT (usuario_id) DO UPDATE SET token = $2, expira_en = $3`,
      [rows[0].usuario_id, token, expira]
    );

    const enlace = `${CLIENT_URL}/restablecer-contrasena?token=${token}`;

    await getResend().emails.send({
      from: 'MiDosis <onboarding@resend.dev>',
      to: email.toLowerCase(),
      subject: 'Recupera tu contraseña — MiDosis',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto">
          <h2>Recuperar contraseña</h2>
          <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en MiDosis.</p>
          <p>Haz click en el botón para crear una nueva contraseña. El enlace es válido por <strong>1 hora</strong>.</p>
          <a href="${enlace}"
             style="display:inline-block;padding:12px 24px;background:#0d6efd;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold">
            Restablecer contraseña
          </a>
          <p style="margin-top:24px;color:#666;font-size:13px">
            Si no solicitaste este cambio, ignora este correo. Tu contraseña no cambiará.
          </p>
        </div>
      `,
    });

    res.json({ message: 'Si el correo existe, recibirás el enlace.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Restablecer contraseña — valida token y actualiza
router.post('/restablecer-contrasena', async (req, res) => {
  try {
    const { token, contrasena } = req.body;

    if (!token || !contrasena) return res.status(400).json({ error: 'Datos incompletos' });
    if (contrasena.length < 6) return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });

    const { rows } = await pool.query(
      'SELECT usuario_id, expira_en FROM reset_tokens WHERE token = $1',
      [token]
    );

    if (rows.length === 0) return res.status(400).json({ error: 'Token inválido o expirado' });

    if (new Date() > new Date(rows[0].expira_en)) {
      await pool.query('DELETE FROM reset_tokens WHERE token = $1', [token]);
      return res.status(400).json({ error: 'El enlace ha expirado. Solicita uno nuevo.' });
    }

    const hashedContrasena = await bcrypt.hash(contrasena, 10);

    await pool.query(
      'UPDATE usuarios SET contrasena = $1 WHERE usuario_id = $2',
      [hashedContrasena, rows[0].usuario_id]
    );

    await pool.query('DELETE FROM reset_tokens WHERE token = $1', [token]);

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
