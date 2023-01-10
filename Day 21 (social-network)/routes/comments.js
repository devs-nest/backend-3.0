const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Route for comment
router.post("/create/:id", ensureAuth, commentsController.postComment);

router.delete("/deletecomment/:postid/:commentId",commentsController.deleteComment)

module.exports = router;