const express = require("express");
const router = express.Router();
const postsRouter = require("./posts");
const commentsRouter = require("./comments")

router.use("/posts", postsRouter);
router.use("/comments", commentsRouter);

module.exports = router;