// src/controllers/UserController.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAdminProfile = async (req, res) => {
  try {
    console.log('req.user completo:', req.user);          // ← DEBUG
    console.log('Tentando buscar usuário com id:', req.user?.id);

    if (!req.user?.id) {
      return res.status(401).json({ error: 'Usuário não autenticado no middleware' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ error: 'Erro interno ao carregar perfil' });
  }
};