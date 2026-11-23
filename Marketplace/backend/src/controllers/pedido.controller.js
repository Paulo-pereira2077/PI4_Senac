// backend/src/controllers/pedido.controller.js
const sequelize = require('../config/database');
const Pedido = require('../models/pedidos.model');
const ItemPedido = require('../models/itens_pedido.model');

exports.finalizarCompra = async (req, res) => {
    const cliente_id = req.body.cliente_id || req.usuario?.id;
    const { endereco_entrega_id, total, metodo_pagamento, itens } = req.body;

    if (!cliente_id || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({ error: "Dados incompletos para finalizar o pedido." });
    }

    const t = await sequelize.transaction();

    try {
        const novoPedido = await Pedido.create(
            {
                cliente_id,
                endereco_entrega_id: endereco_entrega_id ?? null,
                total: Number(total) || 0,
                metodo_pagamento: metodo_pagamento || 'Cartão de Crédito',
                status: 'Aprovado',
            },
            { transaction: t }
        );

        const itensParaInserir = itens.map((item) => ({
            pedido_id: novoPedido.id,
            produto_id: item.produto_id,
            quantidade: Number(item.quantidade) || 1,
            preco_uni: Number(item.preco_unidade ?? item.preco_uni) || 0,
        }));

        await ItemPedido.bulkCreate(itensParaInserir, { transaction: t });
        await t.commit();

        res.status(201).json({
            message: "Compra finalizada com sucesso!",
            pedido_id: novoPedido.id,
        });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: "Erro ao processar o pedido.", detalhe: error.message });
    }
};

exports.historicoDoCliente = async (req, res) => {
    const cliente_id = req.params.cliente_id || req.usuario?.id;
    try {
        const pedidos = await Pedido.findAll({
            where: { cliente_id },
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar histórico.", detalhe: error.message });
    }
};