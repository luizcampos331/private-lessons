const Teacher = require('../models/Teacher');
const { age, date, graduation } = require('../../lib/utils');

module.exports = {
  // === Método Index - Visualizar página ===
  index(req, res) {
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
      callback(teachers) {
        const pagination = {
          //Math.ceil arredonda para cima
          total: Math.ceil(teachers[0].total / limit),
          page
        }

        //Percorre o array de instrutors
        for(let i = 0; i < teachers.length; i++){
          //Separa os serviços dos instrutores em um array de serviços para apresentação
          teachers[i].fields = teachers[i].fields.split(',');
        }
        //Retorna página de instrutores renderizada
        return res.render('teachers/index', { teachers, pagination, filter });
      }
    }

    // Inicia o paginate passado o objeto params como parametro
    Teacher.paginate(params);
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