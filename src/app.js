const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dbConnection=require("./db/mongoose");
dbConnection()
const userRouter = require("./routers/users");
const taskRouter = require("./routers/tasks");

const app = express();

// app.use((req,res,next)=>{
//   res.status(503).send("API is under maintenance")
// })

app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

// const Task=require('./models/tasks')
// const User=require('./models/users')
// const main=async()=>{
// const task=await Task.findById('6503f45b648cbeb74d72d280')
// await task.populate('owner');
// console.log(task.owner)

// const users=await User.findById("650d18f0a172d8878d9f5238")
// await users.populate("tasks");
// console.log(users.tasks)
// }
// main()
// const myFunction=async ()=>{
//     const token=jwt.sign({_id:"abc123"},'qwertyuiop',{expiresIn:'7 days'})
//     console.log(token)

//     const data=jwt.verify(token,'qwertyuiop')
//     console.log(data)
// }

// myFunction()

// const multer = require("multer");
// const upload = multer({
//   dest: "images",
//   limits:{
//     fileSize:1000000
//    },
//    fileFilter(req,file,cb){
//     if(!file.originalname.match(/\.(doc|docx)$/)){
//       return cb(new Error("Please upload a doc file"))
//     }
//     cb(undefined,true)
//    }
//   //  fileFilter(req,file,cb){
//   //   if(!file.originalname.endsWith(".pdf")){
//   //     return cb(new Error("Please upload a pdf file"))
//   //   }
//   //   cb(undefined,true)
//   //  }
// });

// app.post('/upload',upload.single('upload'),(req,res)=>{
//   res.send()
// },(error,req,res,next)=>{
//   res.status(400).send({"error":error.message})
// })
module.exports=app