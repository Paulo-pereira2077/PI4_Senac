// backend/src/controllers/pedido.controller.js
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const Pedido = require('../models/pedidos.model');
const ItemPedido = require('../models/itens_pedido.model');
const Produto = require('../models/produtos.model');
const Usuario = require('../models/usuarios.model');
const { Payment } = require('mercadopago');
const client = require('../config/mercadopago');

const STATUS_VALIDOS = [
    'Pendente',
    'Aprovado',
    'Em separação',
    'Enviado',
    'Entregue',
    'Cancelado',
    'Recusado',
];

const STATUS_SEM_ESTOQUE = ['Cancelado', 'Recusado'];

const mapearStatusMP = (statusMP) => {
    if (statusMP === 'approved') return 'Aprovado';
    if (statusMP === 'rejected' || statusMP === 'cancelled') return 'Recusado';
    return 'Pendente';
};

const devolverEstoqueDoPedido = async (pedidoId, transaction) => {
    const itens = await ItemPedido.findAll({
        where: { pedido_id: pedidoId },
        transaction,
    });

    for (const item of itens) {
        const produto = await Produto.findByPk(item.produto_id, { transaction });
        if (produto) {
            produto.estoque = (Number(produto.estoque) || 0) + Number(item.quantidade);
            await produto.save({ transaction });
        }
    }
};

