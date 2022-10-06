const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    ID: {
        type: String,
        required: true,
        unique: true,
    },
    pw: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Users", usersSchema);