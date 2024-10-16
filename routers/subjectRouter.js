const express = require("express");
const router = express.Router();
const subjectController = require("./../controller/subjectController");

router
  .route(
    "/:instituteId/boards/:boardId/mediums/:mediumId/sections/:sectionId/standards/:standardId/subjects"
  )
  .get(subjectController.getAllSubjects)
  .post(subjectController.createSubject);

router
  .route(
    "/:instituteId/boards/:boardId/mediums/:mediumId/sections/:sectionId/standards/:standardId/subjects/:subjectId"
  )
  .get(subjectController.getSubject)
  .put(subjectController.updateSubject)
  .delete(subjectController.deleteSubject);

module.exports = router;
