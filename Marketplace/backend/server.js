// backend/server.js
// Entry point — Express + Sequelize + SQLite
const app = require('./src/app');
const fs = require('fs');
const path = require('path');

// Importa a sua conexão do Sequelize
const sequelize = require('./src/config/database'); 

const PORT = process.env.PORT || 3000;
const schemaPath = path.resolve(__dirname, 'schema.sql');

async function iniciarServidor() {
    try {
        console.log('⏳ Conectando ao banco de dados...');
        await sequelize.authenticate();
        console.log('✅ Conexão com o banco estabelecida.');

        console.log('⏳ Estruturando as 11 tabelas a partir do schema.sql...');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // O Sequelize prefere rodar uma instrução de cada vez no SQLite. 
        // Vamos separar o arquivo pelos pontos e vírgulas e executar num loop seguro.
        const queries = schema.split(';').filter(query => query.trim() !== '');
        
        for (let query of queries) {
            await sequelize.query(query);
        }
        console.log('✅ As 11 tabelas foram verificadas/criadas com sucesso!');

        // Sincroniza os Models do Sequelize pacificamente
        await sequelize.sync();
        console.log('✅ Models do Sequelize sincronizados!');

        // Liga a ignição do servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor Marketplace rodando na porta ${PORT}!`);
            console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
        });

    } catch (error) {
        console.error('❌ Erro fatal ao iniciar o servidor:', error);
    }
}

iniciarServidor();