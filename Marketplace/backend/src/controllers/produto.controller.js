// backend/src/controllers/produto.controller.js
const fs = require('fs');
const path = require('path');
const Produto = require('../models/produtos.model');

const IMAGEM_PADRAO = '/uploads/produtos/produto-padrao.jpg';

// Função auxiliar para apagar imagens antigas sem correr o risco de apagar a imagem padrão
const removerImagemAntiga = (imagemUrl) => {
    if (!imagemUrl || imagemUrl === IMAGEM_PADRAO) return;

    // Converte '/uploads/produtos/foto.jpg' no caminho real no disco: 'backend/uploads/produtos/foto.jpg'
    const caminhoRelativo = imagemUrl.startsWith('/') ? imagemUrl.slice(1) : imagemUrl;
    const caminhoCompleto = path.resolve(__dirname, '..', '..', caminhoRelativo);

    fs.unlink(caminhoCompleto, (err) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Erro ao remover imagem antiga:', err.message);
        }
    });
};

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
        const dadosProduto = { ...req.body };

        // Se o Multer recebeu uma imagem, monta a URL; caso contrário, o Model usa o defaultValue
        if (req.file) {
            dadosProduto.imagem_url = `/uploads/produtos/${req.file.filename}`;
        }

        const produto = await Produto.create(dadosProduto);
        res.status(201).json(produto);
    } catch (error) {
        // Se deu erro ao salvar no SQLite mas a foto subiu, apaga a foto para não virar lixo no disco
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
            return res.status(404).json({ message: "Not Found" });
        }

        const dadosAtualizados = { ...req.body };

        // Se enviou uma nova foto na atualização, substitui a URL e apaga a foto antiga do disco
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
            return res.status(404).json({ message: "Not Found" });
        }

        const imagemParaApagar = produto.imagem_url;

        await produto.destroy();

        // Apaga a imagem do produto do disco (se não for a produto-padrao.jpg)
        removerImagemAntiga(imagemParaApagar);

        res.status(200).json({ message: "Produto deletado com sucesso." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getByVendedor = async (req, res) => {
    try {
        const { vendedorId } = req.params;
        const produtos = await Produto.findAll({
            where: { vendedor_id: vendedorId }
        });
        res.status(200).json(produtos);
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