//File System
const fs = require('fs');
const data = require('./data.json');

const { age, graduation, date } = require('./utils');

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
exports.post = function(req, res) {
  //Variáveis recebendo um array com todos os campos do formulário
  const keys = Object.keys(req.body);

  console.log(req.body);

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
      birth: date(foundTeachers.birth),
    }
    
    return res.render('teachers/edit', { teacher })
}