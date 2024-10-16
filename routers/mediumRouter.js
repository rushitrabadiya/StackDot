const express = require("express");
const router = express.Router();
const mediumController = require("./../controller/mediumController");

router
  .route("/:instituteId/boards/:boardId/mediums")
  .get(mediumController.getAllMediums)
  .post(mediumController.createMedium);

router
  .route("/:instituteId/boards/:boardId/mediums/:mediumId")
  .get(mediumController.getMedium)
  .put(mediumController.updateMedium)
  .delete(mediumController.deleteMedium);

module.exports = router;
