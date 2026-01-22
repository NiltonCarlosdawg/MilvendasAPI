import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// ========================================
// CONFIGURAÇÃO DO TRANSPORTE (ESTÁVEL)
// ========================================
const createTransporter = () => {
  const port = 587; // Mude de 465 para 587
return nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: port,
  secure: false, // OBRIGATÓRIO: false para 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false 
  }
});
};

// ========================================
// LISTAR SUBSCRITORES (ADMIN)
// ========================================
export const getAllSubscribers = async (req, res) => {
  try {
    const count = await prisma.newsletter.count();
    const subscribers = await prisma.newsletter.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.set('Access-Control-Expose-Headers', 'Content-Range');
    res.set('Content-Range', `newsletter 0-${subscribers.length}/${count}`);
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========================================
// BROADCAST (ENVIO EM MASSA CORRIGIDO)
// ========================================
export const sendBroadcast = async (req, res) => {
  const { subject, message } = req.body;

  if (!subject || !message) {
    return res.status(400).json({ error: 'Assunto e mensagem são obrigatórios' });
  }

  try {
    const subscribers = await prisma.newsletter.findMany({
      where: { active: true },
      select: { email: true }
    });

    if (subscribers.length === 0) {
      return res.status(400).json({ error: 'Nenhum subscritor ativo encontrado' });
    }

    const transporter = createTransporter();
    let successCount = 0;
    let failedCount = 0;

    // Processamento sequencial ou em pequenos blocos para evitar bloqueio do servidor de email
    for (const sub of subscribers) {
      try {
        const unsubscribeLink = `${process.env.FRONTEND_URL}/unsubscribe?email=${encodeURIComponent(sub.email)}`;

        // Montagem do e-mail sem DIVs restritivas para preservar o design dos templates
        await transporter.sendMail({
          from: `"MilVendas Tech" <${process.env.EMAIL_USER}>`,
          to: sub.email,
          subject: subject,
          html: `
            ${message}
            <div style="margin-top: 20px; padding: 20px; text-align: center; background-color: #f8f6f6; font-family: sans-serif;">
              <p style="font-size: 12px; color: #64748b; margin: 0;">
                Este e-mail foi enviado pela MilVendas. 
                <a href="${unsubscribeLink}" style="color: #ea2a33; text-decoration: underline;">Cancelar subscrição</a>
              </p>
            </div>
          `
        });
        successCount++;
      } catch (err) {
        console.error(`Falha no envio para ${sub.email}:`, err.message);
        failedCount++;
      }
    }

    res.json({
      message: 'Processamento de newsletter concluído',
      success: successCount,
      failed: failedCount,
      total: subscribers.length
    });

  } catch (error) {
    console.error('Erro fatal no broadcast:', error);
    res.status(500).json({ error: 'Erro interno ao processar broadcast' });
  }
};

// ========================================
// INSCRIÇÃO (PÚBLICA)
// ========================================
export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    const result = await prisma.newsletter.upsert({
      where: { email },
      update: { active: true },
      create: { email, active: true }
    });

    // Envio assíncrono para não travar a resposta do formulário
    sendWelcomeEmail(email).catch(err => console.error('Erro Welcome:', err.message));

    res.status(201).json({ message: 'Subscrição confirmada!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar inscrição' });
  }
};

// ========================================
// EMAIL DE BOAS-VINDAS (BASEADO NO TEMPLATE 4)
// ========================================
const sendWelcomeEmail = async (email) => {
  const transporter = createTransporter();
  const unsubscribeLink = `${process.env.FRONTEND_URL}/unsubscribe?email=${encodeURIComponent(email)}`;

  await transporter.sendMail({
    from: `"MilVendas Tech" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Bem-vindo à MilVendas Tech! 🎉',
    html: `
      <div style="font-family: sans-serif; text-align: center; padding: 40px; background-color: #ffffff; border-radius: 20px;">
        <h1 style="color: #211111;">Bem-vindo à MilVendas</h1>
        <p style="color: #64748b;">A sua subscrição na nossa newsletter de tecnologia foi confirmada.</p>
        <p style="margin-top: 20px; font-size: 12px;"><a href="${unsubscribeLink}">Cancelar subscrição</a></p>
      </div>
    `
  });
};

// ========================================
// CANCELAR INSCRIÇÃO
// ========================================
export const unsubscribe = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email ausente' });

    await prisma.newsletter.updateMany({
      where: { email },
      data: { active: false }
    });

    res.json({ message: 'Subscrição cancelada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};