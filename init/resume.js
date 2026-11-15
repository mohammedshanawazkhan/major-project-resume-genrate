const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const resumeSchema = new mongoose.Schema({
  templateId: String,  
  resumeImage: {
   url:String,
   filename:String
  },
  profileImage: {
     url:String,
       filename:String,
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  linkedin: String,
  github: String,
  summary: {
    type: String,
    required: true
  },
  education: [
    {
      degree: String,
      institution: String,
      year: String,
      specialization: String
    }
  ],
  skills: [String],
  experience: [
    {
      title: String,
      company: String,
      startDate: String,
      endDate: String,
      responsibilities: String
    }
  ],
  projectTitle: String,
  projectDescription: String,
  projectTech: String,
  projectLink: String,
  hobby1: String,
  hobby2: String,
  hobby3: String,
  refName1: String,
  refContact1: String,
  refRelation1: String,

  // ✅ reviews should be here
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  owner:{
    type: Schema.Types.ObjectId,
      ref: "Userlog"
  }

}, {
  timestamps: true   // ✅ timestamps belongs in options
});

module.exports = mongoose.model("Resume", resumeSchema);
resumeSchema.post("findOneAndDelete",async(Resume)=>{
  if(Resume){
    await review.deleteMany({_id:{$in:Resume.reviews}})
  }
})