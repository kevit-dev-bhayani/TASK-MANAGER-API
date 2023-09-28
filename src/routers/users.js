const express = require("express");
const multer=require("multer")
const sharp=require("sharp")
const User = require("../models/users");
const Task = require("../models/tasks");
const router = new express.Router();
const {welcome,cancel}=require('../email/account')
const auth = require("../middleware/auth");
 
require("../db/mongoose");

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/users/me", auth, async (req, res) => {
  // try {
  //   const users = await User.find({});
  //   res.send(users);
  // } catch (err) {
  //   res.status(500).send(err);
  // }
  res.send(req.user);
});



router.patch("/users/me", auth, async (req, res) => {
  // const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowUpdates = ["name", "email", "password", "age"];
  const validUpdate = updates.every((update) => allowUpdates.includes(update));
  if (!validUpdate) {
    return res.status(404).send({
      error: "Invalid updates!!",
    });
  }
  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    // await User.remove({ _id: req.user._id }); //not working
    // await User.deleteOne({ _id: req.user._id });
    // await Task.deleteMany({owner:req.user._id})
    // console.log(req.user)
    const user = await User.findOneAndDelete({ _id: req.user._id });
    cancel(user.email,user.name)
    
    if (user === null) {
      return res.status(404).send("User not found");
    }
    res.send({user:req.user});
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (err) {
    res.status(404).send(err);
  }
});

router.post("/users/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
     welcome(user.email,user.name)
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send();
  } catch (err) {
    res.status(500).send(err);
  }
});

const upload=multer({
  // dest:"avatar",
  limits:{
    fileSize:1000000
  },
  fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
      return cb(new Error("please upload jpg,jpeg or png file"))
    }
    cb(undefined,true)
  }
})

router.get("/users/:id/avatar",async(req,res)=>{
  try {
    const user=await User.findById(req.params.id)
    if(!user||!user.avatar){
      throw new Error()
    }
    res.set("Content-type","image/png")
    res.send(user.avatar)
  } catch (error) {
    res.status(400).send()
  }
  
})

router.post("/users/me/avatar",auth,upload.single('avatar'),async (req,res)=>{
  const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
  req.user.avatar=buffer
  await req.user.save();
  res.send()
},(error,req,res,next)=>{
  res.status(400).send({error:error.message})
})

router.delete("/users/me/avatar",auth,async(req,res)=>{
  try {
    req.user.avatar=undefined
  await req.user.save();
  res.send()
  } catch (error) {
    res.status(404).res.send({
      error:"some error occurred"
    })
  }
  
})
module.exports = router;
