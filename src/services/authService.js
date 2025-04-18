const axios = require('axios');
const logger = require('../config/logger');

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:4000';

/**
 * Verifica se um token é válido consultando o auth-service
 * @param {string} token - Token JWT a ser verificado
 * @returns {Promise<Object>} - Objeto com dados do usuário se o token for válido
 */
const verifyToken = async (token) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/api/auth/verify`, { token });
    return response.data;
  } catch (error) {
    logger.error(`Erro ao verificar token: ${error.message}`);
    throw new Error('Token inválido ou expirado');
  }
};

module.exports = {
  verifyToken
}; 
