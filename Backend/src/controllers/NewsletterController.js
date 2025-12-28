import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// ========================================
// CONFIGURAÇÃO DO TRANSPORTER
// ========================================
const createTransporter = () => {
  // Para PRODUÇÃO, use um serviço real (Gmail, SendGrid, AWS SES, etc)
  if (process.env.NODE_ENV === 'production') {
    // Exemplo com Gmail (requer App Password)
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password do Gmail
      },
    });
    
    // Ou use SendGrid/AWS SES para alto volume:
    /*
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
    */
  }
  
  // Para DESENVOLVIMENTO, use Mailtrap
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "sandbox.smtp.mailtrap.io",
    port: process.env.EMAIL_PORT || 2525,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// ========================================
// SUBSCRIÇÃO (Rota Pública)
// ========================================
export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validação básica
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: "Email inválido" });
    }

    // Verificar se já existe
    const existing = await prisma.newsletter.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ 
        message: "Este email já está inscrito na newsletter." 
      });
    }

    // Criar inscrição
    await prisma.newsletter.create({ data: { email } });
    
    // Enviar email de boas-vindas (opcional)
    await sendWelcomeEmail(email);
    
    res.status(201).json({ 
      message: "Inscrição realizada com sucesso! Verifique seu email." 
    });
  } catch (error) {
    console.error("Erro ao processar inscrição:", error);
    res.status(500).json({ error: "Erro ao processar inscrição." });
  }
};

// ========================================
// ENVIO DE EMAIL DE BOAS-VINDAS
// ========================================
const sendWelcomeEmail = async (email) => {
  try {
    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: '"Mil Vendas" <noreply@milvendas.com>',
      to: email,
      subject: 'Bem-vindo à Newsletter Mil Vendas',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #007bff;">Obrigado por se inscrever! 🎉</h2>
          <p>Bem-vindo à newsletter da Mil Vendas.</p>
          <p>Em breve você receberá nossas novidades e ofertas exclusivas.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #999;">
            Você está recebendo este email porque se inscreveu na nossa newsletter.
          </p>
        </div>
      `
    });
  } catch (error) {
    console.error("Erro ao enviar email de boas-vindas:", error);
    // Não falhar a inscrição se o email falhar
  }
};

// ========================================
// BROADCAST - ENVIO EM LOTE (Privado)
// ========================================
export const sendBroadcast = async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ 
        error: "Assunto e mensagem são obrigatórios." 
      });
    }

    // 1. Buscar todos os destinatários ativos
    const users = await prisma.user.findMany({ 
      select: { email: true } 
    });
    
    const subscribers = await prisma.newsletter.findMany({ 
      where: { active: true }, 
      select: { email: true } 
    });

    // 2. Unificar emails (remover duplicados)
    const allEmails = [...new Set([
      ...users.map(u => u.email),
      ...subscribers.map(s => s.email)
    ])];

    if (allEmails.length === 0) {
      return res.status(400).json({ 
        error: "Nenhum destinatário encontrado." 
      });
    }

    // 3. Enviar em lotes (SOLUÇÃO SEGURA)
    const results = await sendEmailsInBatches(allEmails, subject, message);

    res.json({ 
      message: `Newsletter processada!`,
      total: allEmails.length,
      enviados: results.success,
      falhas: results.failed
    });
    
  } catch (error) {
    console.error("Erro no broadcast:", error);
    res.status(500).json({ error: "Falha ao enviar newsletter." });
  }
};

// ========================================
// ENVIO EM LOTES COM CONTROLE DE TAXA
// ========================================
const sendEmailsInBatches = async (emails, subject, message) => {
  const transporter = createTransporter();
  const BATCH_SIZE = 10;  // Enviar 10 emails por vez
  const DELAY_MS = 2000;   // Aguardar 2 segundos entre lotes
  
  let successCount = 0;
  let failedCount = 0;
  const failedEmails = [];

  // Dividir emails em lotes
  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const batch = emails.slice(i, i + BATCH_SIZE);
    
    // Enviar cada email individualmente (mais controle)
    const promises = batch.map(email => 
      sendIndividualEmail(transporter, email, subject, message)
        .then(() => successCount++)
        .catch(err => {
          failedCount++;
          failedEmails.push(email);
          console.error(`Falha ao enviar para ${email}:`, err.message);
        })
    );

    await Promise.allSettled(promises);
    
    // Aguardar antes do próximo lote (Rate Limiting)
    if (i + BATCH_SIZE < emails.length) {
      await sleep(DELAY_MS);
    }
  }

  return {
    success: successCount,
    failed: failedCount,
    failedEmails
  };
};

// ========================================
// ENVIO INDIVIDUAL COM UNSUBSCRIBE
// ========================================
const sendIndividualEmail = async (transporter, email, subject, message) => {
  const unsubscribeLink = `${process.env.FRONTEND_URL}/unsubscribe?email=${encodeURIComponent(email)}`;
  
  const mailOptions = {
    from: '"Mil Vendas" <noreply@milvendas.com>',
    to: email, // ✅ Um destinatário por vez
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #007bff;">Mil Vendas Newsletter</h2>
        <div style="margin: 30px 0; font-size: 16px; line-height: 1.6;">
          ${message}
        </div>
        <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;">
        <div style="font-size: 12px; color: #999; text-align: center;">
          <p>Você está recebendo este email porque faz parte da nossa lista.</p>
          <p>
            <a href="${unsubscribeLink}" style="color: #007bff; text-decoration: none;">
              Cancelar inscrição
            </a>
          </p>
        </div>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

// ========================================
// CANCELAR INSCRIÇÃO (Rota Pública)
// ========================================
export const unsubscribe = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email não fornecido" });
    }

    // Desativar ao invés de deletar (para histórico)
    await prisma.newsletter.updateMany({
      where: { email },
      data: { active: false }
    });

    res.json({ 
      message: "Você foi removido da nossa lista de emails." 
    });
  } catch (error) {
    console.error("Erro ao cancelar inscrição:", error);
    res.status(500).json({ error: "Erro ao processar cancelamento." });
  }
};

// ========================================
// FUNÇÃO AUXILIAR - SLEEP
// ========================================
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));