const { Pool } = require('pg');
require('dotenv').config();

// En Railway se inyecta DATABASE_URL automáticamente.
// En desarrollo local se usan las variables individuales del .env.
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      allowExitOnIdle: true,
    })
  : new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      allowExitOnIdle: true,
    });

module.exports = pool;
