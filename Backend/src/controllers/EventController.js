// src/controllers/EventController.js
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import paths from '../config/paths.js';

const prisma = new PrismaClient();
const EVENTS_UPLOAD_PATH = paths.EVENTS_UPLOAD;

// ========================================
// LISTAR TODOS OS EVENTOS (público) - COM PAGINAÇÃO PARA REACT ADMIN
export const getEvents = async (req, res) => {
  try {
    // 1. Conta o TOTAL de eventos publicados (essencial!)
    const total = await prisma.event.count({
      where: { status: 'PUBLISHED' },
    });

    // 2. Parseia o Range enviado pelo React Admin (ex: Range: items=0-9)
    const rangeHeader = req.get('Range') || 'items=0-9';
    const match = rangeHeader.match(/items=(\d+)-(\d+)/);

    let skip = 0;
    let take = 10; // valor default

    if (match) {
      skip = parseInt(match[1], 10);
      take = parseInt(match[2], 10) - skip + 1;
    }

    // 3. Busca paginada
    const events = await prisma.event.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { eventDate: 'asc' },
      skip,
      take,
      include: {
        media: {
          where: { isCover: true },
          take: 1,
          select: { url: true }  // ajuste para 'mediaUrl' se for o nome real do campo no schema
        }
      }
    });

    // 4. Define o total para o middleware gerar o Content-Range
    res.locals.total = total;

    res.json(events);
  } catch (error) {
    console.error('ERRO COMPLETO NO getEvents:', error);
    res.status(500).json({ 
      error: 'Erro interno ao listar eventos',
      details: error.message 
    });
  }
};

// ========================================
// BUSCAR EVENTO POR SLUG (público)
// ========================================
export const getEventBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        media: {
          orderBy: { createdAt: 'asc' }
        },
        _count: {
          select: { ticketRequests: true }
        }
      }
    });

    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    res.json(event);
  } catch (error) {
    console.error('Erro ao buscar evento por slug:', error);
    res.status(500).json({ error: 'Erro ao buscar evento' });
  }
};

// ========================================
// CRIAR EVENTO (admin)
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

    if (!title || !eventType || !descriptionShort || !eventDate || !location) {
      return res.status(400).json({ 
        error: "Campos obrigatórios: title, eventType, descriptionShort, eventDate, location" 
      });
    }

    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const existingEvent = await prisma.event.findUnique({ where: { slug } });
    if (existingEvent) {
      return res.status(400).json({ 
        error: "Já existe um evento com esse título. Escolha outro título." 
      });
    }

    const shouldAllowTicketRequest = eventType === 'OWN' 
      ? (allowTicketRequest === true || allowTicketRequest === 'true') 
      : false;

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
    res.status(500).json({ error: 'Erro interno ao criar evento' });
  }
};

// ========================================
// UPLOAD DE MÍDIA (admin)
// ========================================
export const uploadEventMedia = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { mediaType, title, isCover } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    files.forEach(file => {
      const isImage = file.mimetype.startsWith('image/');
      const isVideo = file.mimetype.startsWith('video/');

      if (mediaType === 'image' && !isImage) {
        fs.unlinkSync(file.path);
        throw new Error(`Arquivo ${file.originalname} não é imagem válida`);
      }

      if (mediaType === 'video' && !isVideo) {
        fs.unlinkSync(file.path);
        throw new Error(`Arquivo ${file.originalname} não é vídeo válido`);
      }
    });

    const mediaPromises = files.map(async (file) => {
      return prisma.eventMedia.create({
        data: {
          eventId,
          url: file.filename,  // ou mediaUrl se for o nome do campo no schema
          type: mediaType,
          title: title || file.originalname,
          isCover: isCover === 'true' || isCover === true
        }
      });
    });

    const uploadedMedia = await Promise.all(mediaPromises);

    res.status(201).json({
      message: `${files.length} mídia(s) enviada(s) com sucesso`,
      media: uploadedMedia
    });
  } catch (error) {
    console.error('Erro ao fazer upload de mídia:', error);
    const status = error.message.includes('não é') ? 400 : 500;
    res.status(status).json({ 
      error: error.message || "Erro ao processar upload de mídia" 
    });
  }
};

// ========================================
// SOLICITAR INGRESSO (público)
// ========================================
export const requestTicket = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { name, email, phone, quantity, message } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ 
        error: "Nome, email e telefone são obrigatórios" 
      });
    }

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

    const ticketRequest = await prisma.eventTicketRequest.create({
      data: {
        eventId,
        name,
        email,
        phone,
        quantity: quantity ? parseInt(quantity) : 1,
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
// LISTAR SOLICITAÇÕES DE INGRESSO (admin)
// ========================================
export const getTicketRequests = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { status } = req.query;

    const where = { eventId };
    if (status) where.status = status;

    // Total para paginação futura (se precisar)
    const total = await prisma.eventTicketRequest.count({ where });

    const requests = await prisma.eventTicketRequest.findMany({
      where,
      include: {
        event: {
          select: { title: true, eventDate: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.locals.total = total;  // Para middleware de Content-Range
    res.json(requests);
  } catch (error) {
    console.error('Erro ao listar solicitações:', error);
    res.status(500).json({ error: "Erro ao listar solicitações" });
  }
};

// ========================================
// ATUALIZAR STATUS DA SOLICITAÇÃO (admin)
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

// ========================================
// ATUALIZAR EVENTO (admin)
// ========================================
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (data.slug) delete data.slug;

    if (data.eventDate) data.eventDate = new Date(data.eventDate);
    if (data.eventEndDate) data.eventEndDate = new Date(data.eventEndDate);

    const updatedEvent = await prisma.event.update({
      where: { id },
      data
    });

    res.json(updatedEvent);
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    res.status(500).json({ error: 'Erro ao atualizar evento' });
  }
};

// ========================================
// DELETAR EVENTO (admin)
// ========================================
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const medias = await prisma.eventMedia.findMany({
      where: { eventId: id }
    });

    medias.forEach(media => {
      const filePath = path.join(EVENTS_UPLOAD_PATH, media.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await prisma.eventMedia.deleteMany({ where: { eventId: id } });
    await prisma.eventTicketRequest.deleteMany({ where: { eventId: id } });
    await prisma.event.delete({ where: { id } });

    res.json({ message: "Evento deletado com sucesso" });
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    res.status(500).json({ error: 'Erro ao deletar evento' });
  }
};

// ========================================
// DELETAR MÍDIA ESPECÍFICA (admin)
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

    const filePath = path.join(EVENTS_UPLOAD_PATH, media.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.eventMedia.delete({
      where: { id: mediaId }
    });

    res.json({ message: "Mídia removida com sucesso" });
  } catch (error) {
    console.error('Erro ao deletar mídia:', error);
    res.status(500).json({ error: "Erro ao remover mídia" });
  }
};