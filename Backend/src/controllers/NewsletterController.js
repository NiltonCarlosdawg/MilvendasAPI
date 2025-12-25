import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// Configuração do Transportador (Exemplo usando Mailtrap para testes)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "sandbox.smtp.mailtrap.io",
  port: process.env.EMAIL_PORT || 2525,
  auth: {
    user: process.env.EMAIL_USER, // Sua chave de usuário do Mailtrap
    pass: process.env.EMAIL_PASS, // Sua senha de app do Mailtrap
  },
});

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

export const sendBroadcast = async (req, res) => {
  try {
    const { subject, message } = req.body;

    // 1. Buscar emails de usuários E de inscritos na newsletter
    const users = await prisma.user.findMany({ select: { email: true } });
    const subscribers = await prisma.newsletter.findMany({ 
      where: { active: true }, 
      select: { email: true } 
    });

    // 2. Unificar e remover emails duplicados
    const allEmails = [...new Set([
      ...users.map(u => u.email),
      ...subscribers.map(s => s.email)
    ])];

    if (allEmails.length === 0) {
      return res.status(400).json({ error: "Nenhum destinatário encontrado." });
    }

    // 3. Configurações do email
    const mailOptions = {
      from: '"Mil Vendas Admin" <admin@milvendas.com>',
      bcc: allEmails, // Usamos BCC para um não ver o email do outro
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #007bff;">Mil Vendas News</h2>
          <div style="margin-top: 20px; font-size: 16px;">
            ${message}
          </div>
          <p style="margin-top: 30px; font-size: 12px; color: #999;">
            Você recebeu este email porque faz parte da nossa lista.
          </p>
        </div>
      `
    };

    // 4. Enviar
    await transporter.sendMail(mailOptions);

    res.json({ message: `Newsletter enviada com sucesso para ${allEmails.length} contactos.` });
  } catch (error) {
    console.error("Erro no Nodemailer:", error);
    res.status(500).json({ error: "Falha ao enviar emails." });
  }
};