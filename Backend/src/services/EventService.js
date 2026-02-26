// src/services/EventService.js
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import paths from '../config/paths.js';

const prisma = new PrismaClient();
const uploadPath = paths.EVENTS_UPLOAD;

class EventService {

  // ==========================================
  // EVENTOS
  // ==========================================

  async getAllEvents(filters = {}, pagination = {}) {
    const where = {};
    if (filters.status)    where.status    = filters.status;
    if (filters.eventType) where.eventType = filters.eventType;

    const { skip = 0, take = 10 } = pagination;

    const [total, events] = await Promise.all([
      prisma.event.count({ where }),
      prisma.event.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: {
          media: {
            orderBy: [{ isCover: 'desc' }, { order: 'asc' }]
          }
        }
      })
    ]);

    return { total, events };
  }

  async getEventById(id) {
    return await prisma.event.findUnique({
      where: { id },
      include: {
        media: { orderBy: [{ isCover: 'desc' }, { order: 'asc' }] },
        ticketRequests: { orderBy: { createdAt: 'desc' } }
      }
    });
  }

  async getEventBySlug(slug) {
    return await prisma.event.findUnique({
      where: { slug },
      include: {
        media: { orderBy: [{ isCover: 'desc' }, { order: 'asc' }] }
      }
    });
  }

  async createEvent(data) {
    const generatedSlug = (data.title || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return await prisma.event.create({
      data: {
        title:            data.title,
        slug:             data.slug || generatedSlug,
        descriptionShort: data.descriptionShort || 'Sem descrição curta',
        descriptionLong:  data.descriptionLong  || null,
        location:         data.location         || 'Local a definir',
        address:          data.address          || null,
        organizerName:    data.organizerName    || null,
        organizerContact: data.organizerContact || null,
        capacity:         data.capacity ? parseInt(data.capacity, 10) : null,
        allowTicketRequest: String(data.allowTicketRequest) === 'true',
        externalLink:     data.externalLink     || null,
        eventType:        data.eventType === 'EXTERNAL' ? 'THIRD_PARTY' : (data.eventType || 'OWN'),
        status:           data.status           || 'DRAFT',
        eventDate:        data.eventDate    ? new Date(data.eventDate)    : new Date(),
        eventEndDate:     data.eventEndDate ? new Date(data.eventEndDate) : null,
      }
    });
  }

  async updateEvent(id, data) {
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) throw new Error('Evento não encontrado');

    // Remove campos que não pertencem ao model Event
    const {
      id: _id, media, ticketRequests,
      createdAt, updatedAt, viewCount,
      ...rest
    } = data;

    const updateData = {};
    const allowed = [
      'title', 'slug', 'eventType', 'status', 'descriptionShort', 'descriptionLong',
      'eventDate', 'eventEndDate', 'location', 'address', 'organizerName',
      'organizerContact', 'capacity', 'allowTicketRequest', 'externalLink'
    ];

    allowed.forEach(key => {
      if (rest[key] === undefined) return;

      if (key === 'eventDate' || key === 'eventEndDate') {
        updateData[key] = rest[key] ? new Date(rest[key]) : null;
      } else if (key === 'capacity') {
        updateData[key] = rest[key] ? parseInt(rest[key], 10) : null;
      } else if (key === 'eventType' && rest[key] === 'EXTERNAL') {
        updateData[key] = 'THIRD_PARTY';
      } else if (key === 'allowTicketRequest') {
        updateData[key] = String(rest[key]) === 'true';
      } else {
        updateData[key] = rest[key];
      }
    });

    return await prisma.event.update({ where: { id }, data: updateData });
  }

  async deleteEvent(id) {
    const existing = await prisma.event.findUnique({
      where: { id },
      include: { media: true }
    });
    if (!existing) throw new Error('Evento não encontrado');

    // Remove ficheiros do disco antes de apagar da BD (cascade apaga os registos)
    existing.media.forEach(m => this._deleteFile(m.url));

    return await prisma.event.delete({ where: { id } });
  }

  // ==========================================
  // MEDIA
  // ==========================================

  async addMedia(eventId, files, { mediaType = 'image', isCover = false } = {}) {
    const existing = await prisma.event.findUnique({ where: { id: eventId } });
    if (!existing) throw new Error('Evento não encontrado');

    return await Promise.all(
      files.map(file =>
        prisma.eventMedia.create({
          data: {
            eventId,
            url:       file.filename,
            mediaType: mediaType || 'image',
            isCover:   String(isCover) === 'true'
          }
        })
      )
    );
  }

  async deleteMedia(mediaId) {
    const media = await prisma.eventMedia.findUnique({ where: { id: mediaId } });
    if (!media) throw new Error('Mídia não encontrada');

    this._deleteFile(media.url);
    return await prisma.eventMedia.delete({ where: { id: mediaId } });
  }

  // ==========================================
  // TICKET REQUESTS
  // ==========================================

  async getTicketRequests(eventId) {
    const where = eventId ? { eventId } : {};
    return await prisma.eventTicketRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { event: { select: { title: true } } }
    });
  }

  async createTicketRequest(eventId, data) {
    const existing = await prisma.event.findUnique({ where: { id: eventId } });
    if (!existing) throw new Error('Evento não encontrado');

    return await prisma.eventTicketRequest.create({
      data: {
        name:     data.name,
        email:    data.email,
        phone:    data.phone    || '',
        quantity: parseInt(data.quantity, 10) || 1,
        message:  data.message  || null,
        status:   'pending',
        event:    { connect: { id: eventId } }
      }
    });
  }

  async updateTicketRequestStatus(requestId, status) {
    const existing = await prisma.eventTicketRequest.findUnique({ where: { id: requestId } });
    if (!existing) throw new Error('Solicitação não encontrada');

    return await prisma.eventTicketRequest.update({
      where: { id: requestId },
      data:  { status }
    });
  }

  // ==========================================
  // UTILITÁRIO PRIVADO
  // ==========================================

  _deleteFile(filename) {
    if (!filename) return;
    const filePath = path.join(uploadPath, filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Erro ao deletar ficheiro de evento: ${err.message}`);
      }
    }
  }
}

export default new EventService();