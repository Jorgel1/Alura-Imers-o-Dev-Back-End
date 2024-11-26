import {getTodosPosts, criarPost, atualizarPost} from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

// Importa as funções para obter todos os posts e criar um novo post do módulo 'postsModel.js'
// Importa o módulo 'fs' para realizar operações no sistema de arquivos

export async function listarPosts(req, res) {
  // Chama a função para obter todos os posts do banco de dados
  const posts = await getTodosPosts();
  // Envia os posts como resposta em formato JSON com status 200 (sucesso)
  res.status(200).json(posts);
}

export async function postarNovoPost(req, res) {
  // Obtém os dados do novo post do corpo da requisição
  const novoPost = req.body;
  try {
    // Chama a função para criar um novo post no banco de dados
    const postCriado = await criarPost(novoPost);
    // Envia o post criado como resposta em formato JSON com status 200 (sucesso)
    res.status(200).json(postCriado);
  } catch (erro) {
    // Imprime o erro no console para depuração
    console.error(erro.message);
    // Envia uma resposta com status 500 (erro interno do servidor) e uma mensagem de erro genérica
    res.status(500).json({"Erro":"Falha na requisição"})
  }
}

export async function uploadImagem(req, res) {
  // Cria um objeto com os dados do novo post, incluindo o nome da imagem
  const novoPost = {
    descricao: "",
    imgUrl: req.file.originalname,
    alt: ""
  };

  try {
    // Chama a função para criar um novo post no banco de dados
    const postCriado = await criarPost(novoPost);
    // Gera um novo nome para a imagem, utilizando o ID do post criado
    const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
    // Renomeia o arquivo da imagem para o novo nome
    fs.renameSync(req.file.path, imagemAtualizada);
    // Envia o post criado como resposta em formato JSON com status 200 (sucesso)
    res.status(200).json(postCriado);
  } catch (erro) {
    // Imprime o erro no console para depuração
    console.error(erro.message);
    // Envia uma resposta com status 500 (erro interno do servidor) e uma mensagem de erro genérica
    res.status(500).json({"Erro":"Falha na requisição"})
  }
}

export async function atualizarNovoPost(req, res) {
  // Obtém os dados do novo post do corpo da requisição
  const id = req.params.id;
  const urlImagem = `http://localhost:3000/${id}.png`;

  try {
    const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
    const descricao = await gerarDescricaoComGemini(imgBuffer);
    const post = {
      imgUrl: urlImagem,
      descricao: descricao,
      alt: req.body.alt
    }
    // Chama a função para criar um novo post no banco de dados
    const postCriado = await atualizarPost(id, post);
    // Envia o post criado como resposta em formato JSON com status 200 (sucesso)
    res.status(200).json(postCriado);
  } catch (erro) {
    // Imprime o erro no console para depuração
    console.error(erro.message);
    // Envia uma resposta com status 500 (erro interno do servidor) e uma mensagem de erro genérica
    res.status(500).json({"Erro":"Falha na requisição"})
  }
} 