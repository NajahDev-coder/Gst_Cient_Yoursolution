const dotenv = require( 'dotenv');
const mysql = require( 'mysql');
dotenv.config();
const db = mysql.createConnection({
  host     : process.env.HOST,
  user     : process.env.USER,
  port     : process.env.PORT,
  password : process.env.PASS,
  database : process.env.DB
});
module.exports = db;