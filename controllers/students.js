//File System
const fs = require('fs');
const data = require('../data.json');

const { age, graduation, date, grade } = require('../utils');

// === Método Index ===
exports.index = function(req, res) {
  let students = []

  let school = {}

  for(let i = 0; i < data.students.length; i++) {
    school = {
      ...data.students[i],
      school: grade(data.students[i].school)
    }

    students.push(school)
  }

  return res.render('students/index', { students });
}

// === Método Show ===
exports.show = function(req, res) {
  //Pega o id que está vindo como parametro na url
  const { id } = req.params;
  
  /*Se algum id de professor for igual ao id passado pela url
  os dados do professor serão guardados na variável foundInstructor */
  const foundStudents = data.students.find(function(student) {
    return student.id == id
  });

  //Se não for achado nenhum professor com id igual ao da url é retornada uma mensagem
  if(!foundStudents) return res.send('Student not found!');

  const student = {
    //Espalhando dados no objeto
    ...foundStudents,
    age: age(foundStudents.birth),
    school: grade(foundStudents.school),
  }

  //Caso seja achado é renderizada a página de detalhes do professor com seus dados
  return res.render('students/show', { student });
}
// === Método Create ===
exports.create = function(req, res) {
  return res.render('students/create');
}

// === Método Post ===
exports.post = function(req, res) {
  //Variáveis recebendo um array com todos os campos do formulário
  const keys = Object.keys(req.body);

  //Percorrendo o array keys
  for(let key of keys){
    //Verificando a existencia de valores em cada uma das chaves do req.body
    if(req.body[key] == "" || req.body[key] == "Escolha uma opção") {
      return res.send('Please, fill all fields!');
    }
  }

  let { 
    avatar_url, 
    name, 
    birth, 
    email,
    school,
    hours,
  } = req.body;

  //Converter a data de nascimento em timestamp
  birth = Date.parse(birth)
  //Pego o ultimo estudante do array
  const lastStudent = data.students[data.students.length - 1]
  //Inicio o id com 1
  let id = 1;
  //Se lastStudent não estiver vazio ele guarda o lastStudent.id + 1 na variável id
  if(lastStudent) id = lastStudent.id + 1;

  //Adiciona um novo objetivo ao final do array de students
  data.students.push({
    id,
    avatar_url, 
    name, 
    birth, 
    email,
    school,
    hours,
  })

  //escrevendo no arquivo data.json,
  //Convertendo req.body em json,
  //CallBack = não deixa o sistema travado esperando a finalização do processamento
  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(error) {
    if(error) return res.send("Write file error!")

    return res.redirect("/students")
  });
}

// === Método Edit ===
exports.edit = function(req, res) {
    //Pega o id que está vindo como parametro na url
    const { id } = req.params;

    //Se algum id de instrutores for igual ao id passado pela url
    //os dados do instrutor serão guardados na variável foundInstructor
    const foundStudents = data.students.find(function(student) {
      return student.id == id
    });
  
    //Se não for achado nenhum instrutor com id igual ao da url é retornada uma mensagem
    if(!foundStudents) return res.send('Student not found!');
  
    const student = {
      ...foundStudents,
      birth: date(foundStudents.birth).iso,
    }
    
    return res.render('students/edit', { student })
}

// === Método Put ===
exports.put = function(req, res) {
  //Pega o id que está vindo no corpo da requisição
  const { id } = req.body;

  let index = 0;
  
  /*Se algum id de professor for igual ao id passado corpo da requisição
  os dados do professor serão guardados na variável foundStudents */
  const foundStudents = data.students.find(function(student, foundIndex) {
    if (id == student.id) {
      index = foundIndex;
      return true;
    }
  });

  //Se não for achado nenhum professor com id igual ao da url é retornada uma mensagem
  if(!foundStudents) return res.send('Student not found!');

  const cod = Number(id);

  const student = {
    ...foundStudents,
    ...req.body,
    id: cod,
    birth: Date.parse(req.body.birth),
  }

  data.students[index] = student;

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(error) {
    if(error) return res.send('Write error!');

    return res.redirect(`students/${id}`)
  })
}

// === Método Delete ===
exports.delete = function(req, res) {
  const { id } = req.body;

  const filteredStudent = data.students.filter(function(student) {
    return id != student.id;
  });

  data.students = filteredStudent;

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(error) {
    if(error) return res.send('Write error!');

    return res.redirect('/students');
  })
}