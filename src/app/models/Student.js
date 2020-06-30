const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {
  // === SELETC * ===
  all(callback) {
    //Operação no banco de dados
    db.query('SELECT * FROM students', function(error, results) {
      if(error) throw `Database SELECT Error!${error}`;

      //Retornando os resultados para o controller
      callback(results.rows);
    })
  },

  // === INSERT ===
  create(data, callback) {
    const query = `
      INSERT INTO students (
        avatar_url,
        name,
        birth,
        email,
        school,
        hours,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;

    const values = [
      data.avatar_url,
      data.name,
      date(data.birth).iso,
      data.email,
      data.school,
      data.hours,
      date(Date.now()).iso
    ]

    db.query(query, values, function(error, results) {
      if(error) throw `Database INSERT Error!${error}`

      callback(results.rows[0])
    })
  },

  // === SELECT id ===
  find(id, callback) {
    db.query(`SELECT * FROM students WHERE id = $1`, [id], function(error, results) {
      if(error) `Database SELECT Id Error!${error}`;

      callback(results.rows[0]);
    })
  },

  // === UPDATE id ===
  update(data, callback) {
    const query = `
      UPDATE students SET
        avatar_url = ($1),
        name = ($2),
        birth = ($3),
        email = ($4),
        school = ($5),
        hours = ($6)
      WHERE id = $7
    `;

    const values = [
      data.avatar_url,
      data.name,
      date(data.birth).iso,
      data.email,
      data.school,
      data.hours,
      data.id
    ];

    db.query(query, values, function(error, results) {
      if(error) throw `Database UPDATE Error!${error}`;

      callback();
    });
  },

  // === DELETE id ===
  delete(id, callback) {
    db.query(`DELETE FROM students WHERE id = $1`, [id], function(error, results) {
      if(error) throw `Database DELETE Error!${error}`;

      callback();
    })
  }
}