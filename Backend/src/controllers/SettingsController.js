import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Criar ou Atualizar uma configuração (Home, Quem Somos, etc)
export const updateSetting = async (req, res) => {
  try {
    const { key, value } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({ error: "Chave (key) e valor são obrigatórios." });
    }

    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    res.json(setting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar configuração." });
  }
};

// Buscar todas as configurações
export const getSettings = async (req, res) => {
  try {
    const settings = await prisma.setting.findMany();
    
    // Transformar em um objeto simples { chave: valor } para facilitar o uso no React
    const settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    res.json(settingsMap);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar configurações." });
  }
};

// Remover uma configuração específica
export const deleteSetting = async (req, res) => {
  try {
    const { key } = req.params;
    await prisma.setting.delete({ where: { key } });
    res.json({ message: "Configuração removida com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover configuração." });
  }
};