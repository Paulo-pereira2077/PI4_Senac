const jwt = require('jsonwebtoken');

exports.verificarToken = (req, res, next) => {
    // O token é normalmente enviado no formato: "Bearer eyJhbG..."
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Acesso negado. Token não fornecido." });
    }

    try {
        // Valida e decodifica o token usando a sua chave secreta
        // (Certifique-se de que a mesma chave é usada no momento do login)
        const JWT_SECRET = process.env.JWT_SECRET || 'secredo_provisorio_123';
        const decodificado = jwt.verify(token, JWT_SECRET);
        
        // Ponto chave: Guardamos os dados do utilizador na requisição (req)
        // para que os próximos middlewares e o controller saibam quem fez a chamada.
        req.usuario = decodificado;
        
        // Tudo certo, passa para a próxima barreira!
        next(); 
    } catch (error) {
        return res.status(403).json({ error: "Sessão inválida ou expirada." });
    }
};