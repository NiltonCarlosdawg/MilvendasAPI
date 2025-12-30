import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========================================
// CRIAR EVENTO
// ========================================
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      eventType,
      descriptionShort,
      descriptionLong,
      eventDate,
      eventEndDate,
      location,
      address,
      organizerName,
      organizerContact,
      capacity,
      allowTicketRequest,
      externalLink,
      status
    } = req.body;

    // Validações
    if (!title || !eventType || !descriptionShort || !eventDate || !location) {
      return res.status(400).json({ 
        error: "Campos obrigatórios: title, eventType, descriptionShort, eventDate, location" 
      });
    }

    // Gerar slug a partir do título
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Verificar se slug já existe
    const existingEvent = await prisma.event.findUnique({ where: { slug } });
    if (existingEvent) {
      return res.status(400).json({ 
        error: "Já existe um evento com esse título. Por favor, escolha outro." 
      });
    }

    // Determinar se permite solicitação de ingresso
    const shouldAllowTicketRequest = eventType === 'OWN' ? 
      (allowTicketRequest === true || allowTicketRequest === 'true') : 
      false;

    // Criar evento
    const event = await prisma.event.create({
      data: {
        title,
        slug,
        eventType,
        descriptionShort,
        descriptionLong,
        eventDate: new Date(eventDate),
        eventEndDate: eventEndDate ? new Date(eventEndDate) : null,
        location,
        address,
        organizerName,
        organizerContact,
        capacity: capacity ? parseInt(capacity) : null,
        allowTicketRequest: shouldAllowTicketRequest,
        externalLink,
        status: status || 'DRAFT'
      }
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({ error: "Erro ao criar evento" });
  }
};

// ========================================
// UPLOAD DE MÍDIA (Imagens e Vídeos)
// ========================================
export const uploadEventMedia = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { mediaType, title, isCover } = req.body;
    const files = req.files; // Múltiplos arquivos

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    // Verificar se o evento existe
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }

    // Contar mídias existentes
    const existingMedia = await prisma.eventMedia.findMany({
      where: { eventId, mediaType: mediaType || 'image' }
    });

    // Limites: 10 imagens + 1 vídeo
    const imageCount = existingMedia.filter(m => m.mediaType === 'image').length;
    const videoCount = existingMedia.filter(m => m.mediaType === 'video').length;

    if (mediaType === 'image' && imageCount + files.length > 10) {
      return res.status(400).json({ 
        error: `Limite de 10 imagens atingido. Você já tem ${imageCount} imagens.` 
      });
    }

    if (mediaType === 'video' && videoCount + files.length > 1) {
      return res.status(400).json({ 
        error: "Apenas 1 vídeo é permitido por evento." 
      });
    }

    // Se marcado como capa, remover capa anterior
    if (isCover === 'true' || isCover === true) {
      await prisma.eventMedia.updateMany({
        where: { eventId, isCover: true },
        data: { isCover: false }
      });
    }

    // Criar registros de mídia
    const mediaRecords = files.map((file, index) => ({
      eventId,
      mediaType: mediaType || 'image',
      mediaUrl: file.filename,
      title: title || `${mediaType || 'image'} ${index + 1}`,
      order: existingMedia.length + index,
      isCover: (isCover === 'true' || isCover === true) && index === 0
    }));

    const createdMedia = await prisma.eventMedia.createMany({
      data: mediaRecords
    });

    res.status(201).json({ 
      message: `${files.length} arquivo(s) enviado(s) com sucesso`,
      count: createdMedia.count
    });
  } catch (error) {
    console.error('Erro ao fazer upload de mídia:', error);
    res.status(500).json({ error: "Erro ao fazer upload de mídia" });
  }
};

// ========================================
// LISTAR EVENTOS (Público e Admin)
// ========================================
export const getEvents = async (req, res) => {
  try {
    const { status, eventType, upcoming } = req.query;
    const isAdmin = req.userId; // Se tem userId, é admin autenticado

    const where = {};

    // Filtros públicos (não admin)
    if (!isAdmin) {
      where.status = 'PUBLISHED';
    } else {
      // Admin pode filtrar por status
      if (status) where.status = status;
    }

    // Filtro por tipo
    if (eventType) where.eventType = eventType;

    // Filtro de eventos futuros
    if (upcoming === 'true') {
      where.eventDate = { gte: new Date() };
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        media: {
          orderBy: { order: 'asc' },
          take: 1, // Apenas a primeira mídia (capa)
        },
        _count: {
          select: { ticketRequests: true }
        }
      },
      orderBy: { eventDate: 'asc' }
    });

    res.json(events);
  } catch (error) {
    console.error('Erro ao listar eventos:', error);
    res.status(500).json({ error: "Erro ao listar eventos" });
  }
};

