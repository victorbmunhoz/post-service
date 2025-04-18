const axios = require('axios');
const logger = require('../config/logger');

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';

/**
 * Busca um usuário por ID no user-service
 * @param {string} userId - ID do usuário a ser buscado
 * @returns {Promise<Object>} - Dados do usuário
 */
const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/api/users/${userId}`);
    return response.data;
  } catch (error) {
    logger.error(`Erro ao buscar usuário ${userId}: ${error.message}`);
    throw new Error('Usuário não encontrado');
  }
};

/**
 * Verifica se um usuário existe e tem permissão para realizar a operação
 * @param {string} userId - ID do usuário
 * @param {Array} allowedRoles - Array com os papéis permitidos
 * @returns {Promise<boolean>} - True se o usuário tiver permissão
 */
const checkUserPermission = async (userId, allowedRoles = ['teacher', 'student']) => {
  try {
    const user = await getUserById(userId);
    return allowedRoles.includes(user.role);
  } catch (error) {
    logger.error(`Erro ao verificar permissão: ${error.message}`);
    return false;
  }
};

module.exports = {
  getUserById,
  checkUserPermission
}; 
