// backend/src/controllers/carrinho.controller.js
const Carrinho = require('../models/carrinho.model');
const Produto = require('../models/produtos.model');

exports.adicionarAoCarrinho = async (req, res) => {
  const { cliente_id, produto_id, quantidade } = req.body;
  const qtdSolicitada = Number(quantidade) || 1;

  try {
    const produto = await Produto.findByPk(produto_id);
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    if (!produto.ativo) {
      return res.status(400).json({ error: 'Este produto não está disponível no momento.' });
    }

    if (qtdSolicitada < 1) {
      return res.status(400).json({ error: 'Quantidade inválida.' });
    }

    const itemExistente = await Carrinho.findOne({
      where: { cliente_id, produto_id },
    });

    const quantidadeTotal = (itemExistente ? itemExistente.quantidade : 0) + qtdSolicitada;

    if (quantidadeTotal > produto.estoque) {
      return res.status(400).json({
        error: `Estoque insuficiente. Disponível: ${produto.estoque} unidade(s).`,
      });
    }

    if (itemExistente) {
      itemExistente.quantidade = quantidadeTotal;
      await itemExistente.save();
      return res.status(200).json({ message: 'Quantidade atualizada no carrinho!', item: itemExistente });
    }

    const novoItem = await Carrinho.create({
      cliente_id,
      produto_id,
      quantidade: qtdSolicitada,
    });

    res.status(201).json({ message: 'Item adicionado ao carrinho!', item: novoItem });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar ao carrinho', detalhe: error.message });
  }
};

exports.atualizarQuantidade = async (req, res) => {
  const { id } = req.params;
  const novaQuantidade = Number(req.body.quantidade);

  try {
    if (!Number.isInteger(novaQuantidade) || novaQuantidade < 1) {
      return res.status(400).json({ error: 'Quantidade deve ser pelo menos 1.' });
    }

    const item = await Carrinho.findByPk(id);
    if (!item) {
      return res.status(404).json({ error: 'Item do carrinho não encontrado.' });
    }

    const produto = await Produto.findByPk(item.produto_id);
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    if (novaQuantidade > produto.estoque) {
      return res.status(400).json({
        error: `Estoque máximo disponível: ${produto.estoque} unidade(s).`,
      });
    }

    item.quantidade = novaQuantidade;
    await item.save();

    return res.status(200).json({ message: 'Quantidade atualizada!', item });
  } catch (error) {
    return res.status(500).json({
      error: 'Erro ao atualizar quantidade.',
      detalhe: error.message,
    });
  }
};

exports.listarCarrinho = async (req, res) => {
  const { cliente_id } = req.params;
  try {
    const itens = await Carrinho.findAll({ where: { cliente_id } });
    res.status(200).json(itens);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar carrinho', detalhe: error.message });
  }
};

exports.removerDoCarrinho = async (req, res) => {
  const { id } = req.params;
  try {
    await Carrinho.destroy({ where: { id } });
    res.status(200).json({ message: 'Item removido com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover item', detalhe: error.message });
  }
};