// const express = require("express");
// const router = express.Router();
// const Question = require("../models/Question");


// router.post("/admin/add-question", async (req, res) => {
//     const question = new Question(req.body);
//     await question.save();
//     res.json(question);
// });

// router.get("/", async (req, res) => {
//   const questions = await Question.find();
//   res.json(questions);
// });

// router.post("/", async (req, res) => {
//   const question = new Question(req.body);
//   await question.save();
//   res.json(question);
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// Get all questions
router.get("/", async (req, res) => {
  try{

      console.log("ques started");
      const questions = await Question.find();
     console.log("ques ended",questions);

      res.json(questions);
  }
  catch{
    console.log("find not worked")
  }
 
});

// Optional public POST
router.post("/", async (req, res) => {
  const question = new Question(req.body);
  await question.save();
  res.json(question);
});

module.exports = router;