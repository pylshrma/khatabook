const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username:{
        type:String,
        trim:true,
        minLength:3,
        maxLength:20,
        required:true
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    hisaabs: [{ type: mongoose.Schema.Types.ObjectId, ref:"hisaab"}],
});

module.exports = mongoose.model("user",userSchema)