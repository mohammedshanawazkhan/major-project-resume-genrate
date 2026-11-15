const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const reviewSchema=new Schema({
    rating:{
        type:Number,
        
    },
    comment:String,
    
    create_at:{
        type:Date,
        default:Date.now()
    },
    author:{
         type: Schema.Types.ObjectId,
         ref: "Userlog"
    }
})
module.exports=mongoose.model("Review",reviewSchema);