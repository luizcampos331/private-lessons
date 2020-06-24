//Importando as funcionalidades do express em uma variável
const express = require('express');
//Importando as funcionalidade do nunjucks em uma variavel
const nunjucks = require('nunjucks');

//Importando as funcionalidades de routes em uma variável
const routes = require('./routes');

//Iniciando o express na variável server
const server = express();

//Server poderá usar arquivos estáticos (css) da pasta public
server.use(express.static('public'));
//Server irá usar as funcionalidades do routes
server.use(routes);

//setando que o server ira ser um motor de visualização (view engine) com arquivos njk
server.set('view engine', 'njk');

//configurando o nunjucks para a pasta de views
nunjucks.configure('views', {
  //definindo o uso do express e a variavel que o mesmo esta usando
  express: server,
  //permite tags html dentro de variáveis neste arquivo
  autoescape: false,
  //Não guardar cache
  noCache: true
});

//Server ouvindo pedidos na porta 5000
server.listen(5000);