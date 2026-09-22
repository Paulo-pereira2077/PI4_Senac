// backend/src/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../marketplace.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao SQLite:', err.message);
  } else {
<<<<<<< HEAD
=======
<<<<<<< Updated upstream
    console.log('Conectado ao banco de dados SQLite.');
=======
>>>>>>> 90012446721ba69795c9a13f7d23bb8afcfc02a8
    console.log('Conectado ao SQLite. Inicializando tabelas...');
    db.run(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
<<<<<<< HEAD
=======
        cpf TEXT,
>>>>>>> 90012446721ba69795c9a13f7d23bb8afcfc02a8
        email TEXT UNIQUE NOT NULL,
        senha_hash TEXT NOT NULL,
        tipo_perfil TEXT NOT NULL
      )
    `);
<<<<<<< HEAD
=======
>>>>>>> Stashed changes
>>>>>>> 90012446721ba69795c9a13f7d23bb8afcfc02a8
  }
});

module.exports = db;