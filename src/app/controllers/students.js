const Student = require('../models/Student');
const { age, date, grade } = require('../../lib/utils');

module.exports = {
  // === Método Index - Visualizar página ===
  index(req, res) {
    Student.all(function(students) {

      for(let i = 0; i < students.length; i++) {
        students[i].school = grade(students[i].school);
      }
      
      return res.render('students/index', { students })
    })
  },

  // === Método Create - Visualizar página ===
  create(req, res) {
    return res.render('students/create');
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

    Student.create(req.body, function(student) {

      return res.redirect(`/students/${student.id}`);
    });
  },

  // === Método Show - Visualizar página ===
  show(req, res) {
    Student.find(req.params.id, function(student) {

      student.age = age(student.birth);
      student.school = grade(student.school);
      student.created_at = date(student.created_at).format;

      return res.render(`students/show`, { student});
    });
  },

  // === Método Edit - Visualizar página ===
  edit(req, res) {
    Student.find(req.params.id, function(student) {

      student.birth = date(student.birth).iso;

      return res.render(`students/edit`, { student});
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

    Student.update(req.body, function() {

      return res.redirect(`/students/${req.body.id}`);
    })
  },

  // === Método Delete - Ação ===
  delete(req, res) {
    Student.delete(req.body.id, function() {

      return res.redirect('/students');
    })
  }
}