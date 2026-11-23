// Este middleware exige que o token JWT já tenha sido decodificado
// por um middleware de autenticação anterior (que coloca os dados em req.usuario)

exports.autorizarPerfis = (perfisPermitidos) => {
  return (req, res, next) => {
    // O `req.usuario` foi injetado pelo `auth.middleware` no passo anterior
    const usuario = req.usuario;

    if (!usuario) {
      return res.status(401).json({ error: 'Utilizador não identificado no sistema.' });
    }

    const perfilUsuario = String(usuario.tipo_perfil || '').trim().toLowerCase();
    const perfisNormalizados = perfisPermitidos.map((p) =>
      String(p).trim().toLowerCase()
    );

    // Verifica se o 'tipo_perfil' do token está dentro do array de perfis permitidos (ignorando maiúsculas/minúsculas)
    if (!perfisNormalizados.includes(perfilUsuario)) {
      return res.status(403).json({
        error: `Acesso negado. O seu perfil (${usuario.tipo_perfil || 'indefinido'}) não tem permissão para esta ação.`,
      });
    }

    // Tem permissão, deixa passar para o Controller final
    next();
  };
};