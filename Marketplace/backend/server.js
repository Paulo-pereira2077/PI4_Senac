// backend/server.js
// Entry point — Express + Sequelize + SQLite
const app = require('./src/app');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Como vimos no seu log, a sua configuração do Sequelize está na pasta config
const sequelize = require('./src/config/database'); 

const PORT = process.env.PORT || 3000;

// 1. Caminhos para o banco de dados e para o schema.sql
const dbPath = path.resolve(__dirname, 'marketplace.db');
const schemaPath = path.resolve(__dirname, 'schema.sql');

console.log('⏳ A estruturar as 11 tabelas a partir do schema.sql...');

// 2. Abre o SQLite para rodar o schema completo
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) return console.error('Erro ao conectar ao SQLite:', err.message);

    // Lê o ficheiro com as 11 tabelas
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Executa tudo de uma vez
    db.exec(schema, (err) => {
        if (err) {
            console.error('Erro ao executar schema.sql:', err.message);
        } else {
            console.log('✅ As 11 tabelas foram verificadas/criadas com sucesso!');
        }
        
        // 3. FECHA a conexão do SQLite para não bloquear o Sequelize (SQLITE_BUSY)
        db.close((errClose) => {
            if (errClose) console.error('Erro ao fechar SQLite:', errClose);
            
            // 4. Agora sim, chama o Sequelize para sincronizar os Models
            sequelize.sync().then(() => {
                console.log('✅ Banco de dados Sequelize sincronizado!');
                
                // 5. Liga o servidor
                app.listen(PORT, () => {
                    console.log(`🚀 Servidor Marketplace rodando na porta ${PORT}!`);
                    console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
                });
            }).catch(e => console.error('Erro no Sequelize:', e));
        });
    });
});