//File System
const fs = require('fs');
const data = require('./data.json');

// === Método Create ===
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

  let { avatar_url, name, birth, education_level, type_class, field } = req.body;

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
    education_level,
    type_class,
    field,
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