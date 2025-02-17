const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema=new Schema({
     userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
    title:{
        type:String,
    },
    desciption:{
        type:String,
    },
    githubUrl:{
        type:String,
        required:true,
    },
    liveUrl:{
        type:String,
    },
    techStack:[{
        type:String
    }]
},{timestamps})

projectSchema.index({ userId: 1, createdAt: -1 });
projectSchema.index({  techStack:1});

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;