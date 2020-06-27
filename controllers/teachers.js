//File System
const fs = require('fs');
const data = require('../data.json');

const { age, graduation, date } = require('../utils');

// === Método Index ===
exports.index = function(req, res) {
  let teachers = []

  let field = {}

  for(let i = 0; i < data.teachers.length; i++) {
    field = {
      ...data.teachers[i],
      fields: data.teachers[i].fields.split(',')
    }

    teachers.push(field)
  }

  return res.render('teachers/index', { teachers });
}

// === Método Show ===
exports.show = function(req, res) {
  //Pega o id que está vindo como parametro na url
  const { id } = req.params;
  
  /*Se algum id de professor for igual ao id passado pela url
  os dados do professor serão guardados na variável foundInstructor */
  const foundTeachers = data.teachers.find(function(teacher) {
    return teacher.id == id
  });

  //Se não for achado nenhum professor com id igual ao da url é retornada uma mensagem
  if(!foundTeachers) return res.send('Teacher not found!');

  const teacher = {
    //Espalhando dados no objeto
    ...foundTeachers,
    age: age(foundTeachers.birth),
    graduation: graduation(foundTeachers.graduation),
    fields: foundTeachers.fields.split(','),
    //Intl.DateTimeFormat é um construtor para objetos que permitem formatação
    //de data e hora sensíveis ao idioma
    created_at: new Intl.DateTimeFormat('pt-BR').format(foundTeachers.created_at),
  }

  //Caso seja achado é renderizada a página de detalhes do professor com seus dados
  return res.render('teachers/show', { teacher });
}

// === Método Create ===
exports.create = function(req, res) {
  return res.render('teachers/create');
}

// === Método Post ===
exports.post = function(req, res) {
  //Variáveis recebendo um array com todos os campos do formulário
  const keys = Object.keys(req.body);

  //Percorrendo o array keys
  for(let key of keys){
    //Verificando a existencia de valores em cada uma das chaves do req.body
    if(req.body[key] == "" || req.body[key] == "Escolha uma escolaridade") {
      return res.send('Please, fill all fields!');
    }
  }

  let { avatar_url, name, birth, graduation, type_class, fields } = req.body;

  //Converter a data de nascimento em timestamp
  birth = Date.parse(birth)
  //Criando de data de criação
  const created_at = Date.now();
  //Criação de ID único
  const id = Number(data.teachers.length + 1);

  //Adiciona um novo objetivo ao final do array de teachers
  data.teachers.push({
    id,
    avatar_url,
    name,
    birth,
    graduation,
    type_class,
    fields,
    created_at,
  })

  //escrevendo no arquivo data.json,
  //Convertendo req.body em json,
  //CallBack = não deixa o sistema travado esperando a finalização do processamento
  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(error) {
    if(error) return res.send("Write file error!")

    return res.redirect("/teachers")
  });
}

// === Método Edit ===
exports.edit = function(req, res) {
    //Pega o id que está vindo como parametro na url
    const { id } = req.params;

    //Se algum id de instrutores for igual ao id passado pela url
    //os dados do instrutor serão guardados na variável foundInstructor
    const foundTeachers = data.teachers.find(function(teacher) {
      return teacher.id == id
    });
  
    //Se não for achado nenhum instrutor com id igual ao da url é retornada uma mensagem
    if(!foundTeachers) return res.send('Teacher not found!');
  
    const teacher = {
      ...foundTeachers,
      birth: date(foundTeachers.birth).iso,
    }
    
    return res.render('teachers/edit', { teacher })
}

// === Método Update ===
exports.put = function(req, res) {
  //Pega o id que está vindo no corpo da requisição
  const { id } = req.body;

  let index = 0;
  
  /*Se algum id de professor for igual ao id passado corpo da requisição
  os dados do professor serão guardados na variável foundTeachers */
  const foundTeachers = data.teachers.find(function(teacher, foundIndex) {
    if (id == teacher.id) {
      index = foundIndex;
      return true;
    }
  });

  //Se não for achado nenhum professor com id igual ao da url é retornada uma mensagem
  if(!foundTeachers) return res.send('Teacher not found!');

  const cod = Number(id);

  const teacher = {
    ...foundTeachers,
    ...req.body,
    id: cod,
    birth: Date.parse(req.body.birth),
  }

  data.teachers[index] = teacher;

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(error) {
    if(error) return res.send('Write error!');

    return res.redirect(`teachers/${id}`)
  })
}

// === Método Delete ===
exports.delete = function(req, res) {
  const { id } = req.body;

  const filteredTeacher = data.teachers.filter(function(teacher) {
    return id != teacher.id;
  });

  data.teachers = filteredTeacher;

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(error) {
    if(error) return res.send('Write error!');

    return res.redirect('/teachers');
  })
}