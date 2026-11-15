const mongoose=require("mongoose");
const initData=require("./Data.js");
const Rasume=require("../models/resume.js");

main().then((res)=>{
    console.log("connected")
}).catch((err)=>{
    console.log("error")
});
async function main(){
    await mongoose.connect("mongodb://localhost:27017/resume");
}

const initDB=async ()=>{
    await Rasume.deleteMany({})
  const initDatadata=initData.data.map((obj)=>({...obj,owner:"6ab92e82a911ab55d7a1d92f",}))
    await Rasume.insertMany(initDatadata);

    console.log("the data was added");
    
}
initDB();
