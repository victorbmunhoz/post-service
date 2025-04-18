const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String, // ID do usuário do user-service
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  authorRole: {
    type: String,
    enum: ['student', 'teacher'],
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['announcement', 'material', 'question', 'assignment']
  },
  tags: {
    type: [String],
    default: []
  },
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  status: {
    type: String,
    enum: ['published', 'draft', 'archived'],
    default: 'published'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware para atualizar o updatedAt antes de salvar
postSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Índices para otimizar consultas
postSchema.index({ author: 1 });
postSchema.index({ category: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ status: 1 });
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', postSchema); 