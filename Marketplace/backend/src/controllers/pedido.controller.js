// backend/src/controllers/pedido.controller.js
const sequelize = require('../config/database'); // Caminho corrigido!
const Pedido = require('../models/pedidos.model');
const ItemPedido = require('../models/itens_pedido.model');

exports.finalizarCompra = async (req, res) => {
    const { cliente_id, endereco_entrega_id, total, metodo_pagamento, itens } = req.body;

    if (!cliente_id || !itens || itens.length === 0) {
        return res.status(400).json({ error: "Dados incompletos para finalizar o pedido." });
    }

    const t = await sequelize.transaction();

    try {
        const novoPedido = await Pedido.create({
            cliente_id, endereco_entrega_id, total, metodo_pagamento, status: 'Aprovado'
        }, { transaction: t });

        const itensParaInserir = itens.map(item => ({
            pedido_id: novoPedido.id,
            produto_id: item.produto_id,
            quantidade: item.quantidade,
            preco_uni: item.preco_unidade
        }));

        await ItemPedido.bulkCreate(itensParaInserir, { transaction: t });
        await t.commit(); 

        res.status(201).json({ message: "Compra finalizada com sucesso!", pedido_id: novoPedido.id });
    } catch (error) {
        await t.rollback(); 
        res.status(500).json({ error: "Erro ao processar o pedido.", detalhe: error.message });
    }
};

exports.historicoDoCliente = async (req, res) => {
    const { cliente_id } = req.params;
    try {
        const pedidos = await Pedido.findAll({
            where: { cliente_id },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar histórico.", detalhe: error.message });
    }
};