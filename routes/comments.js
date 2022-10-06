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

    try {
        const createdComments = await Comments.create({ postId, user, password, content });
        res.json({ "message": "댓글을 생성하였습니다."} );
    } catch {
        res.status(400).json({ success: false, errorMessage: "댓글 생성에 실패했습니다." })
    }
});

// 댓글 목록 조회 API
router.get("/:postId", async (req, res) => {
    const { postId } = req.params;

    try {
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
    } catch {
        res.status(400).json({ success: false, errorMessage: "댓글 목록 조회에 실패했습니다." })
    }
});

// 댓글 수정 API
router.put("/:commentId", async(req, res) => {
    const { commentId } = req.params;
    const { password, content } = req.body;

    try {
        const comment = await Comments.findOne({ _id : commentId });
    
        if(password != comment.password) {
            return res.status(400).json({ success: false, errorMessage: "비밀번호가 틀렸습니다." });
        }
    
        if(content === "") {
            return res.status(400).json({ success: false, errorMessage: "댓글 내용을 입력해주세요." });
        }
    
        console.log(comment);
        if(comment !== undefined) {
            await Comments.updateOne(
                { _id: commentId }, 
                { $set: { password: password, content: content } }
            );
            return res.json({ "message": "댓글을 수정하였습니다."});
        } else {
            return res.status(400).json({ success: false, errorMessage: "댓글이 존재하지 않습니다." });
        }
    } catch {
        res.status(400).json({ success: false, errorMessage: "댓글 수정에 실패했습니다." })
    }
});

// 댓글 삭제 API
router.delete("/:commentId", async (req, res) => {
    const { commentId } = req.params;
    const { password } = req.body;

    try {
        const comment = await Comments.find({ _id : commentId });
    
        if(password != comment[0].password) {
            return res.status(400).json({ success: false, errorMessage: "비밀번호가 틀렸습니다." });
        }
    
        if(comment.length) {
            await Comments.deleteOne({ _id : commentId });
            return res.json({ "message": "댓글을 삭제하였습니다." });
        } else {
            return res.json(400).json({ success: false, errorMessage: "댓글이 존재하지 않습니다." });
        }
    } catch {
        res.status(400).json({ success: false, errorMessage: "댓글 삭제에 실패했습니다." })
    }
});

module.exports = router;