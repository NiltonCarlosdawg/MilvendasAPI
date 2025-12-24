import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.join(__dirname, '../../uploads');

class PortfolioService {
  async getAllItems() {
    return await prisma.portfolio.findMany({
      orderBy: { createdAt: 'desc' }
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

    let mediaUrl = existingItem.mediaUrl;

    if (newFile) {
      this._deleteFile(existingItem.mediaUrl);
      mediaUrl = newFile.filename;
    }

    return await prisma.portfolio.update({
      where: { id },
      data: { ...data, mediaUrl }
    });
  }

  async deleteItem(id) {
    const item = await prisma.portfolio.findUnique({ where: { id } });
    if (!item) throw new Error("Item não encontrado");

    this._deleteFile(item.mediaUrl);
    return await prisma.portfolio.delete({ where: { id } });
  }

  // Método auxiliar privado para deletar arquivos
  _deleteFile(filename) {
    const filePath = path.join(uploadPath, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

export default new PortfolioService();