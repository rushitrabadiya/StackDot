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

exports.getAllMediums = async (req, res) => {
  try {
    const { instituteId, boardId } = req.params;

    // cheak a board its belongs to the institute
    const [board] = await connection.execute(
      "SELECT * FROM Board WHERE board_id = ? AND institute_id = ?",
      [boardId, instituteId]
    );

    if (board.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Board not found for this institute",
      });
    }

    const [mediums] = await connection.execute(
      "SELECT * FROM Medium WHERE board_id = ?",
      [boardId]
    );

    res.status(200).json({
      status: "success",
      result: mediums.length,
      data: {
        mediums,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err.message });
  }
};

exports.getMedium = async (req, res) => {
  try {
    const { instituteId, boardId, mediumId } = req.params;

    // cheak a board its belongs to the institute
    const [board] = await connection.execute(
      "SELECT * FROM Board WHERE board_id = ? AND institute_id = ?",
      [boardId, instituteId]
    );

    if (board.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Board not found for this institute",
      });
    }

    const [medium] = await connection.execute(
      "SELECT * FROM Medium WHERE medium_id = ? AND board_id = ?",
      [mediumId, boardId]
    );

    if (medium.length === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Medium not found for this board" });
    }

    res.status(200).json({
      status: "success",
      data: {
        medium: medium[0],
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err.message });
  }
};

exports.createMedium = async (req, res) => {
  try {
    const boardId = req.params.boardId;

    if (!req.body.medium_name) {
      return res.status(400).json({
        status: "fail",
        message: "Medium name is required",
      });
    }

    const [result] = await connection.execute(
      "INSERT INTO Medium (medium_name, board_id) VALUES (?, ?)",
      [req.body.medium_name, boardId]
    );
    const [newMedium] = await connection.execute(
      "SELECT * FROM Medium WHERE medium_id = ?",
      [result.insertId]
    );
    res.status(201).json({
      status: "success",
      data: {
        medium: newMedium[0],
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateMedium = async (req, res) => {
  try {
    const { instituteId, boardId, mediumId } = req.params;

    // cheak a board its belongs to the institute
    const [board] = await connection.execute(
      "SELECT * FROM Board WHERE board_id = ? AND institute_id = ?",
      [boardId, instituteId]
    );

    if (board.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Board not found for this institute",
      });
    }

    await connection.execute(
      "UPDATE Medium SET medium_name = ? WHERE medium_id = ? AND board_id = ?",
      [req.body.medium_name, mediumId, boardId]
    );

    const [updatedMedium] = await connection.execute(
      "SELECT * FROM Medium WHERE medium_id = ? AND board_id = ?",
      [mediumId, boardId]
    );

    if (updatedMedium.length === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Medium not found" });
    }

    res.status(200).json({
      status: "success",
      data: {
        medium: updatedMedium[0],
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err.message });
  }
};

exports.deleteMedium = async (req, res) => {
  try {
    const { instituteId, boardId, mediumId } = req.params;

    // cheak a board its belongs to the institute
    const [board] = await connection.execute(
      "SELECT * FROM Board WHERE board_id = ? AND institute_id = ?",
      [boardId, instituteId]
    );

    if (board.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Board not found for this institute",
      });
    }

    await connection.execute(
      "DELETE FROM Medium WHERE medium_id = ? AND board_id = ?",
      [mediumId, boardId]
    );

    res.status(204).json({
      status: "success",
      message: "Medium deleted successfully",
      data: {
        medium: null,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err.message });
  }
};
