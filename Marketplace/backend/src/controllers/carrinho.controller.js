const Carrinho = require('../models/carrinho.model');

exports.adicionarAoCarrinho = async (req, res) => {
    const { cliente_id, produto_id, quantidade } = req.body;
    try {
        const [item, created] = await Carrinho.findOrCreate({
            where: { cliente_id, produto_id },
            defaults: { quantidade: quantidade || 1 }
        });

        if (!created) {
            item.quantidade += (quantidade || 1);
            await item.save();
        }
        res.status(201).json({ message: "Item adicionado ao carrinho!", item });
    } catch (error) {
        res.status(500).json({ error: "Erro ao adicionar ao carrinho", detalhe: error.message });
    }
};

exports.listarCarrinho = async (req, res) => {
    const { cliente_id } = req.params;
    try {
        const itens = await Carrinho.findAll({ where: { cliente_id } });
        res.status(200).json(itens);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar carrinho", detalhe: error.message });
    }
};

exports.removerDoCarrinho = async (req, res) => {
    const { id } = req.params;
    try {
        await Carrinho.destroy({ where: { id } });
        res.status(200).json({ message: "Item removido com sucesso." });
    } catch (error) {
        res.status(500).json({ error: "Erro ao remover item", detalhe: error.message });
    }
};