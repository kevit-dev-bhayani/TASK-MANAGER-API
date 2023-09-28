const express = require("express");
const Task = require("../models/tasks");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/tasks", auth, async (req, res) => {
  try {
    // const tasks = await Task.find({ owner: req.user._id });
    const match={}
    const sort={}

    if(req.query.Completed){
      match.Completed=req.query.Completed=="true"
    }

    if(req.query.sortBy){
      const parts=req.query.sortBy.split(':')
      sort[parts[0]]=parts[1]==="desc"?-1:1
    }
    await req.user.populate({
      path:"tasks",
      match,
      options:{
        limit:parseInt(req.query.limit),
        skip:parseInt(req.query.skip),
        sort
      },
      
    });

    res.send(req.user.tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const tasks = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!tasks) {
      return res.status(400).send("no task found");
    }
    res.send(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowUpdates = ["description", "isCompleted"];
  const validUpdate = updates.every((update) => allowUpdates.includes(update));

  if (!validUpdate) {
    return res.status(404).send({ error: "invalid updates" });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send({
        error: "no task found",
      });
    }
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();

    // const task = await Task.findByIdAndUpdate(_id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    res.send(task);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send({ error: "No task found" });
    }

    await Task.deleteOne({ _id: req.params.id, owner: req.user._id });
    res.send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
