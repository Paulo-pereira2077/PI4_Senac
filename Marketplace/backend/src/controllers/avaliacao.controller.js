// backend/src/controllers/avaliacao.controller.js
const Avaliacao = require('../models/avaliacao.model');
const Usuario = require('../models/usuarios.model');

exports.listarPorProduto = async (req, res) => {
  try {
    const produto_id = Number(req.params.produtoId);
    if (!produto_id) {
      return res.status(400).json({ error: 'ID do produto inválido.' });
    }

    const avaliacoes = await Avaliacao.findAll({
      where: { produto_id },
      order: [['updatedAt', 'DESC']],
    });

    const totalAvaliacoes = avaliacoes.length;
    const mediaNota =
      totalAvaliacoes > 0
        ? Number(
            (
              avaliacoes.reduce((acc, item) => acc + Number(item.nota || 0), 0) /
              totalAvaliacoes
            ).toFixed(1)
          )
        : 0;

    return res.status(200).json({
      media: mediaNota,
      total: totalAvaliacoes,
      avaliacoes,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Erro ao buscar avaliações do produto.',
      detalhe: error.message,
    });
  }
};

exports.salvarAvaliacao = async (req, res) => {
  try {
    const produto_id = Number(req.body.produto_id);
    const usuario_id = Number(req.body.usuario_id || req.usuario?.id);
    const nota = Number(req.body.nota);
    const comentario = String(req.body.comentario || '').trim();

    if (!produto_id || !usuario_id) {
      return res
        .status(400)
        .json({ error: 'Produto e usuário são obrigatórios para avaliar.' });
    }

    if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
      return res.status(400).json({ error: 'A nota deve ser um inteiro de 1 a 5.' });
    }

    let autorNome = req.body.autor_nome;
    if (!autorNome) {
      const usuario = await Usuario.findByPk(usuario_id);
      autorNome = usuario?.nome || 'Cliente';
    }

    const existente = await Avaliacao.findOne({
      where: { produto_id, usuario_id },
    });

    if (existente) {
      existente.nota = nota;
      existente.comentario = comentario;
      existente.autor_nome = autorNome;
      await existente.save();
      return res.status(200).json({
        message: 'Avaliação atualizada com sucesso!',
        avaliacao: existente,
      });
    }

    const criada = await Avaliacao.create({
      produto_id,
      usuario_id,
      autor_nome: autorNome,
      nota,
      comentario,
    });

    return res.status(201).json({
      message: 'Avaliação registrada com sucesso!',
      avaliacao: criada,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Erro ao salvar avaliação.',
      detalhe: error.message,
    });
  }
};  