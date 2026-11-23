const { Preference, Payment } = require('mercadopago');
const client = require('../config/mercadopago');
const Pedido = require('../models/pedidos.model');

const mapearStatusMP = (statusMP) => {
  if (statusMP === 'approved') return 'Aprovado';
  if (statusMP === 'rejected' || statusMP === 'cancelled' || statusMP === 'failure') return 'Recusado';
  return 'Pendente';
};

const criarPreferencia = async (req, res) => {
  try {
    const { pedidoId, itens } = req.body;

    if (!itens || itens.length === 0) {
      return res.status(400).json({ erro: 'Nenhum item informado para pagamento.' });
    }

    const preference = new Preference(client);
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:8081';

    const body = {
      items: itens.map((item) => ({
        id: String(item.id),
        title: item.nome || item.titulo,
        quantity: Number(item.quantidade),
        unit_price: Number(item.preco),
        currency_id: 'BRL',
      })),
      external_reference: String(pedidoId),
      back_urls: {
        success: `${baseUrl}/cliente/historico`,
        failure: `${baseUrl}/cliente/historico`,
        pending: `${baseUrl}/cliente/historico`,
      },
      ...(baseUrl.startsWith('https://') ? { auto_return: 'approved' } : {}),
      // notification_url: `${process.env.BACKEND_URL}/pagamentos/webhook`,
    };

    const response = await preference.create({ body });

    return res.status(200).json({
      id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point,
    });
  } catch (error) {
    console.error('Erro ao criar preferência Mercado Pago:', error);
    return res.status(500).json({ erro: 'Erro ao iniciar pagamento.' });
  }
};

const atualizarStatus = async (req, res) => {
  try {
    const { pedidoId, statusMP } = req.body;

    if (!pedidoId) {
      return res.status(400).json({ erro: 'pedidoId é obrigatório.' });
    }

    const novoStatus = mapearStatusMP(statusMP);

    await Pedido.update(
      { status: novoStatus },
      { where: { id: pedidoId } }
    );

    return res.status(200).json({ pedidoId, status: novoStatus });
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    return res.status(500).json({ erro: 'Erro ao atualizar status.' });
  }
};

const receberWebhook = async (req, res) => {
  try {
    const { type, data } = req.body;

    res.sendStatus(200);

    if (type === 'payment' && data?.id) {
      const payment = new Payment(client);
      const pagamento = await payment.get({ id: data.id });

      const pedidoId = pagamento.external_reference;
      const novoStatus = mapearStatusMP(pagamento.status);

      if (pedidoId && Pedido) {
        await Pedido.update(
          { status: novoStatus },
          { where: { id: pedidoId } }
        );
      }
    }
  } catch (error) {
    console.error('Erro no webhook Mercado Pago:', error);
  }
};

module.exports = {
  criarPreferencia,
  atualizarStatus,
  receberWebhook,
};