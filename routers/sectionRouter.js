const express = require("express");
const router = express.Router();
const sectionController = require("./../controller/sectionController");

router
  .route("/:instituteId/boards/:boardId/mediums/:mediumId/sections")
  .get(sectionController.getAllSections)
  .post(sectionController.createSection);

router
  .route("/:instituteId/boards/:boardId/mediums/:mediumId/sections/:sectionId")
  .get(sectionController.getSection)
  .put(sectionController.updateSection)
  .delete(sectionController.deleteSection);

module.exports = router;
