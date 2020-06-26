const express = require('express');

const teachers = require('./teachers');

//Express da a variável a responsabilidade pelas rotas
const routes = express.Router();

//Rota tipo GET para a página principal
routes.get('/', function(req, res) {
  return res.redirect('/teachers');
});

//Rota tipo GET para a página principal
routes.get('/teachers', function(req, res) {
  return res.render('teachers/index');
});

//Rota tipo GET para a página de create instructors
routes.get('/teachers/create', function(req, res) {
  return res.render('teachers/create');
});

//Rota tipo GET para a página de teachers daseado no id
routes.get('/teachers/:id', teachers.show);

routes.get('/teachers/:id/edit', teachers.edit);

//Rota tipo POST para recepção dos dados do professor
routes.post('/teachers', teachers.post);

//Rota tipo GET para a página principal
routes.get('/students', function(req, res) {
  return res.render('students/index');
});

//Exportando a variável routes
module.exports = routes;