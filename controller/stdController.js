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

exports.getAllStandards = async (req, res) => {
  try {
    const { instituteId, boardId, mediumId, sectionId } = req.params;

    // Cheak that the section belongs to the medium and the medium belongs to the board and the board belongs to the institute
    const [section] = await connection.execute(
      `SELECT s.* 
         FROM Section s
         JOIN Medium m ON s.medium_id = m.medium_id
         JOIN Board b ON m.board_id = b.board_id
         WHERE s.section_id = ? 
           AND m.board_id = ? 
           AND b.institute_id = ?`,
      [sectionId, boardId, instituteId]
    );

    if (section.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Section not found for this medium in the institute",
      });
    }

    const [standards] = await connection.execute(
      "SELECT * FROM Standard WHERE section_id = ?",
      [sectionId]
    );

    res.status(200).json({
      status: "success",
      result: standards.length,
      data: {
        standards,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

exports.getStandard = async (req, res) => {
  try {
    const { instituteId, boardId, mediumId, sectionId, standardId } =
      req.params;

    // check if the standard exists and belongs to the correct institute, board, medium, and section
    const sqlQuery = `
        SELECT s.* 
        FROM Standard s
        INNER JOIN Section sec ON s.section_id = sec.section_id
        INNER JOIN Medium m ON sec.medium_id = m.medium_id
        INNER JOIN Board b ON m.board_id = b.board_id
        WHERE s.standard_id = ? 
          AND sec.section_id = ? 
          AND m.medium_id = ? 
          AND b.board_id = ? 
          AND b.institute_id = ?`;

    // Execute the query and check if the standard exists
    const [standard] = await connection.execute(sqlQuery, [
      standardId,
      sectionId,
      mediumId,
      boardId,
      instituteId,
    ]);

    if (standard.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Standard not found for this section in the institute",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        standard: standard[0],
      },
    });
  } catch (err) {
    console.error("Error fetching standard:", err.message);
    res.status(500).json({
      status: "fail",
      message: "An error occurred while fetching the standard",
    });
  }
};

exports.createStandard = async (req, res) => {
  try {
    const { instituteId, boardId, mediumId, sectionId } = req.params;
    const standardName = req.body.standard_name;

    // Check if the board belongs to the institute and if the section is valid
    const [result] = await connection.execute(
      `SELECT s.section_id
           FROM Section s
           INNER JOIN Medium m ON s.medium_id = m.medium_id
           INNER JOIN Board b ON m.board_id = b.board_id
           WHERE s.section_id = ?
             AND b.board_id = ?
             AND b.institute_id = ?`,
      [sectionId, boardId, instituteId]
    );

    // If no section is found
    if (result.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Section not found for this board and institute",
      });
    }

    // Check if the standard name is provided
    if (!standardName) {
      return res.status(400).json({
        status: "fail",
        message: "Standard name is required",
      });
    }

    const [insertResult] = await connection.execute(
      "INSERT INTO Standard (standard_name, section_id) VALUES (?, ?)",
      [standardName, sectionId]
    );

    const [newStandard] = await connection.execute(
      "SELECT * FROM Standard WHERE standard_id = ?",
      [insertResult.insertId]
    );

    res.status(201).json({
      status: "success",
      data: {
        standard: newStandard[0],
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateStandard = async (req, res) => {
  try {
    const { instituteId, boardId, mediumId, sectionId, standardId } =
      req.params;
    const standardName = req.body.standard_name;

    const [standard] = await connection.execute(
      `SELECT s.* 
         FROM Standard s
         JOIN Section sec ON s.section_id = sec.section_id
         JOIN Medium m ON sec.medium_id = m.medium_id
         JOIN Board b ON m.board_id = b.board_id
         WHERE s.standard_id = ? 
           AND sec.section_id = ? 
           AND m.board_id = ? 
           AND b.institute_id = ?`,
      [standardId, sectionId, boardId, instituteId]
    );

    if (standard.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Standard not found for this section in the institute",
      });
    }

    if (!standardName) {
      return res.status(400).json({
        status: "fail",
        message: "Standard name is required",
      });
    }

    await connection.execute(
      "UPDATE Standard SET standard_name = ? WHERE standard_id = ? AND section_id = ?",
      [standardName, standardId, sectionId]
    );

    const [updatedStandard] = await connection.execute(
      "SELECT * FROM Standard WHERE standard_id = ?",
      [standardId]
    );

    res.status(200).json({
      status: "success",
      data: {
        standard: updatedStandard[0],
      },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.deleteStandard = async (req, res) => {
  try {
    const { instituteId, boardId, mediumId, sectionId, standardId } =
      req.params;

    const [standard] = await connection.execute(
      `SELECT s.* 
         FROM Standard s
         JOIN Section sec ON s.section_id = sec.section_id
         JOIN Medium m ON sec.medium_id = m.medium_id
         JOIN Board b ON m.board_id = b.board_id
         WHERE s.standard_id = ? 
           AND sec.section_id = ? 
           AND m.board_id = ? 
           AND b.institute_id = ?`,
      [standardId, sectionId, boardId, instituteId]
    );

    if (standard.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Standard not found for this section in the institute",
      });
    }

    await connection.execute(
      "DELETE FROM Standard WHERE standard_id = ? AND section_id = ?",
      [standardId, sectionId]
    );

    res.status(204).json({
      status: "success",
      message: "Standard deleted successfully",
      data: null,
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};
