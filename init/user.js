const { string } = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  profileImage: {
    url:String,
    filename:String
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
  tempId:Number
});

module.exports = mongoose.model("User", userSchema);
