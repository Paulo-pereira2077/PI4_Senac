const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar com o banco de dados:', err.message);
  } else {
<<<<<<< Updated upstream
    console.log('Conectado ao banco de dados SQLite.');
=======
    console.log('Conectado ao SQLite. Inicializando tabelas...');
    db.run(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        cpf TEXT,
        email TEXT UNIQUE NOT NULL,
        senha_hash TEXT NOT NULL,
        tipo_perfil TEXT NOT NULL
      )
    `);
>>>>>>> Stashed changes
  }
});

module.exports = db;
