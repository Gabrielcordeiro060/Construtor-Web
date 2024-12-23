const express = require('express');
const sqlite3 = require('sqlite3').verbose(); // Importa o sqlite3
const cors = require('cors');

const app = express();

// Middleware para processar JSON e habilitar CORS
app.use(express.json()); // Substitui body-parser (mais moderno)
app.use(cors());
app.use(express.static('public')); // Servir arquivos estáticos (HTML, CSS, JS)

// Conectar ao banco de dados SQLite
const db = new sqlite3.Database('./inscricoes.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite!');
  }
});

// Criar a tabela de inscrições se ela não existir
db.run(
  `CREATE TABLE IF NOT EXISTS inscricoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL
  )`,
  (err) => {
    if (err) {
      console.error('Erro ao criar a tabela:', err.message);
    } else {
      console.log('Tabela de inscrições criada ou já existe.');
    }
  }
);

// Rota para processar os dados enviados pelo formulário
app.post('/inscrever', (req, res) => {
  const { nome, email, phone } = req.body;

  console.log('Dados recebidos:', { nome, email, phone });

  // Validar os dados do formulário
  if (!nome || !email || !phone) {
    console.log('Erro: Campos obrigatórios ausentes.');
    res.status(400).json({ mensagem: 'Todos os campos são obrigatórios!' });
    return;
  }

  // Insere os dados no banco de dados
  const query = `INSERT INTO inscricoes (nome, email, phone) VALUES (?, ?, ?)`;
  db.run(query, [nome, email, phone], function (err) {
    if (err) {
      console.error('Erro ao inserir dados no banco:', err.message);
      res.status(500).json({ mensagem: 'Erro ao registrar a inscrição. Tente novamente!' });
    } else {
      console.log(`Novo registro inserido com ID: ${this.lastID}`);
      res.status(200).json({ mensagem: 'Inscrição realizada com sucesso!' });
    }
  });
});

// Iniciar o servidor na porta 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});



