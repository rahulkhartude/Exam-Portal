const express = require("express");
const router = express.Router();
const Question = require("../models/Question");


router.get("/test", (req, res) => {
  res.send("Admin route working");
});
// Admin POST add question
router.post("/add-question", async (req, res) => {
    console.log("add question called in admin")

  try {
    const { question, options, answer } = req.body;
    if (!question || !options || !answer)
      return res.status(400).json({ error: "All fields are required" });

    const newQuestion = new Question({ question, options, answer });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    console.error("error in the admin routes",err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;