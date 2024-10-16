const mysql = require("mysql");

const app = require("./app");

let connection;

const connectToDatabase = async () => {
  connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "system",
  });
};
connectToDatabase().catch((err) =>
  console.error("Database connection failed:", err)
);

const port = 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