// ========================================
// BUSCAR EVENTO POR SLUG
// ========================================
export const getEventBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        media: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!event) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }

    // Incrementar visualizações
    await prisma.event.update({
      where: { id: event.id },
      data: { viewCount: { increment: 1 } }
    });

    res.json(event);
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    res.status(500).json({ error: "Erro ao buscar evento" });
  }
};

// ========================================
// ATUALIZAR EVENTO
// ========================================
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Se o título mudou, atualizar slug
    if (updateData.title) {
      updateData.slug = updateData.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    // Converter datas se necessário
    if (updateData.eventDate) {
      updateData.eventDate = new Date(updateData.eventDate);
    }
    if (updateData.eventEndDate) {
      updateData.eventEndDate = new Date(updateData.eventEndDate);
    }

    const event = await prisma.event.update({
      where: { id },
      data: updateData,
      include: { media: true }
    });

    res.json(event);
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    const status = error.code === 'P2025' ? 404 : 500;
    res.status(status).json({ error: "Erro ao atualizar evento" });
  }
};

// ========================================
// DELETAR EVENTO
// ========================================
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar mídias para deletar arquivos físicos
    const event = await prisma.event.findUnique({
      where: { id },
      include: { media: true }
    });

    if (!event) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }

    // Deletar arquivos físicos
    const uploadPath = path.join(__dirname, '../../uploads/events');
    event.media.forEach(media => {
      const filePath = path.join(uploadPath, media.mediaUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // Deletar evento (cascade deleta mídias e solicitações)
    await prisma.event.delete({ where: { id } });

    res.json({ message: "Evento removido com sucesso" });
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    res.status(500).json({ error: "Erro ao deletar evento" });
  }
};

// ========================================
// DELETAR MÍDIA ESPECÍFICA
// ========================================
export const deleteEventMedia = async (req, res) => {
  try {
    const { mediaId } = req.params;

    const media = await prisma.eventMedia.findUnique({
      where: { id: mediaId }
    });

    if (!media) {
      return res.status(404).json({ error: "Mídia não encontrada" });
    }

    // Deletar arquivo físico
    const uploadPath = path.join(__dirname, '../../uploads/events');
    const filePath = path.join(uploadPath, media.mediaUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Deletar registro
    await prisma.eventMedia.delete({ where: { id: mediaId } });

    res.json({ message: "Mídia removida com sucesso" });
  } catch (error) {
    console.error('Erro ao deletar mídia:', error);
    res.status(500).json({ error: "Erro ao deletar mídia" });
  }
};

// ========================================
// SOLICITAR INGRESSO (Público)
// ========================================
export const requestTicket = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { name, email, phone, quantity, message } = req.body;

    // Validações
    if (!name || !email || !phone) {
      return res.status(400).json({ 
        error: "Nome, email e telefone são obrigatórios" 
      });
    }

    // Verificar se o evento existe e permite solicitação
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }

    if (!event.allowTicketRequest) {
      return res.status(400).json({ 
        error: "Este evento não aceita solicitações de ingresso" 
      });
    }

    // Criar solicitação
    const ticketRequest = await prisma.eventTicketRequest.create({
      data: {
        eventId,
        name,
        email,
        phone,
        quantity: quantity || 1,
        message
      }
    });

    res.status(201).json({ 
      message: "Solicitação enviada com sucesso! Entraremos em contato em breve.",
      request: ticketRequest
    });
  } catch (error) {
    console.error('Erro ao solicitar ingresso:', error);
    res.status(500).json({ error: "Erro ao processar solicitação" });
  }
};

// ========================================
// LISTAR SOLICITAÇÕES DE INGRESSO (Admin)
// ========================================
export const getTicketRequests = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { status } = req.query;

    const where = { eventId };
    if (status) where.status = status;

    const requests = await prisma.eventTicketRequest.findMany({
      where,
      include: {
        event: {
          select: { title: true, eventDate: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(requests);
  } catch (error) {
    console.error('Erro ao listar solicitações:', error);
    res.status(500).json({ error: "Erro ao listar solicitações" });
  }
};

// ========================================
// ATUALIZAR STATUS DA SOLICITAÇÃO (Admin)
// ========================================
export const updateTicketRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'contacted', 'confirmed', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: `Status inválido. Use: ${validStatuses.join(', ')}` 
      });
    }

    const request = await prisma.eventTicketRequest.update({
      where: { id: requestId },
      data: { status }
    });

    res.json(request);
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ error: "Erro ao atualizar status" });
  }
};