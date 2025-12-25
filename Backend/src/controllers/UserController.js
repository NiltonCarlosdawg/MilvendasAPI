import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAdminProfile = async (req, res) => {
  try {
    // O req.userId é injetado pelo authMiddleware após validar o Token JWT
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
        // Senha excluída automaticamente por não estar no select
      }
    });

    if (!user) {
      return res.status(404).json({ error: "Administrador não encontrado" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro ao carregar perfil do admin" });
  }
};