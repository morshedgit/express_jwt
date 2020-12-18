const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        min:6,
        max:255
    },
    content:{
        type:String,
        required:true,
        min:6,
        max:255
    },
    date:{
        type:Date,
        default:Date.now
    },
    date_updated:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('Post',postSchema);