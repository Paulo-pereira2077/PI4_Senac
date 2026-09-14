// backend/src/repositories/userRepository.js
const db = require('../database');

const createUser = (nome, email, senha_hash, tipo_perfil) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO usuarios (nome, email, senha_hash, tipo_perfil) VALUES (?, ?, ?, ?)`;
    db.run(sql, [nome, email, senha_hash, tipo_perfil], function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, nome, email, tipo_perfil });
    });
  });
};

const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM usuarios WHERE email = ?`, [email], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

module.exports = { createUser, findUserByEmail };