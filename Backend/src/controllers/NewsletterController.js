import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer'; // Precisará instalar: npm install nodemailer

const prisma = new PrismaClient();

// 1. Subscrever na Newsletter
export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email é obrigatório" });

    const existing = await prisma.newsletter.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "Este email já está subscrito." });

    await prisma.newsletter.create({ data: { email } });
    res.status(201).json({ message: "Subscrição realizada com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao processar subscrição." });
  }
};

// 2. Enviar Newsletter para TODOS (Users + Newsletter Subscribers)
export const sendBroadcast = async (req, res) => {
  try {
    const { subject, message } = req.body;

    // Procurar emails em ambas as tabelas
    const users = await prisma.user.findMany({ select: { email: true } });
    const subscribers = await prisma.newsletter.findMany({ 
      where: { active: true }, 
      select: { email: true } 
    });

    // Unificar e remover duplicados
    const allEmails = [...new Set([
      ...users.map(u => u.email),
      ...subscribers.map(s => s.email)
    ])];

    // Configurar o transporte de email (Exemplo com Gmail/SMTP)
    // Recomendado usar variáveis de ambiente para estas credenciais
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Disparar emails (em produção, o ideal é usar uma fila como BullMQ)
    const mailOptions = {
      from: '"Mil Vendas" <no-reply@milvendas.com>',
      bcc: allEmails.join(','), // Usa BCC para ninguém ver o email dos outros
      subject: subject,
      html: `<div>${message}</div>`
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: `Newsletter enviada para ${allEmails.length} contactos.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao enviar newsletter." });
  }
};