const express = require("express");
const router = express.Router();
const Posts = require("../schemas/post");

// 게시글 작성 API
router.post("/", async (req, res) => {
    const { user, password, title, content } = req.body;

    const createdPosts = await Posts.create({ user, password, title, content });

    res.json({ "message": "게시글을 생성했습니다." });
});

// 게시글 조회 API
router.get("/", async (req, res) => {
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
});

// 게시글 상세 조회 API
router.get("/:postId", async (req,res) => {
    const { postId } = req.params;
    const post = await Posts.find({ _id : postId });

    if (!post.length) {
        return res.status(400).json({ success: false, errorMessage: "게시글이 존재하지 않습니다." });
    } else {
        const data = {
            postId: post[0]._id,
            user: post[0].user,
            title: post[0].title,
            content: post[0].content,
            createdAt: post[0].createdAt
        };
        res.json({ data });
    }
});

// 게시글 수정 API
router.put("/:postId", async (req, res) => {
    const { postId } = req.params;
    const { title, password, content } = req.body;
    
    const post = await Posts.find({ _id : postId });
    if (password != post[0].password) {
        return res.status(400).json({ success: false, errorMessage: "비밀번호가 틀렸습니다." });
    }

    if(post.length) {
        await Posts.updateOne(
            { _id: postId }, 
            { $set: { password: password, title: title, contetnt: content } });
    } else {
        return res.status(400).json({ success: false, errorMessage: "게시글이 존재하지 않습니다." });
    }

    res.json({ "message": "게시글을 수정하였습니다." });
});

router.delete("/:postId", async (req,res) => {
    const { postId } = req.params;
    const { password } = req.body;

    const post = await Posts.find({ _id : postId });
    console.log(post);
    if (password != post[0].password) {
        return res.status(400).json({ success: false, errorMessage: "비밀번호가 틀렸습니다." });
    }

    if(post.length) {
        await Posts.deleteOne({ _id : postId });
        return res.json({ "message": "게시글을 삭제하였습니다." });
    } else {
        return res.status(400).json({ success: false, errorMessage: "게시글이 존재하지 않습니다." });
    }
});

module.exports = router;