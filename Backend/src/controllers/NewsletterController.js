// src/controllers/NewsletterController.js
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();


export const getAllSubscribers = async (req, res) => {
  try {
    // 1. Paginação (query params que o React Admin envia)
    // O formato costuma ser ?_end=10&_start=0 ou ?page=1&perPage=10
    // Vamos assumir o padrão que configuramos no dataProvider (page/perPage) ou range
    
    const count = await prisma.newsletter.count();
    
    // Se o frontend mandar paginação, aplicamos (simplificado para pegar tudo se não vier params)
    const subscribers = await prisma.newsletter.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // 2. IMPORTANTE: O Header para o React Admin
    res.set('Access-Control-Expose-Headers', 'Content-Range');
    res.set('Content-Range', `newsletter 0-${subscribers.length}/${count}`);
    
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// ========================================
// CONFIGURAÇÃO DO TRANSPORTER COM VALIDAÇÃO OBRIGATÓRIA
// ========================================
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Configurações de email incompletas no .env');
  }

  // Configuração para o servidor mail.milvendas.ao (Porta 465 usa SSL)
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: true, // true para porta 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false // Útil se o certificado SSL for auto-assinado
    }
  });
};
// ========================================
// SUBSCRIÇÃO (pública)
// ========================================
export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    const existing = await prisma.newsletter.findUnique({ where: { email } });
    if (existing) {
      if (existing.active) {
        return res.status(200).json({ message: 'Email já inscrito' });
      }
      // Reativar se estava inativo
      await prisma.newsletter.update({
        where: { email },
        data: { active: true }
      });
      return res.status(200).json({ message: 'Inscrição reativada' });
    }

    await prisma.newsletter.create({
      data: { email, active: true }
    });

    // Enviar email de boas-vindas (opcional, mas recomendado)
    await sendWelcomeEmail(email);

    res.status(201).json({ 
      message: 'Inscrição realizada com sucesso! Verifique sua caixa de entrada.' 
    });
  } catch (error) {
    console.error('Erro na inscrição:', error);
    res.status(500).json({ error: 'Erro ao processar inscrição' });
  }
};

// ========================================
// EMAIL DE BOAS-VINDAS
// ========================================
const sendWelcomeEmail = async (email) => {
  try {
    const transporter = createTransporter();

    const unsubscribeLink = `${process.env.FRONTEND_URL}/unsubscribe?email=${encodeURIComponent(email)}`;

    await transporter.sendMail({
      from: '"Mil Vendas" <noreply@milvendas.com>',
      to: email,
      subject: 'Bem-vindo à Newsletter Mil Vendas!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2>Olá! Bem-vindo(a) à nossa comunidade</h2>
          <p>Você agora recebe novidades, dicas e promoções exclusivas da Mil Vendas.</p>
          <p><a href="${unsubscribeLink}" style="color: #007bff;">Cancelar inscrição</a></p>
        </div>
      `
    });
  } catch (error) {
    console.error('Falha ao enviar email de boas-vindas:', error.message);
    // Não crasha o subscribe por causa do email
  }
};

// ========================================
// BROADCAST (admin) – APENAS PARA SUBSCRIBERS ATIVOS
// ========================================
export const sendBroadcast = async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ error: 'Assunto e mensagem são obrigatórios' });
    }

    const subscribers = await prisma.newsletter.findMany({
      where: { active: true },
      select: { email: true }
    });

    if (subscribers.length === 0) {
      return res.status(400).json({ error: 'Nenhum inscrito ativo para enviar' });
    }

    const transporter = createTransporter();
    const BATCH_SIZE = 50;
    const DELAY_MS = 1000; // 1s entre batches
    let success = 0;
    let failed = 0;

    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const batch = subscribers.slice(i, i + BATCH_SIZE).map(s => s.email);

      await Promise.allSettled(
        batch.map(async (email) => {
          const unsubscribeLink = `${process.env.FRONTEND_URL}/unsubscribe?email=${encodeURIComponent(email)}`;

          await transporter.sendMail({
            from: '"Mil Vendas" <noreply@milvendas.com>',
            to: email,
            subject,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px;">
                ${message}
                <hr style="margin: 20px 0;">
                <p style="font-size: 12px; color: #666;">
                  <a href="${unsubscribeLink}">Cancelar inscrição</a>
                </p>
              </div>
            `
          });
          success++;
        })
      );

      if (i + BATCH_SIZE < subscribers.length) {
        await new Promise(r => setTimeout(r, DELAY_MS));
      }
    }

    res.json({
      message: 'Envio concluído',
      success,
      failed: subscribers.length - success,
      total: subscribers.length
    });
  } catch (error) {
    console.error('Erro no broadcast:', error);
    res.status(500).json({ error: 'Erro ao enviar newsletter' });
  }
};

// ========================================
// CANCELAR INSCRIÇÃO (pública)
// ========================================
export const unsubscribe = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email não fornecido' });
    }

    await prisma.newsletter.updateMany({
      where: { email },
      data: { active: false }
    });

    res.json({ message: 'Inscrição cancelada com sucesso' });
  } catch (error) {
    console.error('Erro ao cancelar inscrição:', error);
    res.status(500).json({ error: 'Erro ao cancelar inscrição' });
  }
};