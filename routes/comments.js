const express = require("express");
const router = express.Router();
const Posts = require("../schemas/post");
const Comments = require("../schemas/comment");

// 댓글 생성 API
router.post("/:postId", async (req, res) => {
    const { postId } = req.params;
    const { user, password, content } = req.body;

    if(content === "") {
        return res.status(400).json({ success: false, errorMessage: "댓글 내용을 입력해주세요." });
    }

    const createdComments = await Comments.create({ postId, user, password, content });
    res.json({ "message": "댓글을 생성하였습니다."} );
});

// 댓글 목록 조회 API
router.get("/:postId", async (req, res) => {
    const { postId } = req.params;
    const comments = await Comments.find({ postId }).sort({ createdAt: -1 });

    const data = [];
    for(let i = 0 ; i < comments.length; i++) {
        data.push({
            commentId: comments[i]._id.toString(),
            user: comments[i].user,
            content: comments[i].content,
            createdAt: comments[i].createdAt,
        });
    };

    res.json({ data });
});

module.exports = router;