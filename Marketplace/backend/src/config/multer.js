const multer = require('multer');
const path = require('path');
const fs = require('fs');

const pastaProdutos = path.resolve(__dirname, '..', '..', 'uploads', 'produtos');

// Cria a pasta backend/uploads/produtos automaticamente se ela não existir
if (!fs.existsSync(pastaProdutos)) {
    fs.mkdirSync(pastaProdutos, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, pastaProdutos);
    },
    filename: (req, file, cb) => {
        const sufixoUnico = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const extensao = path.extname(file.originalname);
        cb(null, `produto-${sufixoUnico}${extensao}`);
    }
});

module.exports = multer({ storage });