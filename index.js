const express=require("express")
const app=express();
const port=8080;
const mongoose=require("mongoose")
const Resume=require("./models/resume.js")
const User=require("./models/user.js")
const Review=require("./models/review.js")
let resumeSchema=require("../resume_project-2/joi.js")
app.set('views', 'views');
app.set('view engine', 'ejs');
const path=require("path");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
let ejsmate=require("ejs-mate");
const UserSchema = require("../resume_project-2/joi.js");
app.engine('ejs',ejsmate)
const {saveUrl}=require("./middle.js")
const methodOverride = require("method-override");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
main().then(()=>{
    console.log("connect to db")
}).catch((err)=>{
    console.log("the err is :",err)
})
async function main(){
    await mongoose.connect("mongodb://localhost:27017/resume")
}
require('dotenv').config()
const { storage }=require("./cloudConfig.js")

const multer = require('multer');
const upload = multer({storage:storage});
const passport=require("passport")
const Localstraterge=require("passport-local")
const GoogleStrategy=require("passport-google-oauth20").Strategy;
const GithubStrategy=require("passport-github2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const session=require("express-session")
const flash=require("connect-flash");
const ExpressError = require("./ExpressError.js");
const WrapAsync = require("./WrapAsync.js");
let resumeValidator=(req,res,next)=>{
    let { err }=resumeSchema.validate(req.body)
    if(err){
        res.send("something went wrong")
    }
    else{
        next()
    }
}
let Uservalodator=(req,res,next)=>{
    let { err }=UserSchema.validate(req.body)
    if(err){
        res.send("something went wrong")
    }
    else{
        next()
    }
}
const sessionOption={
    secret:"secret",
    resave:false,
    saveUninitialized:false,
    cookiee:{
         expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}


app.use(session(sessionOption))
app.use(flash())
const Userlog=require("./models/login.js");
const { isLoggin,isOwner, reviewOwner } = require("./middle.js");

passport.use(new Localstraterge(Userlog.authenticate()))
passport.serializeUser(Userlog.serializeUser())
passport.deserializeUser(Userlog.deserializeUser())
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((user,done)=>done(null,user))
passport.deserializeUser((user,done)=>done(null,user))



// const Userlog = require("./models/Userlog");

// Google Login
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "http://localhost:8080/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await Userlog.findOne({
          email: profile.emails[0].value,
        });

        if (!user) {
          user = await Userlog.create({
            username: profile.displayName,
            email: profile.emails[0].value,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// GitHub Login
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails?.[0]?.value ||
          `${profile.username}@github.com`;

        let user = await Userlog.findOne({ email });

        if (!user) {
          user = await Userlog.create({
            username: profile.username || profile.displayName,
            email,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_APP_ID,
//       clientSecret: process.env.FACEBOOK_APP_SECRET,
//       callbackURL: "http://localhost:8080/auth/facebook/callback",
//     },
//     (accessToken, refreshToken, profile, done) => {
//       return done(null, profile);
//     }
//   )
// );
app.use((req,res,next)=>{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    res.locals.curr=req.user
    next()
})
app.listen(port,()=>{
    console.log("connect to sever:",port)
})
app.get("/",(req,res)=>{
    res.send("the root route")
})
app.get("/logout",(req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","you are logout")
        res.redirect("/resume")
    })
})
app.get("/resume",async(req,res)=>{
     let data=await Resume.find({})
     console.log(data)
     console.log(process.env.HELLO)
    res.render("index.ejs",{ data })

  

})
app.get("/resume/newform",(req,res)=>{
    res.render("new.ejs")
})
app.post("/resume/newform",upload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "resumeImage", maxCount: 1 }
]),async(req,res)=>{
   const profileUrl = req.files.profileImage[0].path;
const profileFilename = req.files.profileImage[0].filename;

const resumeUrl = req.files.resumeImage[0].path;
const resumeFilename = req.files.resumeImage[0].filename;
 console.log("FILES:", req.files);
console.log("BODY:", req.body);
 
    const {
      templateId,
      resumeImage,
      profileImage,
      name,
      phone,
      email,
      address,
      linkedin,
      github,
      summary,
      education,
      skills,
      experience,
      projectTitle,
      projectDescription,
      projectTech,
      projectLink,
      hobby1,
      hobby2,
      hobby3,
      refName1,
      refContact1,
      refRelation1
    } = req.body
    let data = new Resume({
      templateId: templateId,
      resumeImage: resumeImage,
      profileImage: profileImage,
      name: name,
      phone: phone,
      email: email,
      address: address,
      linkedin: linkedin,
      github: github,
      summary: summary,
      education: education,     // array of objects
      skills: skills,           // array of strings
      experience: experience,   // array of objects
      projectTitle: projectTitle,
      projectDescription: projectDescription,
      projectTech: projectTech,
      projectLink: projectLink,
      hobby1: hobby1,
      hobby2: hobby2,
      hobby3: hobby3,
      refName1: refName1,
      refContact1: refContact1,
      refRelation1: refRelation1
    });
   
   data.profileImage = {
  url: profileUrl,
  filename: profileFilename
};

data.resumeImage = {
  url: resumeUrl,
  filename: resumeFilename
};
    await data.save()
    res.redirect("/resume")

})

app.get("/resume/:id",isLoggin,async(req,res)=>{
    let {id}=req.params
    let data=await Resume.findById(id)
    res.render("form.ejs",{data})
})

app.post("/resume/:id",upload.single("profileImage"),Uservalodator,async(req,res)=>{
   let url=req.file.path;
   let filename=req.file.filename;
    let { id }=req.params;
    const {
    profileImage,
    name,
    phone,
    email,
    address,
    linkedin,
    github,
    summary,
    education,
    skills,
    experience,
    projectTitle,
    projectDescription,
    projectTech,
    projectLink,
    hobby1,
    hobby2,
    hobby3,
    refName1,
    refContact1,
    refRelation1
  } = req.body;
  let data= new User({
    profileImage:profileImage,
    name:name,
    phone: phone,
    email: email,
    address: address,
    linkedin: linkedin,
    github: github,
    summary:summary,
    education:education,
    skills:skills,
    experience: experience,
    projectTitle:projectTitle,
    projectDescription: projectDescription,
    projectTech: projectTech,
    projectLink: projectLink,
    hobby1: hobby1,
    hobby2: hobby2,
    hobby3:hobby3,
    refName1: refName1,
    refContact1: refContact1,
    refRelation1 :refRelation1,
   

})
let resumeData=await Resume.findById(id)
resumeData.profileImage={url,filename}

const tempId = resumeData.templateId;
// console.log(resumeData)

  
  await data.save()
  res.render(tempId,{ data })

// //  if(tempId==1){
// //    res.render("template.ejs",{data})
// //  }
// //  else if(tempId==2){
// //     res.render("template2.ejs",{data})
// //  }
// //  else if(tempId==3){
// //  res.render("template3.ejs",{data}) }
// //  else if(tempId==4){
// //     res.render("template4.ejs",{data})
// //  }
// //  else if(tempId==5){
// //         res.render("template5.ejs",{data})

// //  }
// //  else if(tempId==6){
// //         res.render("template6.ejs",{data})

// //  }
// //  else if(tempId==7){
// //         res.render("template7.ejs",{data})

// //  }
// //  else if(tempId==8){
// //     res.render("template8.ejs",{data})
// //  }


// // switch (tempId) {
// //   case 0:
// //     return res.render("template.ejs", { data });

// //   case 1:
// //     return res.render("template2.ejs", { data });

// //   case 2:
// //     return res.render("template3.ejs", { data });

// //   case 3:
// //     return res.render("template4.ejs", { data });

// //   case 4:
// //     return res.render("template5.ejs", { data });

// //   case 5:
// //     return res.render("template6.ejs", { data });

// //   case 6:
// //     return res.render("template7.ejs", { data });

// //   default:
// //     return res.status(400).send("Invalid template selected.");

})

// app.get("/resume/new",(req,res)=>{
//     res.render("new.ejs")
// })
// app.post("/resume/:id",upload.single("profileImage"),(req,res)=>{
//     res.send(req.file)
// })

app.get("/resume/:id/edit",async(req,res)=>{
     let { id }=req.params
    let data=await User.findById(id)
      console.log(data)
   
    res.render("edit.ejs",{ data })
})
app.put("/resume/:id/edit",async(req,res)=>{
     let { id }=req.params;
     let data=await User.findByIdAndUpdate(id,{...req.body})
    
     await data.save()
     res.redirect(`/resume/${id}`)
    
})
app.get("/resume/:id/newEdit",async(req,res)=>{
      let { id }=req.params;
      let data=await Resume.findById(id)
      res.render("newEdit.ejs",{data})
})
app.post("/resume/:id/review",async(req,res)=>{
    let { id }=req.params;
    let data=await Resume.findById(id)
    let newReview=new Review(req.body.reviews)
    newReview.author=req.user._id;
    console.log(newReview)
    data.reviews.push(newReview)
    req.flash("success","add the review")
     await newReview.save()
    await data.save()
    console.log(id)
   res.redirect(`/resume/${data._id}/show`)
})
app.put("/resume/:id/newEdit",async(req,res)=>{
     let { id }=req.params
     let data=await Resume.findByIdAndUpdate(id,{...req.body})
     await data.save()
     res.redirect(`/resume/${id}`)
})
app.get("/resume/:id/show",isLoggin,async(req,res)=>{
    let { id }=req.params
   let data = await Resume.findById(id)
  .populate({
    path: "reviews",
    populate: {
      path: "author",
      
    },
   
  });
    res.render("show.ejs",{ data })
})


app.delete("/resume/:id/delete",isLoggin,isOwner,async(req,res)=>{
    let { id }=req.params;
    let data=await Resume.findByIdAndDelete(id)
    await data.save()
    res.redirect("/resume")
})
app.delete("/resume/:id/review/:reviewId",isLoggin,reviewOwner,WrapAsync(async(req,res)=>{
    let { id , reviewId}=req.params;
    await Resume.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("error","review was deleted")
        res.redirect(`/resume/${id}/show`)
    
}))
app.get("/signup",(req,res)=>{
    res.render("signup.ejs")
})


app.post("/signup",async(req,res)=>{
  try{
    let { username,email,password}=req.body;
    const user=new Userlog({username,email})
    await Userlog.register(user,password)
    req.flash("success","you are signup in resume genrator")
    res.redirect("/resume")
}
    catch(err){
        req.flash("error","you alredy signup")
        res.redirect("/resume")
    }
     
   
})

app.get("/login",(req,res)=>{
    
    res.render("login.ejs")
})
app.post("/login",
  
  passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
  async(req, res) => {
    console.log("Login successful for:", req.user);
    res.redirect("/resume");
  }
);
app.get("/auth/google",passport.authenticate('google',{scope:['email','profile']}));

app.get("/auth/google/callback",saveUrl,passport.authenticate("google",{failureRedirect:"/login"}),(req,res)=>{
    req.flash("success","welcome back to resume-generator");
    let redirectUrl=res.locals.redirectUrl||"/resume";
    res.redirect(redirectUrl)
})
app.get("/auth/github",passport.authenticate('github',{scope:['user:email']}))
app.get("/auth/github/callback",passport.authenticate('github',{failureRedirect:"/login"}),(req,res)=>{
    req.flash("success","welcome back to resume-generator");
    let redirectUrl=res.locals.redirectUrl||"/resume";
    res.redirect(redirectUrl)
})


// app.use((err,req,res,next)=>{
//     if(err.name==="validationError"){
//         throw new ExpressError(404,"you are not follow validation")
//     }
//     next(err)
// })
// app.use((err,req,res,next)=>{
//     let {status,msg}=err
//     res.status(404).send(msg)
// })
