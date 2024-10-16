const express = require("express");
const router = express.Router();
const instituteController = require("./../controller/instituteController");

router
  .route("/")
  .get(instituteController.getAllInstitute)
  .post(instituteController.createInstitute);

router
  .route("/:id")
  .get(instituteController.getInstitute)
  .put(instituteController.updateInstitute)
  .delete(instituteController.deleteInstitute);

module.exports = router;
