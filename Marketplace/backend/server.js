// backend/server.js
// Entry point — Express + Sequelize + SQLite
const app = require('./src/app');
const fs = require('fs');
const path = require('path');
const sequelize = require('./src/config/database'); 

const PORT = process.env.PORT || 3000;
const schemaPath = path.resolve(__dirname, 'schema.sql');

async function iniciarServidor() {
    try {
        console.log('⏳ Conectando ao banco de dados...');
        await sequelize.authenticate();

        // 1. Sincroniza os Models do Sequelize (Cria Pedidos, Carrinho, etc)
        await sequelize.sync();
        console.log('✅ Models do Sequelize sincronizados!');

        // 2. Lê e executa o schema.sql para criar as tabelas restantes (Categorias, Enderecos, etc)
        console.log('⏳ Lendo schema.sql para estruturar tabelas puras...');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // Remove comentários e divide as queries
        const queries = schema
            .replace(/--.*/g, '') 
            .split(';')
            .map(q => q.trim())
            .filter(q => q.length > 0);
        
        // Roda cada query individualmente para evitar o erro de database locked
        for (let query of queries) {
            await sequelize.query(query);
        }
        console.log('✅ Banco de dados 100% estruturado!');

        // 3. Inicia o servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor Marketplace rodando na porta ${PORT}!`);
            console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
        });

    } catch (error) {
        console.error('❌ Erro fatal ao iniciar o servidor:', error);
    }
}

iniciarServidor();