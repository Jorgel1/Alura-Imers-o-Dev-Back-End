import express from "express"; // Importa o módulo Express para criar o servidor web
import multer from "multer"; // Importa o módulo Multer para lidar com uploads de arquivos

// Importa as funções controladoras para posts
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsController.js";
import cors from "cors";

const corsOptions = {
  origin: "http://localhost:8000",
  optionsSuccessStatus: 200
}

// Configura o armazenamento de arquivos para o Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) { // Define o diretório destino para os arquivos enviados
    cb(null, 'uploads/'); // Define o caminho do diretório como 'uploads/'
  },
  filename: function (req, file, cb) { // Define o nome do arquivo salvo
    cb(null, file.originalname); // Utiliza o nome original do arquivo enviado
  }
})

// Cria uma instância do middleware Multer com as configurações de armazenamento
const upload = multer({ dest: "./uploads", storage }); // Define o diretório destino e o armazenamento
// Comentário alternativo para Linux/Mac:
// const upload = multer({ dest: "./uploads" }) // Define apenas o diretório destino (sem storage para Linux/Mac)

const routes = (app) => {
  // Habilita o servidor para receber dados no formato JSON
  app.use(express.json());
  app.use(cors(corsOptions));

  // Rota GET para listar todos os posts
  app.get("/posts", listarPosts); 

  // Rota POST para criar um novo post
  app.post("/posts", postarNovoPost);

  // Rota POST para upload de imagem
  app.post("/upload", upload.single("imagem"), uploadImagem); // Utiliza o middleware Multer para upload da imagem e chama a função uploadImagem
  
  app.put("/upload/:id", atualizarNovoPost);
};


export default routes; // Exporta a função routes para ser utilizada em outros arquivos