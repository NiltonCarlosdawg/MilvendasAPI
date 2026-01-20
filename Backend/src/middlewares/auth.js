// src/middlewares/auth.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Validação crítica: falha rápido se a chave não existir
if (!JWT_SECRET) {
  throw new Error(
    '❌ ERRO CRÍTICO: JWT_SECRET não definido no .env\n' +
    'Adicione uma chave forte (mínimo 32 caracteres) no arquivo .env'
  );
}

if (JWT_SECRET.length < 32) {
  console.warn('⚠️ AVISO: JWT_SECRET muito curto (< 32 caracteres). Use uma chave mais longa para segurança.');
}

/**
 * Middleware de autenticação JWT
 * Protege rotas que exigem login
 */
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: 'Não autorizado',
      message: 'Token de autenticação não fornecido'
    });
  }

  const [scheme, token] = authHeader.split(' ');

  if (!/^Bearer$/i.test(scheme) || !token) {
    return res.status(401).json({
      error: 'Não autorizado',
      message: 'Formato inválido. Use: Bearer <token>'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      let message = 'Token inválido';
      let code = 'INVALID_TOKEN';

      if (err.name === 'TokenExpiredError') {
        message = 'Sessão expirada';
        code = 'TOKEN_EXPIRED';
      } else if (err.name === 'JsonWebTokenError') {
        message = 'Token malformado';
        code = 'MALFORMED_TOKEN';
      }

      return res.status(401).json({
        error: 'Não autorizado',
        message,
        code
      });
    }

    // Injeta o usuário completo na requisição
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || 'user' // fallback seguro
    };

    // Opcional: log temporário para debug (remova em produção)
    // console.log(`[AUTH] Usuário autenticado: ${req.user.email} (role: ${req.user.role})`);

    next();
  });
};

/**
 * Middleware para rotas que exigem role 'admin'
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Acesso negado',
      message: 'Esta ação requer permissão de administrador'
    });
  }

  next();
};

export default authMiddleware;