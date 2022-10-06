const express = require("express");
const router = express.Router();
const Posts = require("../schemas/post");

// 게시글 작성 API
router.post("/", async (req, res) => {
    const { user, password, title, content } = req.body;

    try {
        const createdPosts = await Posts.create({ user, password, title, content });

        res.json({ "message": "게시글을 생성했습니다." });
    } catch {
        res.status(400).json({ success: false, errorMessage: "게시글 생성에 실패했습니다." })
    }

});

// 게시글 조회 API
router.get("/", async (req, res) => {
    try {
        const posts = await Posts.find().sort({ createdAt: -1 });
    
        const data = [];
        for(let i = 0; i < posts.length; i++) {
            data.push({
                postId: posts[i]._id.toString(),
                user: posts[i].user,
                title: posts[i].title,
                createdAt: posts[i].createdAt,
            });
        };
        res.json({ data });
    } catch {
        res.status(400).json({ success: false, errorMessage: "게시글 목록 조회에 실패했습니다." })
    }
});

// 게시글 상세 조회 API
router.get("/:postId", async (req,res) => {
    const { postId } = req.params;

    try {
        const post = await Posts.findOne({ _id : postId });
    
        if (post === undefined) {
            return res.status(400).json({ success: false, errorMessage: "게시글이 존재하지 않습니다." });
        } else {
            const data = {
                postId: post._id,
                user: post.user,
                title: post.title,
                content: post.content,
                createdAt: post.createdAt
            };
            res.json({ data });
        }
    } catch {
        res.status(400).json({ success: false, errorMessage: "게시글 조회에 실패했습니다." })
    }
});

// 게시글 수정 API
router.put("/:postId", async (req, res) => {
    const { postId } = req.params;
    const { title, password, content } = req.body;
    
    try {
        const post = await Posts.findOne({ _id : postId });
        if (password != post.password) {
            return res.status(400).json({ success: false, errorMessage: "비밀번호가 틀렸습니다." });
        }
    
        if(post !== undefined) {
            await Posts.updateOne(
                { _id: postId }, 
                { $set: { password: password, title: title, content: content } }
            );
        } else {
            return res.status(400).json({ success: false, errorMessage: "게시글이 존재하지 않습니다." });
        }
    
        res.json({ "message": "게시글을 수정하였습니다." });
    } catch {
        res.status(400).json({ success: false, errorMessage: "게시글 수정에 실패했습니다." })
    }
});

// 게시글 삭제 API
router.delete("/:postId", async (req,res) => {
    const { postId } = req.params;
    const { password } = req.body;

    try {
        const post = await Posts.findOne({ _id : postId });
        
        if (password != post.password) {
            return res.status(400).json({ success: false, errorMessage: "비밀번호가 틀렸습니다." });
        }
    
        if(post !== undefined) {
            await Posts.deleteOne({ _id : postId });
            return res.json({ "message": "게시글을 삭제하였습니다." });
        } else {
            return res.status(400).json({ success: false, errorMessage: "게시글이 존재하지 않습니다." });
        }
    } catch {
        res.status(400).json({ success: false, errorMessage: "게시글 삭제에 실패했습니다." })
    }
});

module.exports = router;