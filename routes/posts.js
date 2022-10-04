const express = require("express");
const router = express.Router();
const Posts = require("../schemas/posts");

// 게시글 작성 API
router.post("/", async (req, res) => {
    const { user, password, title, content } = req.body;

    const createdPosts = await Posts.create({ user, password, title, content });

    res.json({ "message": "게시글을 생성했습니다." });
});

// 게시글 조회 API
router.get("/", async (req, res) => {
    const posts = await Posts.find().sort({createdAt: -1});
    const data = [];
    for(let i = 0; i < posts.length; i++) {
        data.push({
            postId: posts[i]._id.toString(),
            user: posts[i].user,
            title: posts[i].title,
            createdAt: posts[i].createdAt,
        });
    }
    res.json({ data })
});

module.exports = router;