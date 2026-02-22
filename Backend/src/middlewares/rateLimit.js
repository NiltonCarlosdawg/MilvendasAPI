import rateLimit from 'express-rate-limit';

// Configurações base
const createLimiter = (windowMs, max, message) => rateLimit({
  windowMs,
  max,
  message: { error: message },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

// Rate limiters específicos
export const authLimiter = createLimiter(
  15 * 60 * 1000, // 15 minutos
  5, // 5 tentativas
  'Muitas tentativas de autenticação. Tente novamente em 15 minutos.'
);

export const registerLimiter = createLimiter(
  60 * 60 * 1000, // 1 hora
  3, // 3 registros por hora
  'Limite de registros atingido. Tente novamente em uma hora.'
);

export const apiLimiter = createLimiter(
  15 * 60 * 1000, // 15 minutos
  100, // 100 requisições
  'Muitas requisições. Tente novamente mais tarde.'
);

export const newsletterSubscribeLimiter = createLimiter(
  60 * 60 * 1000, // 1 hora
  5, // 5 inscrições
  'Muitas tentativas de inscrição. Tente novamente em uma hora.'
);

export const ticketRequestLimiter = createLimiter(
  60 * 60 * 1000, // 1 hora
  3, // 3 pedidos de bilhete
  'Muitos pedidos de bilhete. Tente novamente em uma hora.'
);

export const uploadLimiter = createLimiter(
  60 * 60 * 1000, // 1 hora
  20, // 20 uploads
  'Limite de uploads atingido. Tente novamente em uma hora.'
);