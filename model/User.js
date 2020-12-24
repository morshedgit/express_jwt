const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:6,
        max:255
    },
    email:{
        type:String,
        required:true,
        min:6,
        max:255
    },
    password:{
        type:String,
        required:true,
        min:6,
        max:1024,
        // get:function(){
        //     return 'Password'
        // }
    },
    date:{
        type:Date,
        default:Date.now
    },    
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
},{toJSON: {getters: true}});

module.exports = mongoose.model('User',userSchema);