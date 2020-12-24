const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    replys: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

module.exports = mongoose.model("Comment", commentSchema);
