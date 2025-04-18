const Post = require('../models/Post');
const userService = require('../services/userService');
const logger = require('../config/logger');

/**
 * Obter todos os posts com opções de filtro
 */
const getPosts = async (req, res) => {
  try {
    const { category, author, tag, status, limit = 10, page = 1 } = req.query;
    const query = {};
    
    // Aplicar filtros se fornecidos
    if (category) query.category = category;
    if (author) query.author = author;
    if (tag) query.tags = tag;
    if (status) query.status = status;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Post.countDocuments(query);
    
    res.json({
      posts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error(`Erro ao listar posts: ${error.message}`);
    res.status(500).json({ message: 'Erro ao listar posts', error: error.message });
  }
};

/**
 * Obter um post específico por ID
 */
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }
    
    res.json(post);
  } catch (error) {
    logger.error(`Erro ao buscar post ${req.params.id}: ${error.message}`);
    res.status(500).json({ message: 'Erro ao buscar post', error: error.message });
  }
};

/**
 * Criar um novo post
 */
const createPost = async (req, res) => {
  try {
    const { title, content, category, tags, attachments, status } = req.body;
    
    // Obter dados do usuário do token JWT (adicionado pelo middleware de autenticação)
    const { id: author, name: authorName, role: authorRole } = req.user;
    
    // Verificar se o usuário existe no user-service
    try {
      await userService.getUserById(author);
    } catch (error) {
      return res.status(400).json({ message: 'Autor inválido' });
    }
    
    const post = new Post({
      title,
      content,
      author,
      authorName,
      authorRole,
      category,
      tags: tags || [],
      attachments: attachments || [],
      status: status || 'published'
    });
    
    const savedPost = await post.save();
    
    logger.info(`Novo post criado: ${savedPost._id} por ${author}`);
    res.status(201).json(savedPost);
  } catch (error) {
    logger.error(`Erro ao criar post: ${error.message}`);
    res.status(500).json({ message: 'Erro ao criar post', error: error.message });
  }
};

/**
 * Atualizar um post existente
 */
const updatePost = async (req, res) => {
  try {
    const { title, content, category, tags, attachments, status } = req.body;
    const { id } = req.params;
    
    // Verificar se o post existe
    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }
    
    // Verificar se o usuário é o autor do post ou um professor (admin)
    if (post.author !== req.user.id && req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Você não tem permissão para editar este post' });
    }
    
    // Atualizar dados
    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    post.tags = tags || post.tags;
    post.attachments = attachments || post.attachments;
    post.status = status || post.status;
    
    const updatedPost = await post.save();
    
    logger.info(`Post atualizado: ${id} por ${req.user.id}`);
    res.json(updatedPost);
  } catch (error) {
    logger.error(`Erro ao atualizar post ${req.params.id}: ${error.message}`);
    res.status(500).json({ message: 'Erro ao atualizar post', error: error.message });
  }
};

/**
 * Excluir um post
 */
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se o post existe
    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }
    
    // Verificar permissões (apenas o autor ou professor pode excluir)
    if (post.author !== req.user.id && req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Você não tem permissão para excluir este post' });
    }
    
    await Post.findByIdAndDelete(id);
    
    logger.info(`Post excluído: ${id} por ${req.user.id}`);
    res.json({ message: 'Post excluído com sucesso' });
  } catch (error) {
    logger.error(`Erro ao excluir post ${req.params.id}: ${error.message}`);
    res.status(500).json({ message: 'Erro ao excluir post', error: error.message });
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
}; 