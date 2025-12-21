import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createItem = async (req, res) => {
  try {
    const { title, description, mediaType } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: "O arquivo de mídia é obrigatório." });
    }

    const item = await prisma.portfolio.create({
      data: {
        title,
        description,
        mediaType,
        mediaUrl: req.file.filename
      }
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: "Erro ao salvar item no portfólio." });
  }
};

export const getPortfolio = async (req, res) => {
  try {
    const items = await prisma.portfolio.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar portfólio." });
  }
};

// --- FUNÇÃO ATUALIZADA: UPDATE COM SUBSTITUIÇÃO DE ARQUIVO ---
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, mediaType } = req.body;

    // 1. Verifica se o item existe
    const existingItem = await prisma.portfolio.findUnique({ where: { id } });
    if (!existingItem) {
      return res.status(404).json({ error: "Item não encontrado." });
    }

    let mediaUrl = existingItem.mediaUrl;

    // 2. Se um novo arquivo foi enviado, remove o antigo e atualiza o nome
    if (req.file) {
      const oldPath = path.join(__dirname, '../../uploads', existingItem.mediaUrl);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
      mediaUrl = req.file.filename;
    }

    // 3. Atualiza no banco
    const updated = await prisma.portfolio.update({
      where: { id },
      data: { title, description, mediaType, mediaUrl }
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar item." });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.portfolio.findUnique({ where: { id } });

    if (!item) {
      return res.status(404).json({ error: "Item não encontrado." });
    }

    const filePath = path.join(__dirname, '../../uploads', item.mediaUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.portfolio.delete({ where: { id } });

    res.json({ message: "Item e arquivo removidos com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover item." });
  }
};