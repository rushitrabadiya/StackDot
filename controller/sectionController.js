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

exports.getAllSections = async (req, res) => {
  try {
    const { instituteId, boardId, mediumId } = req.params;

    // check a medium belong to board and board belong to institute
    const [medium] = await connection.execute(
      "SELECT * FROM Medium WHERE medium_id = ? AND board_id = (SELECT board_id FROM Board WHERE board_id = ? AND institute_id = ?)",
      [mediumId, boardId, instituteId]
    );

    if (medium.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Medium not found for this board in the institute",
      });
    }

    const [sections] = await connection.execute(
      "SELECT * FROM Section WHERE medium_id = ?",
      [mediumId]
    );

    res.status(200).json({
      status: "success",
      result: sections.length,
      data: {
        sections,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

exports.getSection = async (req, res) => {
  try {
    const { instituteId, boardId, mediumId, sectionId } = req.params;

    // Cheak that the section belongs to the medium and the medium belongs to the board and the board belongs to the institute
    const [section] = await connection.execute(
      `SELECT s.* 
         FROM Section s
         JOIN Medium m ON s.medium_id = m.medium_id
         JOIN Board b ON m.board_id = b.board_id
         WHERE s.section_id = ? 
           AND s.medium_id = ? 
           AND b.board_id = ? 
           AND b.institute_id = ?`,
      [sectionId, mediumId, boardId, instituteId]
    );

    if (section.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Section not found for this medium in the institute",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        section: section[0],
      },
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

exports.createSection = async (req, res) => {
  try {
    
    const { instituteId, boardId, mediumId } = req.params;
    const sectionName = req.body.section_name;

    // check a medium belong to board and board belong to institute
    const [medium] = await connection.execute(
      "SELECT * FROM Medium WHERE medium_id = ? AND board_id = (SELECT board_id FROM Board WHERE board_id = ? AND institute_id = ?)",
      [mediumId, boardId, instituteId]
    );

    if (medium.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Medium not found for this board in the institute",
      });
    }

    if (!sectionName) {
      return res.status(400).json({
        status: "fail",
        message: "Section name is required",
      });
    }

    const [result] = await connection.execute(
      "INSERT INTO Section (section_name, medium_id) VALUES (?, ?)",
      [sectionName, mediumId]
    );

    const [newSection] = await connection.execute(
      "SELECT * FROM Section WHERE section_id = ?",
      [result.insertId]
    );

    res.status(201).json({
      status: "success",
      data: {
        section: newSection[0],
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { instituteId, boardId, mediumId, sectionId } = req.params;
    const sectionName = req.body.section_name;

    // cheak that the section belongs to the medium and the medium belongs to the board and the board belongs to the institute
    const [section] = await connection.execute(
      `SELECT s.* 
         FROM Section s
         JOIN Medium m ON s.medium_id = m.medium_id
         JOIN Board b ON m.board_id = b.board_id
         WHERE s.section_id = ? 
           AND s.medium_id = ? 
           AND b.board_id = ? 
           AND b.institute_id = ?`,
      [sectionId, mediumId, boardId, instituteId]
    );

    if (section.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Section not found for this medium in the institute",
      });
    }

    if (!sectionName) {
      return res.status(400).json({
        status: "fail",
        message: "Section name is required",
      });
    }

    await connection.execute(
      "UPDATE Section SET section_name = ? WHERE section_id = ? AND medium_id = ?",
      [sectionName, sectionId, mediumId]
    );

    const [updatedSection] = await connection.execute(
      "SELECT * FROM Section WHERE section_id = ?",
      [sectionId]
    );

    res.status(200).json({
      status: "success",
      data: {
        section: updatedSection[0],
      },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const { instituteId, boardId, mediumId, sectionId } = req.params;

    // Cheak that the section belongs to the medium and the medium belongs to the board and the board belongs to the institute
    const [section] = await connection.execute(
      `SELECT s.* 
         FROM Section s
         JOIN Medium m ON s.medium_id = m.medium_id
         JOIN Board b ON m.board_id = b.board_id
         WHERE s.section_id = ? 
           AND s.medium_id = ? 
           AND b.board_id = ? 
           AND b.institute_id = ?`,
      [sectionId, mediumId, boardId, instituteId]
    );

    if (section.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Section not found for this medium in the institute",
      });
    }

    await connection.execute(
      "DELETE FROM Section WHERE section_id = ? AND medium_id = ?",
      [sectionId, mediumId]
    );

    res.status(204).json({
      status: "success",
      message: "Section deleted successfully",
      data: null,
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};
