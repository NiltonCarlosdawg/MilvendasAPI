// src/services/PortfolioService.js
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import paths from '../config/paths.js';

const prisma = new PrismaClient();
const uploadPath = paths.UPLOAD_ROOT;

class PortfolioService {
  async getAllItems() {
    return await prisma.portfolio.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  // NOVO MÉTODO: Resolve o erro 500 do Controller
  async getItemById(id) {
    return await prisma.portfolio.findUnique({
      where: { id }
    });
  }

  async createItem(data, filename) {
    return await prisma.portfolio.create({
      data: {
        ...data,
        mediaUrl: filename
      }
    });
  }

async updateItem(id, data, newFile) {
  const existingItem = await prisma.portfolio.findUnique({ where: { id } });
  if (!existingItem) throw new Error("Item não encontrado");

  // CLEAN CODE: Desestruturamos para separar o 'file' (que é lixo para o Prisma)
  // e metadados automáticos como createdAt.
  const { 
    file,      // Objeto de upload do React Admin (Remover!)
    id: _id,   // ID não se atualiza (Remover!)
    createdAt, // Gerado pelo banco (Remover!)
    ...validData 
  } = data;

  let mediaUrl = existingItem.mediaUrl;

  // Se houver novo arquivo via Multer
  if (newFile) {
    this._deleteFile(existingItem.mediaUrl);
    mediaUrl = newFile.filename;
  }

  return await prisma.portfolio.update({
    where: { id },
    data: {
      ...validData, // Contém: title, description, mediaType, order
      mediaUrl      // Nome do arquivo atualizado ou antigo
    }
  });
}

  async deleteItem(id) {
    const item = await prisma.portfolio.findUnique({ where: { id } });
    if (!item) throw new Error("Item do portfólio não encontrado");

    this._deleteFile(item.mediaUrl);
    return await prisma.portfolio.delete({ where: { id } });
  }

  _deleteFile(filename) {
    if (!filename) return;
    const filePath = path.join(uploadPath, filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Erro ao deletar arquivo: ${err.message}`);
      }
    }
  }
}

export default new PortfolioService();