exports.finalizarCompra = async (req, res) => {
    const cliente_id = req.body.cliente_id || req.usuario?.id;
    const { endereco_entrega_id, total, metodo_pagamento, itens } = req.body;

    if (!cliente_id || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({ error: "Dados incompletos para finalizar o pedido." });
    }

    const t = await sequelize.transaction();

    try {
        // 1. Valida e desconta o estoque de cada item
        for (const item of itens) {
            const qtd = Number(item.quantidade) || 1;
            const produto = await Produto.findByPk(item.produto_id, { transaction: t });

            if (!produto) {
                await t.rollback();
                return res.status(404).json({ error: `Produto #${item.produto_id} não encontrado.` });
            }

            if (produto.estoque < qtd) {
                await t.rollback();
                return res.status(400).json({
                    error: `Estoque insuficiente para "${produto.nome}". Disponível: ${produto.estoque}.`,
                });
            }

            produto.estoque -= qtd;
            await produto.save({ transaction: t });
        }

        // 2. Cria o pedido
        const novoPedido = await Pedido.create(
            {
                cliente_id,
                endereco_entrega_id: endereco_entrega_id ?? null,
                total: Number(total) || 0,
                metodo_pagamento: metodo_pagamento || 'Mercado Pago',
                status: 'Pendente',
            },
            { transaction: t }
        );

        // 3. Insere os itens do pedido
        const itensParaInserir = itens.map((item) => ({
            pedido_id: novoPedido.id,
            produto_id: item.produto_id,
            quantidade: Number(item.quantidade) || 1,
            preco_uni: Number(item.preco_unidade ?? item.preco_uni) || 0,
        }));

        await ItemPedido.bulkCreate(itensParaInserir, { transaction: t });
        await t.commit();

        res.status(201).json({
            message: "Pedido criado! Aguardando pagamento.",
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

        // Sincroniza pedidos pendentes diretamente com a API do Mercado Pago
        const payment = new Payment(client);
        await Promise.all(
            pedidos
                .filter((p) => p.status === 'Pendente')
                .map(async (pedido) => {
                    try {
                        const busca = await payment.search({
                            options: {
                                external_reference: String(pedido.id),
                            },
                        });

                        const resultados = busca?.results || [];
                        if (resultados.length > 0) {
                            const aprovado = resultados.find((r) => r.status === 'approved');
                            const pagamentoAtual = aprovado || resultados[resultados.length - 1];
                            const novoStatus = mapearStatusMP(pagamentoAtual.status);

                            if (novoStatus !== pedido.status) {
                                const t = await sequelize.transaction();
                                try {
                                    pedido.status = novoStatus;
                                    await pedido.save({ transaction: t });

                                    if (STATUS_SEM_ESTOQUE.includes(novoStatus)) {
                                        await devolverEstoqueDoPedido(pedido.id, t);
                                    }
                                    await t.commit();
                                } catch (txErr) {
                                    await t.rollback();
                                    throw txErr;
                                }
                            }
                        }
                    } catch (err) {
                        console.error(`Erro ao sincronizar pedido #${pedido.id} com MP:`, err.message);
                    }
                })
        );

        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar histórico.", detalhe: error.message });
    }
};

exports.pedidosDoVendedor = async (req, res) => {
    const vendedor_id = Number(req.params.vendedor_id || req.usuario?.id);

    if (!vendedor_id) {
        return res.status(400).json({ error: "ID do vendedor não informado." });
    }

    try {
        // 1. Busca todos os produtos deste vendedor
        const produtosVendedor = await Produto.findAll({
            where: { vendedor_id },
        });

        if (produtosVendedor.length === 0) {
            return res.status(200).json([]);
        }

        const mapaProdutos = new Map(produtosVendedor.map((p) => [p.id, p]));
        const produtoIds = produtosVendedor.map((p) => p.id);

        // 2. Busca os itens de pedido que pertencem a esses produtos
        const itensVendedor = await ItemPedido.findAll({
            where: { produto_id: { [Op.in]: produtoIds } },
        });

        if (itensVendedor.length === 0) {
            return res.status(200).json([]);
        }

        const pedidoIds = [...new Set(itensVendedor.map((i) => i.pedido_id))];

        // 3. Busca os pedidos correspondentes
        const pedidos = await Pedido.findAll({
            where: { id: { [Op.in]: pedidoIds } },
            order: [['createdAt', 'DESC']],
        });

        // 4. Busca os dados dos clientes
        const clienteIds = [...new Set(pedidos.map((p) => p.cliente_id))];
        const clientes = await Usuario.findAll({
            where: { id: { [Op.in]: clienteIds } },
            attributes: ['id', 'nome', 'email'],
        });
        const mapaClientes = new Map(clientes.map((c) => [c.id, c]));

        // 5. Monta a resposta estruturada para a tela do vendedor
        const resposta = pedidos.map((pedido) => {
            const cliente = mapaClientes.get(pedido.cliente_id);
            const itensDoPedido = itensVendedor
                .filter((item) => item.pedido_id === pedido.id)
                .map((item) => {
                    const prod = mapaProdutos.get(item.produto_id);
                    return {
                        id: item.id,
                        produto_id: item.produto_id,
                        nome_produto: prod ? prod.nome : `Produto #${item.produto_id}`,
                        imagem_url: prod ? prod.imagem_url : null,
                        quantidade: item.quantidade,
                        preco_uni: item.preco_uni,
                    };
                });

            return {
                id: pedido.id,
                cliente_id: pedido.cliente_id,
                cliente_nome: cliente ? cliente.nome : `Cliente #${pedido.cliente_id}`,
                cliente_email: cliente ? cliente.email : '',
                total: pedido.total,
                status: pedido.status,
                metodo_pagamento: pedido.metodo_pagamento,
                createdAt: pedido.createdAt,
                itens: itensDoPedido,
            };
        });

        res.status(200).json(resposta);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar pedidos do vendedor.", detalhe: error.message });
    }
};

exports.atualizarStatusPedido = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!STATUS_VALIDOS.includes(status)) {
        return res.status(400).json({
            error: `Status inválido. Use um destes: ${STATUS_VALIDOS.join(', ')}`,
        });
    }

    const t = await sequelize.transaction();

    try {
        const pedido = await Pedido.findByPk(id, { transaction: t });
        if (!pedido) {
            await t.rollback();
            return res.status(404).json({ error: "Pedido não encontrado." });
        }

        const statusAnterior = pedido.status;
        const estavaCancelado = STATUS_SEM_ESTOQUE.includes(statusAnterior);
        const vaiCancelar = STATUS_SEM_ESTOQUE.includes(status);

        // Se mudou de ativo -> Cancelado/Recusado: devolve o estoque
        if (!estavaCancelado && vaiCancelar) {
            await devolverEstoqueDoPedido(pedido.id, t);
        }

        // Se mudou de Cancelado/Recusado -> ativo: valida e desconta o estoque novamente
        if (estavaCancelado && !vaiCancelar) {
            const itens = await ItemPedido.findAll({
                where: { pedido_id: pedido.id },
                transaction: t,
            });

            for (const item of itens) {
                const produto = await Produto.findByPk(item.produto_id, { transaction: t });
                if (!produto || produto.estoque < item.quantidade) {
                    await t.rollback();
                    return res.status(400).json({
                        error: `Não é possível reativar: estoque insuficiente para "${produto?.nome || item.produto_id}".`,
                    });
                }
                produto.estoque -= item.quantidade;
                await produto.save({ transaction: t });
            }
        }

        pedido.status = status;
        await pedido.save({ transaction: t });
        await t.commit();

        res.status(200).json({
            message: "Status do pedido atualizado com sucesso.",
            pedido,
        });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: "Erro ao atualizar status do pedido.", detalhe: error.message });
    }
};