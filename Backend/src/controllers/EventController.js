// src/controllers/EventController.js
import eventService from '../services/EventService.js';

// ==========================================
// EVENTOS
// ==========================================

export const getEvents = async (req, res) => {
  try {
    const { status, eventType } = req.query;

    // Paginação compatível com React Admin (header Range)
    const rangeHeader = req.get('Range') || 'items=0-9';
    const match = rangeHeader.match(/items=(\d+)-(\d+)/);
    const skip = match ? parseInt(match[1], 10) : 0;
    const take = match ? parseInt(match[2], 10) - skip + 1 : 10;

    const { total, events } = await eventService.getAllEvents(
      { status, eventType },
      { skip, take }
    );

    res.setHeader('Content-Range', `events ${skip}-${skip + events.length - 1}/${total}`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
    res.json(events);
  } catch (error) {
    console.error('Erro no getEvents:', error);
    res.status(500).json({ error: 'Erro ao listar eventos' });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Evento não encontrado' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEventBySlug = async (req, res) => {
  try {
    const event = await eventService.getEventBySlug(req.params.slug);
    if (!event) return res.status(404).json({ error: 'Evento não encontrado' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const event = await eventService.createEvent(req.body);
    res.status(201).json(event);
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({ error: error.message, prismaCode: error.code });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const updated = await eventService.updateEvent(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Evento não encontrado' });
    res.json(updated);
  } catch (error) {
    console.error('Erro no updateEvent:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    await eventService.deleteEvent(req.params.id);
    res.json({ id: req.params.id });
  } catch (error) {
    console.error('Erro no deleteEvent:', error);
    res.status(500).json({ error: error.message });
  }
};

// ==========================================
// MEDIA
// ==========================================

export const uploadEventMedia = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { mediaType, isCover } = req.body;
    const files = req.files || [];

    if (files.length === 0) {
      return res.status(400).json({ error: 'Nenhum ficheiro recebido. Use o campo "files" no FormData.' });
    }

    const result = await eventService.addMedia(eventId, files, { mediaType, isCover });
    res.status(201).json(result);
  } catch (error) {
    console.error('Erro no uploadEventMedia:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteEventMedia = async (req, res) => {
  try {
    await eventService.deleteMedia(req.params.mediaId);
    res.json({ message: 'Mídia eliminada' });
  } catch (error) {
    console.error('Erro no deleteEventMedia:', error);
    res.status(500).json({ error: error.message });
  }
};

// ==========================================
// TICKET REQUESTS
// ==========================================

export const getTicketRequests = async (req, res) => {
  try {
    const { eventId } = req.params;
    const requests = await eventService.getTicketRequests(eventId);

    res.setHeader('Content-Range', `ticket-requests 0-${requests.length}/${requests.length}`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const requestTicket = async (req, res) => {
  try {
    const request = await eventService.createTicketRequest(req.params.eventId, req.body);
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTicketRequestStatus = async (req, res) => {
  try {
    const result = await eventService.updateTicketRequestStatus(
      req.params.requestId,
      req.body.status
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};