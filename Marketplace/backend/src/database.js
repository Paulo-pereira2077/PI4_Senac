// backend/src/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Define o caminho para o ficheiro do banco de dados na raiz da pasta backend
const dbPath = path.resolve(__dirname, '..', 'marketplace.db');

// Cria a conexão com o banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
        return;
    } 
    
    console.log('Conectado ao banco de dados SQLite com sucesso.');

    // Lê o ficheiro schema.sql
    const schemaPath = path.resolve(__dirname, '..', 'schema.sql');
    
    try {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // O comando exec() roda múltiplas instruções SQL de uma só vez
        db.exec(schema, (err) => {
            if (err) {
                console.error('Erro ao criar as tabelas do schema:', err.message);
            } else {
                console.log('Tabelas do banco de dados verificadas e prontas a usar!');
            }
        });
    } catch (readError) {
        console.error('Erro ao ler o ficheiro schema.sql:', readError.message);
    }
});

// Exporta a conexão padrão para ser usada nos controllers de SQL Puro (Usuários/Produtos/Carrinho)
module.exports = db;