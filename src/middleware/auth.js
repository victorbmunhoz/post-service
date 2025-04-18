const authService = require('../services/authService');
const logger = require('../config/logger');

/**
 * Middleware para validar tokens JWT
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token de autenticação não fornecido' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verificar token com o auth-service
    const userData = await authService.verifyToken(token);
    
    // Adicionar dados do usuário ao objeto req
    req.user = userData;
    
    next();
  } catch (error) {
    logger.error(`Erro de autenticação: ${error.message}`);
    res.status(401).json({ message: 'Não autorizado', error: error.message });
  }
};

/**
 * Middleware para verificar se o usuário tem um papel específico
 * @param {Array} roles - Papéis permitidos
 */
const authorize = (roles = []) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Não autenticado' });
  }

  const userRole = req.user.role;
    
  if (roles.length && !roles.includes(userRole)) {
    logger.warn(`Acesso negado para usuário ${req.user.id} com papel ${userRole}`);
    return res.status(403).json({ message: 'Acesso negado. Permissão insuficiente.' });
  }
    
  next();
};

module.exports = {
  authenticate,
  authorize
}; 
