const Teacher = require('../models/Teacher');
const { age, date, graduation } = require('../../lib/utils');

module.exports = {
  // === Método Index - Visualizar página ===
  index(req, res) {
    Teacher.all(function(teachers) {

      for(let i = 0; i < teachers.length; i++) {
        teachers[i].fields = teachers[i].fields.split(',');
      }
      
      return res.render('teachers/index', { teachers })
    })
  },

  // === Método Create - Visualizar página ===
  create(req, res) {
    return res.render('teachers/create');
  },

  // === Método Post - Ação ===
  post(req, res) {
    //Variáveis recebendo um array com todos os campos do formulário
    const keys = Object.keys(req.body);

    //Percorrendo o array keys
    for(let key of keys){
      //Verificando a existencia de valores em cada uma das chaves do req.body
      if(req.body[key] == "")
        return res.send('Please, fill all fields!');
    }

    Teacher.create(req.body, function(teacher) {

      return res.redirect(`/teachers/${teacher.id}`);
    });
  },

  // === Método Show - Visualizar página ===
  show(req, res) {
    Teacher.find(req.params.id, function(teacher) {

      teacher.graduation = graduation(teacher.graduation)
      teacher.fields = teacher.fields.split(',');
      teacher.age = age(teacher.birth);
      teacher.created_at = date(teacher.created_at).format;

      return res.render(`teachers/show`, { teacher});
    });
  },

  // === Método Edit - Visualizar página ===
  edit(req, res) {
    Teacher.find(req.params.id, function(teacher) {

      teacher.birth = date(teacher.birth).iso;

      return res.render(`teachers/edit`, { teacher});
    });
  },

  // === Método Update - Ação ===
  put(req, res) {
    //Variáveis recebendo um array com todos os campos do formulário
    const keys = Object.keys(req.body);

    //Percorrendo o array keys
    for(let key of keys){
      //Verificando a existencia de valores em cada uma das chaves do req.body
      if(req.body[key] == "")
        return res.send('Please, fill all fields!');
    }

    Teacher.update(req.body, function() {

      return res.redirect(`/teachers/${req.body.id}`);
    })
  },

  // === Método Delete - Ação ===
  delete(req, res) {
    Teacher.delete(req.body.id, function() {

      return res.redirect('/teachers');
    })
  }
}