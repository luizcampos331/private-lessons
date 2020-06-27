const express = require('express');

const teachers = require('./controllers/teachers');
const students = require('./controllers/students');

//Express da a variável a responsabilidade pelas rotas
const routes = express.Router();


//Rota tipo GET para a página principal
routes.get('/', function(req, res) {
  return res.redirect('/teachers');
});

/* === Rotas - Professores === */
//Rota tipo GET para página de professores
routes.get('/teachers', teachers.index);
//Rota tipo GET para a página de criação de professores
routes.get('/teachers/create', teachers.create);
//Rota tipo GET para a página de detalhes de um professor
routes.get('/teachers/:id', teachers.show);
//Rota tipo GET para página de ediçào dos professores
routes.get('/teachers/:id/edit', teachers.edit);
//Rota tipo POST para crição de um professor
routes.post('/teachers', teachers.post);
//Rota tipo PUT para alteração dos dados de um professor
routes.put('/teachers', teachers.put);
//Rota tipo DELETE para exclusão de um professor
routes.delete('/teachers', teachers.delete);

/* === Totas - Alunos === */
//Rota tipo GET para página de professores
routes.get('/students', students.index);
//Rota tipo GET para a página de criação de professores
routes.get('/students/create', students.create);
//Rota tipo GET para a página de detalhes de um estudante
routes.get('/students/:id', students.show);
//Rota tipo GET para página de ediçào dos professores
routes.get('/students/:id/edit', students.edit);
//Rota tipo POST para crição de um professor
routes.post('/students', students.post);
//Rota tipo PUT para alteração dos dados de um professor
routes.put('/students', students.put);
//Rota tipo DELETE para exclusão de um professor
routes.delete('/students', students.delete);


//Exportando a variável routes
module.exports = routes;