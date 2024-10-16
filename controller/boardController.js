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

exports.getAllBoards = async (req, res) => {
  try {
    const instituteId = req.params.id;
    const [boards] = await connection.execute(
      "SELECT * FROM Board WHERE institute_id = ?",
      [instituteId]
    );
    res.status(200).json({
      status: "success",
      result: boards.length,
      data: {
        boards,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err.message });
  }
};

exports.getBoard = async (req, res) => {
  try {
    const [board] = await connection.execute(
      "SELECT * FROM Board WHERE board_id = ?",
      [req.params.boardId]
    );

    if (board.length === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Board not found" });
    }

    res.status(200).json({
      status: "success",
      data: {
        board: board[0],
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err.message });
  }
};

exports.createBoard = async (req, res) => {
  try {
    if (!req.body.board_name) {
      return res.status(400).json({
        status: "fail",
        message: "Board name is required",
      });
    }
    const instituteId = req.params.id;

    const [result] = await connection.execute(
      "INSERT INTO Board (board_name, institute_id) VALUES (?, ?)",
      [req.body.board_name, instituteId]
    );
    const [newBoard] = await connection.execute(
      "SELECT * FROM Board WHERE board_id = ?",
      [result.insertId]
    );
    res.status(201).json({
      status: "success",
      data: {
        board: newBoard[0],
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateBoard = async (req, res) => {
  try {
    await connection.execute(
      "UPDATE Board SET board_name = ? WHERE board_id = ?",
      [req.body.board_name, req.params.boardId]
    );
    const [updatedBoard] = await connection.execute(
      "SELECT * FROM Board WHERE board_id = ?",
      [req.params.boardId]
    );
    if (updatedBoard.length === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Board not found" });
    }
    res.status(200).json({
      status: "success",
      data: {
        board: updatedBoard[0],
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err.message });
  }
};

exports.deleteBoard = async (req, res) => {
  try {
    await connection.execute("DELETE FROM Board WHERE board_id = ?", [
      req.params.boardId,
    ]);
    res.status(204).json({
      status: "success",
      message: "Board deleted successfully",
      data: {
        board: null,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err.message });
  }
};
