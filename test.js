import http from 'mysql2';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'123456',
    database: 'hello'
  });
  
  // simple query
  connection.query(
    'SELECT * FROM student',
    function(err, results, fields) {
      console.log(results); // results contains rows returned by server
      console.log(fields); // fields contains extra meta data about results, if available
    }
  );