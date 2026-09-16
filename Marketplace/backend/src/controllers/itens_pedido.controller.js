const ItemPedido = require('../models/itens_pedido.model');

const getAll = async (req, res) => {
    try {
        const itensPedido = await ItemPedido.findAll();
        res.status(200).json(itensPedido);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const itensPedido = await ItemPedido.findByPk(id);

        if (!itensPedido) {
            return res.status(404).json({ message: "Not Found" });
        }

        res.status(200).json(itensPedido);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const create = async (req, res) => {
    try {
        const itensPedido = await ItemPedido.create(req.body);
        res.status(201).json(itensPedido);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;

        const [updatedRows] = await ItemPedido.update(req.body, {
            where: { id: id }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: "Not Found" });
        }

        const itensPedidoNovo = await ItemPedido.findByPk(id);
        res.status(200).json(itensPedidoNovo);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteItensPedido = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRows = await ItemPedido.destroy({
            where: { id: id }
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: "Not Found" });
        }

        res.status(200).json({ message: "Item do pedido deletado com sucesso." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteItensPedido,
};
