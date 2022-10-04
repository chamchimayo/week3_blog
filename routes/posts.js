const express = require("express");
const router = express.Router();
const Posts = require("../schemas/posts");

// 게시글 작성 API
router.post("/", async (req, res) => {
    const { user, password, title, content } = req.body;

    const createdPosts = await Posts.create({ user, password, title, content });

    res.json({ "message": "게시글을 생성했습니다." });
});

module.exports = router;