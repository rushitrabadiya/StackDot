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

exports.getAllSubjects = async (req, res) => {
  try {
    const { instituteId, boardId, mediumId, sectionId, standardId } =
      req.params;

    // cheak if the standard exists in the given hierarchy
    const [standard] = await connection.execute(
      `SELECT s.* 
           FROM Standard s
           JOIN Section sec ON s.section_id = sec.section_id
           JOIN Medium m ON sec.medium_id = m.medium_id
           JOIN Board b ON m.board_id = b.board_id
           WHERE s.standard_id = ? 
             AND sec.section_id = ? 
             AND m.medium_id = ? 
             AND b.board_id = ? 
             AND b.institute_id = ?`,
      [standardId, sectionId, mediumId, boardId, instituteId]
    );

    if (standard.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Standard not found in the specified hierarchy",
      });
    }

    const [subjects] = await connection.execute(
      "SELECT * FROM Subject WHERE standard_id = ?",
      [standardId]
    );

    res.status(200).json({
      status: "success",
      result: subjects.length,
      data: {
        subjects,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

exports.getSubject = async (req, res) => {
  try {
    const { instituteId, boardId, mediumId, sectionId, standardId, subjectId } =
      req.params;

    // cheak if the subject exists in the given hierarchy
    const sqlQuery = `
        SELECT sub.* 
        FROM Subject sub
        INNER JOIN Standard s ON sub.standard_id = s.standard_id
        INNER JOIN Section sec ON s.section_id = sec.section_id
        INNER JOIN Medium m ON sec.medium_id = m.medium_id
        INNER JOIN Board b ON m.board_id = b.board_id
        WHERE sub.subject_id = ? 
          AND s.standard_id = ? 
          AND sec.section_id = ? 
          AND m.medium_id = ? 
          AND b.board_id = ? 
          AND b.institute_id = ?`;

    const [subject] = await connection.execute(sqlQuery, [
      subjectId,
      standardId,
      sectionId,
      mediumId,
      boardId,
      instituteId,
    ]);

    if (subject.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Subject not found in the specified hierarchy",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        subject: subject[0],
      },
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

exports.createSubject = async (req, res) => {
  try {
    const { instituteId, boardId, mediumId, sectionId, standardId } =
      req.params;
    const { subject_name } = req.body;

    if (!subject_name) {
      return res.status(400).json({
        status: "fail",
        message: "subject name is required",
      });
    }

    // cheak if the standard exists in the given hierarchy
    const [standard] = await connection.execute(
      `SELECT s.standard_id
           FROM Standard s
           INNER JOIN Section sec ON s.section_id = sec.section_id
           INNER JOIN Medium m ON sec.medium_id = m.medium_id
           INNER JOIN Board b ON m.board_id = b.board_id
           WHERE s.standard_id = ? 
             AND sec.section_id = ? 
             AND m.medium_id = ? 
             AND b.board_id = ? 
             AND b.institute_id = ?`,
      [standardId, sectionId, mediumId, boardId, instituteId]
    );

    if (standard.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Standard not found in the specified hierarchy",
      });
    }
    const [insertResult] = await connection.execute(
      "INSERT INTO Subject (subject_name, standard_id) VALUES (?, ?)",
      [subject_name, standardId]
    );

    const [newSubject] = await connection.execute(
      "SELECT * FROM Subject WHERE subject_id = ?",
      [insertResult.insertId]
    );

    res.status(201).json({
      status: "success",
      data: {
        subject: newSubject[0],
      },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const { instituteId, boardId, mediumId, sectionId, standardId, subjectId } =
      req.params;
    const { subject_name } = req.body;

    // cheak if the subject exists in the given hierarchy
    const [subject] = await connection.execute(
      `SELECT sub.* 
           FROM Subject sub
           INNER JOIN Standard s ON sub.standard_id = s.standard_id
           INNER JOIN Section sec ON s.section_id = sec.section_id
           INNER JOIN Medium m ON sec.medium_id = m.medium_id
           INNER JOIN Board b ON m.board_id = b.board_id
           WHERE sub.subject_id = ? 
             AND s.standard_id = ? 
             AND sec.section_id = ? 
             AND m.medium_id = ? 
             AND b.board_id = ? 
             AND b.institute_id = ?`,
      [subjectId, standardId, sectionId, mediumId, boardId, instituteId]
    );

    if (subject.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Subject not found in the specified hierarchy",
      });
    }

    await connection.execute(
      "UPDATE Subject SET subject_name = ? WHERE subject_id = ?",
      [subject_name, subjectId]
    );

    const [updatedSubject] = await connection.execute(
      "SELECT * FROM Subject WHERE subject_id = ?",
      [subjectId]
    );

    res.status(200).json({
      status: "success",
      data: {
        subject: updatedSubject[0],
      },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const { instituteId, boardId, mediumId, sectionId, standardId, subjectId } =
      req.params;

    // cheak if the subject exists in the given hierarchy
    const [subject] = await connection.execute(
      `SELECT sub.* 
           FROM Subject sub
           INNER JOIN Standard s ON sub.standard_id = s.standard_id
           INNER JOIN Section sec ON s.section_id = sec.section_id
           INNER JOIN Medium m ON sec.medium_id = m.medium_id
           INNER JOIN Board b ON m.board_id = b.board_id
           WHERE sub.subject_id = ? 
             AND s.standard_id = ? 
             AND sec.section_id = ? 
             AND m.medium_id = ? 
             AND b.board_id = ? 
             AND b.institute_id = ?`,
      [subjectId, standardId, sectionId, mediumId, boardId, instituteId]
    );

    if (subject.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Subject not found in the specified hierarchy",
      });
    }

    await connection.execute("DELETE FROM Subject WHERE subject_id = ?", [
      subjectId,
    ]);

    res.status(204).json({
      status: "success",
      message: "Subject deleted successfully",
      data: null,
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};
