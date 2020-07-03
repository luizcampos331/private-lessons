const Student = require('../models/Student');
const { age, date, grade } = require('../../lib/utils');

module.exports = {
  // === Método Index - Visualizar página ===
  index(req, res) {
    //Obtendo parametros passados pela URL (query usado após o ? em uma URL)
    let { filter, page, limit } = req.query;

    //page recebe ele mesmo ou 1 caso ele esteja vazio
    page = page || 1;
    //limit recebe ele mesmo ou 2 caso ele esteja vazio
    limit = limit || 2;
    //Tendo os valores padrões acima, offset recebe 2 * (1 - 1) = 0
    let offset = limit * (page - 1);

    // Cria objeto params
    const params = {
      filter,
      limit,
      offset,
      callback(students) {
        const pagination = {
          //Math.ceil arredonda para cima
          total: Math.ceil(students[0].total / limit),
          page
        }

        //Percorre o array de instrutors
        for(let i = 0; i < students.length; i++){
          //Separa os serviços dos instrutores em um array de serviços para apresentação
          students[i].school = grade(students[i].school);
        }
        //Retorna página de instrutores renderizada
        return res.render('students/index', { students, pagination, filter });
      }
    }

    // Inicia o paginate passado o objeto params como parametro
    Student.paginate(params);
  },

  // === Método Create - Visualizar página ===
  create(req, res) {
    Student.teacherSelectOptions(function(options) {
      return res.render('students/create', { teacherOptions: options});
    })
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

      return res.render(`students/show`, { student });
    });
  },

  // === Método Edit - Visualizar página ===
  edit(req, res) {
    Student.find(req.params.id, function(student) {

      student.birth = date(student.birth).iso;

      Student.teacherSelectOptions(function(options) {

        return res.render(`students/edit`, { student, teacherOptions: options});
      })
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