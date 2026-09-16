const Pedido = require('../models/pedidos.model.js');

const getAll = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll();
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const pedido = await Pedido.findByPk(id);

        if (!pedido) {
            return res.status(404).json({ message: "Not Found" });
        }

        res.status(200).json(pedido);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const create = async (req, res) => {
    try {
        const pedido = await Pedido.create(req.body);
        res.status(201).json(pedido);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;

        const [updatedRows] = await Pedido.update(req.body, {
            where: { id: id }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: "Not Found" });
        }

        const pedidoNovo = await Pedido.findByPk(id);
        res.status(200).json(pedidoNovo);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deletePedido = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRows = await Pedido.destroy({
            where: { id: id }
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: "Not Found" });
        }

        res.status(200).json({ message: "Pedido deletado com sucesso." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    deletePedido,
};
