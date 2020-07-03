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
        teacher_id
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
      data.teacher_id
    ]

    db.query(query, values, function(error, results) {
      if(error) throw `Database INSERT Error!${error}`

      callback(results.rows[0])
    })
  },

  // === SELECT id ===
  find(id, callback) {
    const query = `
      SELECT stu.*, tea.name as teacher_name
      FROM students stu 
      LEFT JOIN teachers tea ON stu.teacher_id = tea.id
      WHERE stu.id = $1
    `;

    db.query(query, [id], function(error, results) {
      if(error) `Database SELECT Id Error!${error}`;

      callback(results.rows[0]);
    })
  },

  findBy(filter, callback) {
    const query = `
      SELECT stu.*, count(stu.name) as total_students
      FROM students stu 
      LEFT JOIN teachers tea ON stu.teacher_id = tea.id 
      WHERE stu.name ILIKE '%${filter}%' OR tea.name ILIKE '%${filter}%'
      GROUP BY stu.id
    `;

    // === SELECT FILTER ===
    db.query(query, function(error, results) {
      if(error) throw `Database SELECT FILTER Error!${error}`;

      callback(results.rows);
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
        hours = ($6),
        teacher_id = ($7)
      WHERE id = $8
    `;

    const values = [
      data.avatar_url,
      data.name,
      date(data.birth).iso,
      data.email,
      data.school,
      data.hours,
      data.teacher_id,
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
  },

  teacherSelectOptions(callback) {
    db.query(`SELECT id, name FROM teachers`, function(error, results) {
      if(error) throw `Database TEACHER Error!${error}`;

      callback(results.rows);
    });
  },

  paginate(params) {
    //Desconstruindo objeto "params"
    const { filter, limit, offset, callback } = params;

    //Iniciando as variável query em bracno, filter em branco e totalQuery como subquery
    let query = '',
        filterQuery = '',
        totalQuery = `(SELECT count(*) FROM students stu) AS total`;

    //Caso exista valor dentro do filter
    if(filter) {
      //A variável recebe parte da query
      filterQuery = `
        WHERE stu.name ILIKE '%${filter}%'
      `;

      //Subquery completada
      totalQuery = `
        (SELECT count(*) FROM students stu
        ${filterQuery}) AS total
      `;
    }

    //Query completa
    query = `
      SELECT *, ${totalQuery}
      FROM students stu
      ${filterQuery}
      ORDER BY stu.name LIMIT $1 OFFSET $2
    `;

    //Operação no banco de dados
    db.query(query, [ limit, offset ], function(error, results) {
      if(error) throw `Database PAGINATION Error!${error}`;
      callback(results.rows);
    });
  }
}