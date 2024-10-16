const express = require("express");
const router = express.Router();
const stdController = require("./../controller/stdController");

router
  .route(
    "/:instituteId/boards/:boardId/mediums/:mediumId/sections/:sectionId/standards"
  )
  .get(stdController.getAllStandards)
  .post(stdController.createStandard);

router
  .route(
    "/:instituteId/boards/:boardId/mediums/:mediumId/sections/:sectionId/standards/:standardId"
  )
  .get(stdController.getStandard)
  .put(stdController.updateStandard)
  .delete(stdController.deleteStandard);

module.exports = router;
