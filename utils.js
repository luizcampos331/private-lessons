module.exports = {
  age: function(timestamp) {
    const today = new Date();
    const birthDate = new Date(timestamp);

    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();

    if(month < 0 || month == 0 && today.getDate() <= birthDate.getDate())
      age -= 1;
    
    return age;
  },
  graduation: function(level) {
    switch (level) {
      case 'medio':
        return 'Ensino médio completo';
      case 'superior': 
        return 'Ensino superior completo';
      case 'mestrado':
        return 'Mestrado';
      default:
        return 'Doutorado'
    }
  },
  date: function(timestamp) {
    const date = new Date(timestamp);

    //Pega o ano yyyy
    const year = date.getUTCFullYear();

    //Pega o mês mm, os meses são contados de 0 a 11, por isso o +1
    //as crases colocam zempre um zero no frente do valor, porém, o slice
    //só pega os ultimos dois caracteres
    const month = `0${date.getUTCMonth() + 1}`.slice(-2);

    //Pega o dia dd
    const day = `0${date.getUTCDate()}`.slice(-2);

    return `${year}-${month}-${day}`;
  }
}