const express = require('express');

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

//Rota tipo GET para a página principal
routes.get('/students', function(req, res) {
  return res.render('students/index');
});

//Exportando a variável routes
module.exports = routes;