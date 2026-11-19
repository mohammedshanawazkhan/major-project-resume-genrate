let Resume=require("./models/resume.js")
const Review = require("./models/review.js")
module.exports.isLoggin=(req,res,next)=>{

  if(!req.isAuthenticated()){
     req.session.redirectUrl=req.originalUrl
    req.flash("error","first you loginn")
    return res.redirect("/login")
  }
  next()
}
module.exports.saveUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next()
}
module.exports.isOwner=async(req,res,next)=>{
  let { id }=req.params;
  let data=await Resume.findById(id)
  if(!data.owner._id.equals(curr._id)){
    req.flash("error","you dont have the permission")
    return res.redirect(`/resume/${id}`)
  }
  next()
}
module.exports.reviewOwner=async(req,res,next)=>{
  let { id,reviewId}=req.params;
  let review=await Review.findById(reviewId)
  if(!review && review._id.equals(curr._id)){
    req.flash("error","you dont have permission")
    return res.redirect(`/resume/${id}`)
  }
  next()
}