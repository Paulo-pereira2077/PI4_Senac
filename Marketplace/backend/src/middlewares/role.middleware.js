exports.autorizarPerfis = (perfisPermitidos) => {
    return (req, res, next) => {
        // O `req.usuario` foi injetado pelo `auth.middleware` no passo anterior
        const usuario = req.usuario; 

        if (!usuario) {
            return res.status(401).json({ error: "Utilizador não identificado no sistema." });
        }

        // Verifica se o 'tipo_perfil' do token está dentro do array de perfis permitidos
        if (!perfisPermitidos.includes(usuario.tipo_perfil)) {
            return res.status(403).json({ 
                error: "Acesso negado. O seu perfil não tem permissão para esta ação." 
            });
        }
        
        // Tem permissão, deixa passar para o Controller final
        next();
    };
};