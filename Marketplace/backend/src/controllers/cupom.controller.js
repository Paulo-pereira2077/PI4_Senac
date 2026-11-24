// backend/src/controllers/cupom.controller.js
const Cupom = require('../models/cupom.model');

const CUPONS_PADRAO = [
  {
    codigo: 'BEMVINDO10',
    tipo_desconto: 'porcentagem',
    valor: 10,
    valor_minimo: 0,
    ativo: true,
  },
  {
    codigo: 'FRETEGRATIS',
    tipo_desconto: 'frete_gratis',
    valor: 0,
    valor_minimo: 0,
    ativo: true,
  },
  {
    codigo: 'POVO15',
    tipo_desconto: 'valor_fixo',
    valor: 15,
    valor_minimo: 30,
    ativo: true,
  },
];

const garantirCuponsIniciais = async () => {
  const count = await Cupom.count();
  if (count === 0) {
    await Cupom.bulkCreate(CUPONS_PADRAO, { ignoreDuplicates: true });
  }
};

exports.listarCupons = async (req, res) => {
  try {
    await garantirCuponsIniciais();
    const cupons = await Cupom.findAll({ where: { ativo: true } });
    return res.status(200).json(cupons);
  } catch (error) {
    return res.status(500).json({
      error: 'Erro ao listar cupons.',
      detalhe: error.message,
    });
  }
};

exports.validarCupom = async (req, res) => {
  try {
    await garantirCuponsIniciais();

    const codigoNormalizado = String(req.body.codigo || '')
      .trim()
      .toUpperCase();
    const subtotal = Number(req.body.subtotal || 0);
    const freteAtual = Number(req.body.frete ?? 4.99);

    if (!codigoNormalizado) {
      return res.status(400).json({ error: 'Informe um código de cupom.' });
    }

    const cupom = await Cupom.findOne({
      where: { codigo: codigoNormalizado, ativo: true },
    });

    if (!cupom) {
      return res.status(404).json({ error: 'Cupom inválido ou inativo.' });
    }

    if (subtotal < Number(cupom.valor_minimo || 0)) {
      return res.status(400).json({
        error: `Valor mínimo de R$ ${Number(cupom.valor_minimo)
          .toFixed(2)
          .replace('.', ',')} para usar ${cupom.codigo}.`,
      });
    }

    let descontoSubtotal = 0;
    let novoFrete = freteAtual;

    if (cupom.tipo_desconto === 'porcentagem') {
      descontoSubtotal = Number(((subtotal * Number(cupom.valor)) / 100).toFixed(2));
    } else if (cupom.tipo_desconto === 'valor_fixo') {
      descontoSubtotal = Math.min(subtotal, Number(cupom.valor));
    } else if (cupom.tipo_desconto === 'frete_gratis') {
      novoFrete = 0;
    }

    const totalFinal = Math.max(0, Number((subtotal - descontoSubtotal + novoFrete).toFixed(2)));

    return res.status(200).json({
      valido: true,
      cupom: {
        id: cupom.id,
        codigo: cupom.codigo,
        tipo_desconto: cupom.tipo_desconto,
        valor: cupom.valor,
      },
      descontoSubtotal,
      frete: novoFrete,
      total: totalFinal,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Erro ao validar cupom.',
      detalhe: error.message,
    });
  }
};