import { Request, Response } from 'express';
import { webhookService } from '../services/webhooks';

export async function handleWebhook(req: Request, res: Response) {
  try {
    const event = req.body;
    const signature = req.headers['x-signature'] as string;

    if (!signature) {
      return res.status(400).json({ error: 'Assinatura não fornecida' });
    }

    // Processar o evento do webhook
    await webhookService.handleWebhookEvent(event, signature);

    // Responder com sucesso
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    res.status(400).json({ error: 'Erro ao processar webhook' });
  }
} 