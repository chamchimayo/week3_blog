const express = require("express");
const app = express();
const PORT = 3000;
const connect = require("./schemas");
connect();
const router = require("./routes/index");

app.use(express.json());

app.get("/", (req, res) => {
    res.send("메인 페이지입니다.")
});

app.use("/api", router);

app.listen(PORT, () => {
    console.log(PORT, "서버가 실행되었습니다!");
});
