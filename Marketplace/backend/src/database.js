const { Pool } = require('pg');
require('dotenv').config();

// Conecta ao Neon.tech usando o link do .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Obrigatório para conexões seguras na nuvem
});

module.exports = {
  // Simula o db.run do SQLite (usado para INSERT, UPDATE, DELETE)
  run: (sql, params, callback) => {
    pool.query(sql, params, (err, res) => {
      if (err) return callback(err, null);
      // No Postgres, precisamos capturar o ID devolvido pela query
      const id = res.rows && res.rows.length > 0 ? res.rows[0].id : null;
      callback(null, id);
    });
  },
  
  // Simula o db.all do SQLite (usado para SELECT com vários resultados)
  all: (sql, params, callback) => {
    pool.query(sql, params, (err, res) => {
      callback(err, res ? res.rows : []);
    });
  },
  
  // Simula o db.get do SQLite (usado para SELECT de 1 resultado só)
  get: (sql, params, callback) => {
    pool.query(sql, params, (err, res) => {
      callback(err, res && res.rows.length > 0 ? res.rows[0] : null);
    });
  }
};