// backend/src/controllers/produto.controller.js
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const Produto = require('../models/produtos.model');
const Avaliacao = require('../models/avaliacao.model');

const IMAGEM_PADRAO = '/uploads/produtos/produto-padrao.jpg';

const removerImagemAntiga = (imagemUrl) => {
  if (!imagemUrl || imagemUrl === IMAGEM_PADRAO) return;

  const caminhoRelativo = imagemUrl.startsWith('/') ? imagemUrl.slice(1) : imagemUrl;
  const caminhoCompleto = path.resolve(__dirname, '..', '..', caminhoRelativo);

  fs.unlink(caminhoCompleto, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error('Erro ao remover imagem antiga:', err.message);
    }
  });
};

const anexarAvaliacoes = async (produtos) => {
  if (!Array.isArray(produtos) || produtos.length === 0) return [];

  const ids = produtos.map((p) => p.id);
  const avaliacoes = await Avaliacao.findAll({
    where: { produto_id: { [Op.in]: ids } },
  });

  const mapaResumo = new Map();
  for (const av of avaliacoes) {
    const pid = Number(av.produto_id);
    const atual = mapaResumo.get(pid) || { soma: 0, total: 0 };
    atual.soma += Number(av.nota || 0);
    atual.total += 1;
    mapaResumo.set(pid, atual);
  }

  return produtos.map((produto) => {
    const dados = typeof produto.toJSON === 'function' ? produto.toJSON() : produto;
    const resumo = mapaResumo.get(Number(dados.id));
    const totalAvaliacoes = resumo ? resumo.total : 0;
    const mediaAvaliacao =
      totalAvaliacoes > 0 ? Number((resumo.soma / totalAvaliacoes).toFixed(1)) : 0;

    return {
      ...dados,
      media_avaliacao: mediaAvaliacao,
      total_avaliacoes: totalAvaliacoes,
    };
  });
};

const getAll = async (req, res) => {
  try {
    const { categoria, busca } = req.query;
    const where = {};

    if (categoria && categoria !== 'Todas') {
      where.categoria = categoria;
    }

    if (busca && String(busca).trim()) {
      const termo = `%${String(busca).trim()}%`;
      where[Op.or] = [
        { nome: { [Op.like]: termo } },
        { descricao: { [Op.like]: termo } },
        { categoria: { [Op.like]: termo } },
      ];
    }

    const produtos = await Produto.findAll({ where });
    const produtosComAvaliacoes = await anexarAvaliacoes(produtos);
    res.status(200).json(produtosComAvaliacoes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await Produto.findByPk(id);

    if (!produto) {
      return res.status(404).json({ message: 'Not Found' });
    }

    const [produtoComAvaliacao] = await anexarAvaliacoes([produto]);
    res.status(200).json(produtoComAvaliacao);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const dadosProduto = { ...req.body };

    if (req.file) {
      dadosProduto.imagem_url = `/uploads/produtos/${req.file.filename}`;
    }

    const produto = await Produto.create(dadosProduto);
    res.status(201).json(produto);
  } catch (error) {
    if (req.file) {
      removerImagemAntiga(`/uploads/produtos/${req.file.filename}`);
    }
    res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const produtoExistente = await Produto.findByPk(id);

    if (!produtoExistente) {
      if (req.file) {
        removerImagemAntiga(`/uploads/produtos/${req.file.filename}`);
      }
      return res.status(404).json({ message: 'Not Found' });
    }

    const dadosAtualizados = { ...req.body };

    if (req.file) {
      dadosAtualizados.imagem_url = `/uploads/produtos/${req.file.filename}`;
      removerImagemAntiga(produtoExistente.imagem_url);
    }

    await produtoExistente.update(dadosAtualizados);

    res.status(200).json(produtoExistente);
  } catch (error) {
    if (req.file) {
      removerImagemAntiga(`/uploads/produtos/${req.file.filename}`);
    }
    return res.status(500).json({ message: error.message });
  }
};

const deleteProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await Produto.findByPk(id);

    if (!produto) {
      return res.status(404).json({ message: 'Not Found' });
    }

    const imagemParaApagar = produto.imagem_url;

    await produto.destroy();

    removerImagemAntiga(imagemParaApagar);

    res.status(200).json({ message: 'Produto deletado com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getByVendedor = async (req, res) => {
  try {
    const { vendedorId } = req.params;
    const produtos = await Produto.findAll({
      where: { vendedor_id: vendedorId },
    });
    const produtosComAvaliacoes = await anexarAvaliacoes(produtos);
    res.status(200).json(produtosComAvaliacoes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteProduto,
  getByVendedor,
};