const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
    postId: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});


module.exports = mongoose.model("Comments", commentsSchema);