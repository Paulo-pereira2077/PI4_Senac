const crypto = require('crypto');
const { QueryTypes } = require('sequelize');
const sequelize = require('../config/database');

// Armazena códigos temporários de uso único (validade de 60 segundos)
const codigosTemporarios = new Map();

// 1. Gera um código temporário para o app abrir o dashboard sem expor o JWT
exports.gerarCodigoAcesso = (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ erro: 'Token não fornecido.' });
    }

    const codigo = crypto.randomBytes(16).toString('hex');
    codigosTemporarios.set(codigo, {
      token,
      expiraEm: Date.now() + 60 * 1000, // 60 segundos
    });

    return res.json({ codigo });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao gerar código de acesso', detalhes: error.message });
  }
};

// 2. Troca o código temporário pelo JWT (uso único)
exports.trocarCodigo = (req, res) => {
  try {
    const { codigo } = req.body;
    const registro = codigosTemporarios.get(codigo);

    if (!registro || Date.now() > registro.expiraEm) {
      codigosTemporarios.delete(codigo);
      return res.status(401).json({ erro: 'Código inválido ou expirado.' });
    }

    codigosTemporarios.delete(codigo);
    return res.json({ token: registro.token });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao validar código', detalhes: error.message });
  }
};

// 3. Métricas consolidadas do vendedor logado
exports.obterMetricas = async (req, res) => {
  try {
    const isAdmin = String(req.usuario.tipo_perfil || '').toLowerCase() === 'admin';
    const vendedorId = req.usuario.id;
    const filtroVendedor = isAdmin ? '' : 'AND pr.vendedor_id = :vendedorId';
    const filtroProdutos = isAdmin ? '' : 'AND vendedor_id = :vendedorId';
    const replacements = isAdmin ? {} : { vendedorId };

    const [resumo] = await sequelize.query(`
      SELECT 
        COUNT(DISTINCT p.id) AS total_pedidos,
        COALESCE(SUM(ip.quantidade * ip.preco_uni), 0) AS faturamento_total,
        COALESCE(SUM(ip.quantidade * ip.preco_uni) / NULLIF(COUNT(DISTINCT p.id), 0), 0) AS ticket_medio
      FROM pedidos p
      JOIN itens_pedido ip ON ip.pedido_id = p.id
      JOIN produtos pr ON pr.id = ip.produto_id
      WHERE p.status != 'Cancelado' ${filtroVendedor}
    `, { type: QueryTypes.SELECT, replacements });

    const topProdutos = await sequelize.query(`
      SELECT 
        pr.nome,
        SUM(ip.quantidade) AS total_vendido,
        SUM(ip.quantidade * ip.preco_uni) AS receita
      FROM itens_pedido ip
      JOIN produtos pr ON pr.id = ip.produto_id
      WHERE 1=1 ${filtroVendedor}
      GROUP BY pr.id, pr.nome
      ORDER BY total_vendido DESC
      LIMIT 5
    `, { type: QueryTypes.SELECT, replacements });

    const [produtosAtivos] = await sequelize.query(`
      SELECT COUNT(id) AS total_produtos_ativos
      FROM produtos
      WHERE ativo = 1 ${filtroProdutos}
    `, { type: QueryTypes.SELECT, replacements });

    return res.json({ resumo, topProdutos, produtosAtivos });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao consultar métricas', detalhes: error.message });
  }
};

// 4. Dados detalhados do vendedor logado (JSON ou CSV)
exports.exportarDados = async (req, res) => {
  try {
    const formato = (req.query.formato || 'json').toLowerCase();
    const isAdmin = String(req.usuario.tipo_perfil || '').toLowerCase() === 'admin';
    const filtroVendedor = isAdmin ? '' : 'WHERE pr.vendedor_id = :vendedorId';
    const replacements = isAdmin ? {} : { vendedorId: req.usuario.id };

    const dados = await sequelize.query(`
      SELECT 
        p.id AS pedido_id,
        p.createdAt AS data_pedido,
        p.status,
        COALESCE(p.metodo_pagamento, 'Não informado') AS metodo_pagamento,
        u.nome AS cliente,
        pr.nome AS produto,
        ip.quantidade,
        ip.preco_uni,
        (ip.quantidade * ip.preco_uni) AS subtotal_item
      FROM pedidos p
      JOIN usuarios u ON u.id = p.cliente_id
      JOIN itens_pedido ip ON ip.pedido_id = p.id
      JOIN produtos pr ON pr.id = ip.produto_id
      ${filtroVendedor}
      ORDER BY p.createdAt DESC
    `, { type: QueryTypes.SELECT, replacements });

    if (formato === 'csv') {
      if (!dados.length) {
        return res.status(200).send('Sem dados para exportar');
      }
      const cabecalho = Object.keys(dados[0]).join(',');
      const linhas = dados.map((row) =>
        Object.values(row)
          .map((val) => `"${String(val ?? '').replace(/"/g, '""')}"`)
          .join(',')
      );
      const csv = [cabecalho, ...linhas].join('\n');

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="relatorio_vendas.csv"');
      return res.send(csv);
    }

    res.setHeader('Content-Type', 'application/json');
    return res.json(dados);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao exportar dados', detalhes: error.message });
  }
};