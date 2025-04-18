const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Post = require('../models/Post');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Post.deleteMany({});
});

describe('Post Model', () => {
  it('deve criar e salvar um post com sucesso', async () => {
    const postData = {
      title: 'Título de teste',
      content: 'Conteúdo de teste',
      author: '64f5d86a3de22e1a5c888f23',
      authorName: 'Usuário Teste',
      authorRole: 'teacher',
      category: 'announcement',
      tags: ['teste', 'unitário'],
      status: 'published'
    };
    
    const validPost = new Post(postData);
    const savedPost = await validPost.save();
    
    // Verificações
    expect(savedPost._id).toBeDefined();
    expect(savedPost.title).toBe(postData.title);
    expect(savedPost.content).toBe(postData.content);
    expect(savedPost.author).toBe(postData.author);
    expect(savedPost.authorName).toBe(postData.authorName);
    expect(savedPost.authorRole).toBe(postData.authorRole);
    expect(savedPost.category).toBe(postData.category);
    expect(savedPost.tags).toEqual(expect.arrayContaining(postData.tags));
    expect(savedPost.status).toBe(postData.status);
    expect(savedPost.createdAt).toBeDefined();
    expect(savedPost.updatedAt).toBeDefined();
  });
  
  it('deve falhar ao tentar criar um post sem campos obrigatórios', async () => {
    const postInvalido = new Post({
      title: 'Título sem conteúdo'
    });
    
    let erro;
    try {
      await postInvalido.save();
    } catch (e) {
      erro = e;
    }
    
    expect(erro).toBeDefined();
    expect(erro.name).toBe('ValidationError');
  });
  
  it('deve atualizar o campo updatedAt ao modificar um post', async () => {
    // Criar post
    const post = new Post({
      title: 'Título inicial',
      content: 'Conteúdo inicial',
      author: '64f5d86a3de22e1a5c888f23',
      authorName: 'Usuário Teste',
      authorRole: 'teacher',
      category: 'announcement'
    });
    
    await post.save();
    
    // Armazenar data inicial
    const dataInicial = post.updatedAt;
    
    // Esperar um pouco para garantir diferença no timestamp
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Atualizar post
    post.title = 'Título atualizado';
    await post.save();
    
    // Verificar se a data foi atualizada
    expect(post.updatedAt).not.toEqual(dataInicial);
  });
}); 
