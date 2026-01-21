import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import paths from '../config/paths.js';

const prisma = new PrismaClient();
const EVENTS_UPLOAD_PATH = paths.EVENTS_UPLOAD;

// ========================================
// LISTAR EVENTOS (Admin e Público)
// ========================================
export const getEvents = async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};

    const total = await prisma.event.count({ where });

    // Paginação para React Admin (Header Range)
    const rangeHeader = req.get('Range') || 'items=0-9';
    const match = rangeHeader.match(/items=(\d+)-(\d+)/);
    
    let skip = 0;
    let take = 10;

    if (match) {
      skip = parseInt(match[1], 10);
      take = parseInt(match[2], 10) - skip + 1;
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: {
        media: {
          where: { isCover: true },
          take: 1,
          select: { url: true }
        }
      }
    });

    // Header obrigatório para o Data Provider do React Admin
    res.setHeader('Content-Range', `events ${skip}-${skip + events.length - 1}/${total}`);
    res.json(events);
  } catch (error) {
    console.error('Erro no getEvents:', error);
    res.status(500).json({ error: 'Erro ao listar eventos' });
  }
};

// ========================================
// BUSCAR EVENTO POR ID (Admin - Edição)
// ========================================
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Teste 1: Buscar SEM os relacionamentos (include)
    const event = await prisma.event.findUnique({
      where: { id }
    });

    if (!event) return res.status(404).json({ error: 'Evento não encontrado' });
    
    res.json(event);
  } catch (error) {
    console.error('ERRO REAL NO TERMINAL:', error); // Olhe o terminal do Node!
    res.status(500).json({ error: error.message });
  }
};

// ========================================
// BUSCAR EVENTO POR SLUG (Público)
// ========================================
export const getEventBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        media: { orderBy: { createdAt: 'asc' } },
        _count: { select: { ticketRequests: true } }
      }
    });

    if (!event) return res.status(404).json({ error: 'Evento não encontrado' });

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar evento por slug' });
  }
};

// ========================================
// CRIAR EVENTO (Admin)
// ========================================
export const createEvent = async (req, res) => {
  try {
    const { title, eventType, eventDate, eventEndDate, capacity, allowTicketRequest, ...rest } = req.body;

    // Gerar Slug amigável
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const event = await prisma.event.create({
      data: {
        ...rest,
        title,
        slug,
        eventType: eventType === 'EXTERNAL' ? 'THIRD_PARTY' : eventType,
        eventDate: new Date(eventDate),
        eventEndDate: eventEndDate ? new Date(eventEndDate) : null,
        capacity: capacity ? parseInt(capacity) : null,
        allowTicketRequest: Boolean(allowTicketRequest),
      }
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({ error: 'Erro ao criar evento' });
  }
};

// ========================================
// ATUALIZAR EVENTO (Admin)
// ========================================
// src/controllers/EventController.js

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    
    const { 
      id: _id, 
      slug, 
      createdAt, 
      updatedAt, 
      _count, 
      media, 
      ticketRequests, 
      coverImage, 
      ...validData 
    } = req.body;

    // Tratamento de tipos para o Prisma
    if (validData.eventDate) validData.eventDate = new Date(validData.eventDate);
    if (validData.eventEndDate) {
      validData.eventEndDate = new Date(validData.eventEndDate);
    } else {
      validData.eventEndDate = null;
    }
    
    if (validData.capacity) validData.capacity = parseInt(validData.capacity);
    
    // Ajuste de Enum para bater com o schema.prisma
    if (validData.eventType === 'EXTERNAL') validData.eventType = 'THIRD_PARTY';

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: validData
    });

    res.json(updatedEvent);
  } catch (error) {
    console.error('Erro no updateEvent:', error);
    res.status(500).json({ error: 'Erro ao atualizar evento', details: error.message });
  }
};

// ========================================
// DELETAR EVENTO (Admin)
// ========================================
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Buscar mídias para remover arquivos físicos
    const medias = await prisma.eventMedia.findMany({ where: { eventId: id } });
    medias.forEach(m => {
      const filePath = path.join(EVENTS_UPLOAD_PATH, m.url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    // 2. Deletar registros (Cascade no Prisma cuida das relações se configurado)
    await prisma.event.delete({ where: { id } });

    res.json({ id });
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    res.status(500).json({ error: 'Erro ao deletar evento' });
  }
};

// ========================================
// MÍDIAS E UPLOAD
// ========================================
export const uploadEventMedia = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { mediaType, isCover } = req.body;
    const files = req.files || [];

    const mediaPromises = files.map(file => prisma.eventMedia.create({
      data: {
        eventId,
        url: file.filename,
        mediaType: mediaType || 'image', // Nome exato do Schema
        isCover: isCover === 'true' || isCover === true
      }
    }));

    const result = await Promise.all(mediaPromises);
    res.status(201).json(result);
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ error: 'Erro no upload de mídias' });
  }
};

export const deleteEventMedia = async (req, res) => {
  try {
    const { mediaId } = req.params;
    const media = await prisma.eventMedia.findUnique({ where: { id: mediaId } });
    
    if (media) {
      const filePath = path.join(EVENTS_UPLOAD_PATH, media.url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      await prisma.eventMedia.delete({ where: { id: mediaId } });
    }
    
    res.json({ message: "Mídia removida" });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar mídia' });
  }
};

// ========================================
// INGRESSOS (Ticket Requests)
// ========================================
export const requestTicket = async (req, res) => {
  try {
    const { eventId } = req.params;
    const data = req.body;
    const request = await prisma.eventTicketRequest.create({
      data: { 
        ...data, 
        eventId, 
        quantity: parseInt(data.quantity) || 1 
      }
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar solicitação de ingresso' });
  }
};

export const getTicketRequests = async (req, res) => {
  try {
    const { eventId } = req.params;
    const requests = await prisma.eventTicketRequest.findMany({
      where: { eventId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar solicitações' });
  }
};

export const updateTicketRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    const result = await prisma.eventTicketRequest.update({
      where: { id: requestId },
      data: { status }
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar status do ingresso' });
  }
};