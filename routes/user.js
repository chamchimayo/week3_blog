const express = require("express");
const router = express.Router();
const Users = require("../schemas/user");

// 회원 가입 API
router.post("/", async(req, res) => {
    const { name, ID, pw } = req.body;

    const createdUser = await Users.create({ name, ID, pw });

    res.json({ "message" : "회원가입 성공" });
})

module.exports = router;

// 회원 전체 목록 조회 API
router.get("/", async (req, res) => {
    try {
        const users = await Users.find();

        const result = [];
        for(let i = 0; i < users.length; i++) {
            console.log(result);
            result.push({
                userId: users[i]._id,
                name: users[i].name,
                ID: users[i].ID,
                pw: users[i].pw,
            })
        }
        console.log(result);
        res.json({ result });
    } catch {
        res.status(400).json({ message: "회원 목록 조회 실패", });
    }
})

// 회원 상세조회 API
router.get("/:userId", async (req, res) => {
    const { userId } = req.params;
    console.log(userId);

    try{
        // userId가 유저가 입력한 ID일 때
        // const user = await Users.findOne({ ID : userId });
        // userID가 DB에 저장된 ID일 때
        const user = await (await Users.findOne({ _id : userId }));
        console.log(user);
        if(user) {
            const result = {
                userId: user._id,
                name: user.name,
                ID: user.ID,
                pw: user.pw,
            }
            return res.json({ result });
        } else {
            return res.status(400).json({ message : "존재하지 않는 회원입니다." })
        }

    } catch {
        res.status(400).json({ message: "회원 상세 조회 실패", });
    }
});