// backend/src/controllers/produto.controller.js
const Produto = require('../models/produtos.model');

const getAll = async (req, res) => {
    try {
        const produtos = await Produto.findAll();
        res.status(200).json(produtos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const produto = await Produto.findByPk(id);

        if (!produto) {
            return res.status(404).json({ message: "Not Found" });
        }

        res.status(200).json(produto);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const create = async (req, res) => {
    try {
        const produto = await Produto.create(req.body);
        res.status(201).json(produto);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;

        const [updatedRows] = await Produto.update(req.body, {
            where: { id: id }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: "Not Found" });
        }

        const produtoNovo = await Produto.findByPk(id);
        res.status(200).json(produtoNovo);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteProduto = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRows = await Produto.destroy({
            where: { id: id }
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: "Not Found" });
        }

        res.status(200).json({ message: "Produto deletado com sucesso." });
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
};
