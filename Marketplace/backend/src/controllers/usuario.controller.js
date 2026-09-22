// backend/src/controllers/usuario.controller.js
const Usuario = require('../models/usuarios.model');

const getAll = async (req, res) => {
    try {
        const users = await Usuario.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await Usuario.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "Not Found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const create = async (req, res) => {
    try {
        const user = await Usuario.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;

        const [updatedRows] = await Usuario.update(req.body, {
            where: { id: id }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: "Not Found" });
        }

        const userNovo = await Usuario.findByPk(id);
        res.status(200).json(userNovo);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRows = await Usuario.destroy({
            where: { id: id }
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: "Not Found" });
        }

        res.status(200).json({ message: "Usuário deletado com sucesso." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteUser,
};
