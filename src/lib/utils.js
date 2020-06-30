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

    return {
      iso: `${year}-${month}-${day}`,
      format: `${day}/${month}/${year}`
    };
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

  grade: function(shools) {
    switch (shools) {
      case '5ef':
        return '5º Ano do Ensino Fundamental';
      case '6ef':
        return '6º Ano do Ensino Fundamental';
      case '7ef':
        return '7º Ano do Ensino Fundamental';  
      case '8ef':
        return '8º Ano do Ensino Fundamental';
      case '9ef':
        return '9º Ano do Ensino Fundamental';
      case '1em':
        return '1º Ano do Ensino Médio'; 
      case '2em':
        return '2º Ano do Ensino Médio'; 
      default:
        return '3º Ano do Ensino Médio'; 
    }
  }
}