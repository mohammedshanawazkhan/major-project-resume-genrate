const { required } = require("joi");
const mongoose=require("mongoose")

const Schema=mongoose.Schema;
const UserlogSchema=new Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    }
})
const passport_Mongoose=require("passport-local-mongoose").default

UserlogSchema.plugin(passport_Mongoose)
module.exports=mongoose.model("Userlog",UserlogSchema)

