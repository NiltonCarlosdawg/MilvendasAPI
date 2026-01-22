import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import paths from '../config/paths.js';

const prisma = new PrismaClient();
const EVENTS_UPLOAD_PATH = paths.EVENTS_UPLOAD;

// ========================================
// LISTAR EVENTOS (Com paginação React Admin)
// ========================================
export const getEvents = async (req, res) => {
  try {
    const { status, eventType } = req.query;
    const where = {};
    if (status) where.status = status;
    if (eventType) where.eventType = eventType;

    const total = await prisma.event.count({ where });

    // Paginação para React Admin (Header Content-Range)
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
          take: 1
        }
      }
    });

    res.setHeader('Content-Range', `events ${skip}-${skip + events.length - 1}/${total}`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
    res.json(events);
  } catch (error) {
    console.error('Erro no getEvents:', error);
    res.status(500).json({ error: 'Erro ao listar eventos' });
  }
};

// ========================================
// CRIAR EVENTO (Blindado contra Erro 500)
// ========================================
export const createEvent = async (req, res) => {
  try {
    const data = req.body;

    // Gerar Slug se não for fornecido
    const generatedSlug = (data.title || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Construção rigorosa para o Schema.prisma
    const event = await prisma.event.create({
      data: {
        title: data.title,
        slug: data.slug || generatedSlug,
        descriptionShort: data.descriptionShort || 'Sem descrição curta',
        descriptionLong: data.descriptionLong || null,
        location: data.location || 'Local a definir',
        address: data.address || null,
        organizerName: data.organizerName || null,
        organizerContact: data.organizerContact || null,
        capacity: data.capacity ? parseInt(data.capacity, 10) : null,
        allowTicketRequest: String(data.allowTicketRequest) === 'true',
        externalLink: data.externalLink || null,
        // Enums
        eventType: data.eventType === 'EXTERNAL' ? 'THIRD_PARTY' : (data.eventType || 'OWN'),
        status: data.status || 'DRAFT',
        // Datas
        eventDate: data.eventDate ? new Date(data.eventDate) : new Date(),
        eventEndDate: data.eventEndDate ? new Date(data.eventEndDate) : null,
      }
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({ error: error.message, code: error.code });
  }
};

// ========================================
// BUSCAR POR ID OU SLUG
// ========================================
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await prisma.event.findUnique({
      where: { id },
      include: { media: true, ticketRequests: true }
    });
    if (!event) return res.status(404).json({ error: 'Evento não encontrado' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEventBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const event = await prisma.event.findUnique({
      where: { slug },
      include: { media: true }
    });
    if (!event) return res.status(404).json({ error: 'Evento não encontrado' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========================================
// ATUALIZAR EVENTO
// ========================================
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Filtro de campos permitidos para evitar erros de campos inexistentes no Prisma
    const updateData = {};
    const allowed = [
      'title', 'slug', 'eventType', 'status', 'descriptionShort', 'descriptionLong',
      'eventDate', 'eventEndDate', 'location', 'address', 'organizerName', 
      'organizerContact', 'capacity', 'allowTicketRequest', 'externalLink'
    ];

    allowed.forEach(key => {
      if (data[key] !== undefined) {
        if (key === 'eventDate' || key === 'eventEndDate') {
          updateData[key] = data[key] ? new Date(data[key]) : null;
        } else if (key === 'capacity') {
          updateData[key] = data[key] ? parseInt(data[key], 10) : null;
        } else if (key === 'eventType' && data[key] === 'EXTERNAL') {
          updateData[key] = 'THIRD_PARTY';
        } else if (key === 'allowTicketRequest') {
          updateData[key] = String(data[key]) === 'true';
        } else {
          updateData[key] = data[key];
        }
      }
    });

    const updated = await prisma.event.update({
      where: { id },
      data: updateData
    });

    res.json(updated);
  } catch (error) {
    console.error('Erro no updateEvent:', error);
    res.status(500).json({ error: 'Erro ao atualizar evento' });
  }
};

// ========================================
// DELETAR EVENTO E MÍDIAS FÍSICAS
// ========================================
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const medias = await prisma.eventMedia.findMany({ where: { eventId: id } });
    medias.forEach(m => {
      const filePath = path.join(EVENTS_UPLOAD_PATH, m.url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    await prisma.event.delete({ where: { id } });
    res.json({ id });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao eliminar evento' });
  }
};

// ========================================
// GESTÃO DE MÍDIAS (Upload)
// ========================================
export const uploadEventMedia = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { mediaType, isCover } = req.body;
    const files = req.files || [];

    const result = await Promise.all(files.map(file => 
      prisma.eventMedia.create({
        data: {
          eventId,
          url: file.filename,
          mediaType: mediaType || 'image',
          isCover: String(isCover) === 'true'
        }
      })
    ));

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro no upload' });
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
    res.json({ message: "Mídia eliminada" });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao eliminar mídia' });
  }
};