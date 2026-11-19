const joi = require('joi');
const resumeSchema=joi.object({
    Resume:joi.object({
        templateId:joi.string().required(),
        resumeImage:joi.string().required(),
        profileImage:joi.string().required().allow("",null),
        name:joi.string().required(),
         phone:joi.string().required(),
        email:joi.string().required(),
        address:joi.string().required(),
        linkedin:joi.string().required(),
        github: joi.string().required(),
        summary:joi.string().required(),
        education:joi.string().required(),
        skills:joi.string().required(),
        experience:joi.string().required(),
        projectTitle: joi.string().required(),
  projectDescription: joi.string().required(),
  projectTech:joi.string().required(),
  projectLink: joi.string().required(),

  hobby1: joi.string().required(),
  hobby2: joi.string().required(),
  hobby3:  joi.string().required(),

  refName1:  joi.string().required(),
  refContact1:  joi.string().required(),
  refRelation1:  joi.string().required(),
}).required()
})

module.exports=resumeSchema;



const UserSchema = joi.object({
  User:joi.object({
  profileImage: joi.string().required(),

  name: joi.string().required(),
  phone: joi.string().required(),
  email: joi.string().email().required(),
  address: joi.string().required(),

  linkedin: joi.string().uri().optional(),
  github: joi.string().uri().optional(),

  summary: joi.string().required(),

  education: joi.array().items(
    joi.object({
      degree: joi.string().optional(),
      institution: joi.string().optional(),
      year: joi.string().optional(),
      specialization: joi.string().optional()
    })
  ).optional(),

  skills: joi.array().items(joi.string()).optional(),

  experience: joi.array().items(
    joi.object({
      title: joi.string().optional(),
      company: joi.string().optional(),
      startDate: joi.string().optional(),
      endDate: joi.string().optional(),
      responsibilities: joi.string().optional()
    })
  ).optional(),

  projectTitle: joi.string().optional(),
  projectDescription: joi.string().optional(),
  projectTech: joi.string().optional(),
  projectLink: joi.string().uri().optional(),

  hobby1: joi.string().optional(),
  hobby2: joi.string().optional(),
  hobby3: joi.string().optional(),

  refName1: joi.string().optional(),
  refContact1: joi.string().optional(),
  refRelation1: joi.string().optional(),

  // tempId: joi.number().optional()
  }).required()
});

module.exports = UserSchema;