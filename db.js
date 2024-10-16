var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "system",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  
  // con.query(
  //   "CREATE TABLE Institute ( institute_id INT AUTO_INCREMENT PRIMARY KEY,institute_type VARCHAR(50) )",
  //   function (err, result) {
  //     if (err) throw err;
  //     console.log("Table created");
  //   }
  // );
});
