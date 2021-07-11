const mysql = require("mysql2");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  multipleStatements: true,
  password: "8214778Gad",
  database: "cars-data",
});

const sqlQurayPromise = (query) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(query, (err, results) => {
        if (err) reject(err);
        resolve(results);
        connection.release();
      });
    });
  });
};

module.exports = sqlQurayPromise;
