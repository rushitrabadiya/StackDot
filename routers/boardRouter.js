const express = require("express");
const router = express.Router();
const boardController = require("./../controller/boardController");

router
  .route("/:id/boards")
  .get(boardController.getAllBoards)
  .post(boardController.createBoard);

router
  .route("/:id/boards/:boardId")
  .get(boardController.getBoard)
  .put(boardController.updateBoard)
  .delete(boardController.deleteBoard);

module.exports = router;
