const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    content: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    date_updated: {
        type: Date,
        default: Date.now,
    },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    tags: [{ type: String,min:4,max:20}],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment",min:4,max:200}]
});

module.exports = mongoose.model("Post", postSchema);
