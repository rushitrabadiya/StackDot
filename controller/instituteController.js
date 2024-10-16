const mysql = require("mysql2/promise");

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

exports.getAllInstitute = async (req, res) => {
  try {
    const [institutes] = await connection.execute("SELECT * FROM Institute");
    res.status(200).json({
      status: "success",
      result: institutes.length,
      data: {
        institutes,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

exports.getInstitute = async (req, res) => {
  try {
    const [institute] = await connection.execute(
      "SELECT * FROM Institute WHERE institute_id = ?",
      [req.params.id]
    );

    if (institute.length === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Institute not found" });
    }

    res.status(200).json({
      status: "success",
      data: {
        institute: institute[0],
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err.message });
  }
};

exports.updateInstitute = async (req, res) => {
  try {
    await connection.execute(
      "UPDATE Institute SET institute_type = ? WHERE institute_id = ?",
      [req.body.institute_type, req.params.id]
    );
    const [updatedInstitute] = await connection.execute(
      "SELECT * FROM Institute WHERE institute_id = ?",
      [req.params.id]
    );
    if (updatedInstitute.length === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Institute not found" });
    }
    res.status(200).json({
      status: "success",
      data: {
        institute: updatedInstitute[0],
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

exports.deleteInstitute = async (req, res) => {
  try {
    await connection.execute("DELETE FROM Institute WHERE institute_id = ?", [
      req.params.id,
    ]);
    res.status(204).json({
      status: "success",
      message: "Delete institute",
      data: {
        institute: null,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

exports.createInstitute = async (req, res) => {
  try {
    if (!req.body.institute_type) {
      return res.status(400).json({
        status: "fail",
        message: "institude type is required",
      });
    }

    const [result] = await connection.execute(
      "INSERT INTO Institute (institute_type) VALUES (?)",
      [req.body.institute_type]
    );
    const [newInstitute] = await connection.execute(
      "SELECT * FROM Institute WHERE institute_id = ?",
      [result.insertId]
    );
    res.status(201).json({
      status: "success",
      data: {
        institute: newInstitute[0],
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
