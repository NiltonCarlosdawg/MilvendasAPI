import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAdminProfile = async (req, res) => {
  try {
    console.log('🔍 Buscando perfil. User ID:', req.userId); // DEBUG
    console.log('🔍 Tipo do User ID:', typeof req.userId); // DEBUG

    // O req.userId é injetado pelo authMiddleware após validar o Token JWT
    const user = await prisma.user.findUnique({
      where: { id: req.userId }, // Se o ID for string no Prisma, isso funcionará
      select: {
        id: true,
        name: true,
        email: true,
        role: true
        // Senha excluída automaticamente por não estar no select
      }
    });

    console.log('📦 Usuário encontrado:', user); // DEBUG

    if (!user) {
      console.log('❌ Usuário não existe no banco'); // DEBUG
      return res.status(404).json({ error: "Administrador não encontrado" });
    }

    res.json(user);
  } catch (error) {
    console.error('❌ Erro completo:', error); // DEBUG MELHORADO
    res.status(500).json({ 
      error: "Erro ao carregar perfil do admin",
      details: error.message // Apenas em desenvolvimento
    });
  }
};