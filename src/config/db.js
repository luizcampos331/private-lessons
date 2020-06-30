const { Pool } = require('pg');

module.exports = new Pool({
  user: 'luiz',
  password: '',
  host: 'localhost',
  port: 5432,
  database: 'private_lessons'
});