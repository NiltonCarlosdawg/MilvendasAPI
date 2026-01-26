import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ========================================
// ✅ VALIDAÇÃO OBRIGATÓRIA DO JWT_SECRET
// ========================================
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    '❌ ERRO CRÍTICO: JWT_SECRET não está definido no arquivo .env\n' +
    'Adicione a variável JWT_SECRET no arquivo .env com pelo menos 32 caracteres.'
  );
}

if (JWT_SECRET.length < 32) {
  console.warn(
    '⚠️  AVISO DE SEGURANÇA: JWT_SECRET deve ter pelo menos 32 caracteres.\n' +
    'Recomendamos usar uma chave mais longa para maior segurança.'
  );
}

// ========================================
// REGISTRO DE NOVO USUÁRIO/ADMIN
// ========================================
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // ========================================
    // VALIDAÇÕES DE INPUT
    // ========================================
    
    // Validar campos obrigatórios
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: "Campos obrigatórios ausentes",
        details: {
          name: !name ? "Nome é obrigatório" : null,
          email: !email ? "Email é obrigatório" : null,
          password: !password ? "Senha é obrigatória" : null
        }
      });
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: "Formato de email inválido",
        message: "Por favor, forneça um email válido"
      });
    }

    // Validar força da senha
    if (password.length < 8) {
      return res.status(400).json({ 
        error: "Senha fraca",
        message: "A senha deve ter no mínimo 8 caracteres"
      });
    }

    // Validar comprimento do nome
    if (name.length < 3) {
      return res.status(400).json({ 
        error: "Nome muito curto",
        message: "O nome deve ter no mínimo 3 caracteres"
      });
    }

    // ========================================
    // VERIFICAR SE USUÁRIO JÁ EXISTE
    // ========================================
    const userExists = await prisma.user.findUnique({ 
      where: { email: email.toLowerCase() } 
    });
    
    if (userExists) {
      return res.status(400).json({ 
        error: "Usuário já existe",
        message: "Este email já está cadastrado no sistema"
      });
    }

    // ========================================
    // CRIPTOGRAFAR SENHA
    // ========================================
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // ========================================
    // CRIAR USUÁRIO NO BANCO
    // ========================================
    const user = await prisma.user.create({
      data: { 
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: role || 'admin' //Usar role fornecido ou 'admin' como padrão
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
       
      }
    });

    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role
      }, 
      JWT_SECRET, 
      { expiresIn: '7d' } // Token válido por 7 dias
    );

    // ========================================
    // LOG DE AUDITORIA
    // ========================================
    console.log(` Novo usuário registrado: ${user.email} (${user.role})`);

    // ========================================
    // RESPOSTA DE SUCESSO
    // ========================================
    res.status(201).json({ 
      message: "Usuário criado com sucesso",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token, //  Retornar token para login automático
      expiresIn: '7d'
    });

  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    
    // Tratar erros específicos do Prisma
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        error: "Email já cadastrado",
        message: "Este email já está em uso"
      });
    }

    res.status(500).json({ 
      error: "Erro ao registrar usuário",
      message: process.env.NODE_ENV === 'development' 
        ? error.message 
        : "Ocorreu um erro inesperado. Tente novamente."
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: "Credenciais incompletas",
        message: "Email e senha são obrigatórios"
      });
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: "Email inválido",
        message: "Por favor, forneça um email válido"
      });
    }


    const user = await prisma.user.findUnique({ 
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      // Mensagem genérica para não expor se o email existe
      return res.status(401).json({ 
        error: "Credenciais inválidas",
        message: "Email ou senha incorretos"
      });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      // ✅ Log de tentativa de login falha (segurança)
      console.warn(`⚠️  Tentativa de login falha para: ${email}`);
      
      return res.status(401).json({ 
        error: "Credenciais inválidas",
        message: "Email ou senha incorretos"
      });
    }
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role
      }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    console.log(`✅ Login bem-sucedido: ${user.email} (${user.role})`);

    res.json({ 
      message: "Login realizado com sucesso",
      token,
      expiresIn: '7d',
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(' Erro ao fazer login:', error);
    
    res.status(500).json({ 
      error: "Erro ao fazer login",
      message: process.env.NODE_ENV === 'development' 
        ? error.message 
        : "Ocorreu um erro inesperado. Tente novamente."
    });
  }
};

// ========================================
// REFRESH TOKEN (OPCIONAL)
// ========================================
export const refreshToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ 
        error: "Token não fornecido" 
      });
    }

    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) {
      return res.status(401).json({ 
        error: "Formato de token inválido" 
      });
    }

    const token = parts[1];

    // Verificar token (mesmo que expirado)
    jwt.verify(token, JWT_SECRET, { ignoreExpiration: true }, async (err, decoded) => {
      if (err && err.name !== 'TokenExpiredError') {
        return res.status(401).json({ 
          error: "Token inválido" 
        });
      }

      // Buscar usuário atualizado
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      });

      if (!user) {
        return res.status(404).json({ 
          error: "Usuário não encontrado" 
        });
      }

      // Gerar novo token
      const newToken = jwt.sign(
        { 
          id: user.id,
          email: user.email,
          role: user.role
        }, 
        JWT_SECRET, 
        { expiresIn: '7d' }
      );

      console.log(`🔄 Token renovado para: ${user.email}`);

      res.json({
        message: "Token renovado com sucesso",
        token: newToken,
        expiresIn: '7d',
        user
      });
    });

  } catch (error) {
    console.error(' Erro ao renovar token:', error);
    res.status(500).json({ 
      error: "Erro ao renovar token" 
    });
  }
};

// ========================================
// VERIFICAR TOKEN (Útil para o frontend)
// ========================================
export const verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ 
        valid: false,
        error: "Token não fornecido" 
      });
    }

    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) {
      return res.status(401).json({ 
        valid: false,
        error: "Formato de token inválido" 
      });
    }

    const token = parts[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ 
          valid: false,
          error: err.name === 'TokenExpiredError' ? 'Token expirado' : 'Token inválido'
        });
      }

      res.json({
        valid: true,
        user: {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role
        }
      });
    });

  } catch (error) {
    console.error(' Erro ao verificar token:', error);
    res.status(500).json({ 
      valid: false,
      error: "Erro ao verificar token" 
    });
  }
};

// ========================================
// LOGOUT (Opcional - Invalidar token no cliente)
// ========================================
export const logout = async (req, res) => {
  try {
    
    console.log(` Logout realizado para usuário ID: ${req.userId}`);
    
    res.json({ 
      message: "Logout realizado com sucesso" 
    });

  } catch (error) {
    console.error(' Erro ao fazer logout:', error);
    res.status(500).json({ 
      error: "Erro ao fazer logout" 
    });
  }
};