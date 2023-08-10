const mysql = require("mysql2");
const util = require("util");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  connectTimeout: 20000,
});

db.connect((err) => {
  if (err) {
    return console.error(err);
  } else {
    console.log("Connected to mysql server");
  }
});

const query = util.promisify(db.query).bind(db);
module.exports = { db, query };
