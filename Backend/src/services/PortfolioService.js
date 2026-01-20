// src/services/PortfolioService.js
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import paths from '../config/paths.js';  // ← Importante: caminho absoluto

const prisma = new PrismaClient();
const uploadPath = paths.UPLOAD_ROOT;  // ou paths.PORTFOLIO_UPLOAD se quiser separar

class PortfolioService {
  /**
   * Retorna todos os itens do portfólio ordenados por data de criação (mais recente primeiro)
   */
  async getAllItems() {
    return await prisma.portfolio.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Cria um novo item no portfólio
   * @param {Object} data - Dados do item (title, description, etc.)
   * @param {String} filename - Nome do arquivo salvo pelo multer
   */
  async createItem(data, filename) {
    return await prisma.portfolio.create({
      data: {
        ...data,
        mediaUrl: filename  // salva apenas o nome do arquivo (ex: abc123-imagem.jpg)
      }
    });
  }

  /**
   * Atualiza um item existente
   * @param {String} id - ID do item
   * @param {Object} data - Novos dados
   * @param {Object|undefined} newFile - Objeto do arquivo novo (req.file) ou undefined
   */
  async updateItem(id, data, newFile) {
    const existingItem = await prisma.portfolio.findUnique({
      where: { id }
    });

    if (!existingItem) {
      throw new Error("Item do portfólio não encontrado");
    }

    let mediaUrl = existingItem.mediaUrl;

    // Se enviou novo arquivo → deleta o antigo e atualiza o caminho
    if (newFile) {
      this._deleteFile(existingItem.mediaUrl);
      mediaUrl = newFile.filename;
    }

    return await prisma.portfolio.update({
      where: { id },
      data: {
        ...data,
        mediaUrl
      }
    });
  }

  /**
   * Deleta um item e o arquivo associado
   * @param {String} id - ID do item
   */
  async deleteItem(id) {
    const item = await prisma.portfolio.findUnique({
      where: { id }
    });

    if (!item) {
      throw new Error("Item do portfólio não encontrado");
    }

    // Deleta o arquivo físico se existir
    this._deleteFile(item.mediaUrl);

    // Deleta do banco
    return await prisma.portfolio.delete({
      where: { id }
    });
  }

  /**
   * Método auxiliar privado para deletar arquivo com segurança
   * @private
   */
  _deleteFile(filename) {
    if (!filename) return; // nada a fazer

    const filePath = path.join(uploadPath, filename);

    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`🗑️ Arquivo deletado com sucesso: ${filename}`);
      } catch (err) {
        console.error(`Erro ao deletar arquivo ${filename}:`, err.message);
      }
    } else {
      console.warn(`Arquivo não encontrado para deleção: ${filename}`);
    }
  }
}

export default new PortfolioService();