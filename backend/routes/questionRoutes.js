
const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const auth = require("../middleware/auth");


// =======================
// ✅ CREATE QUESTION
// =======================
router.post("/questions", auth,async (req, res) => {

  console.log("add question called---")

  try {
    const { question, options, answer } = req.body;
    
    // Validation
    if (!question || !options || !answer) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: "At least 2 options required" });
    }

    if (!options.includes(answer)) {
      return res.status(400).json({
        message: "Answer must be one of the options",
      });
    }

    const newQuestion = new Question({
      question,
      options,
      answer,
    });

    const savedQuestion = await newQuestion.save();

    res.status(201).json(savedQuestion);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating question" });
  }

});


// =======================
// ✅ GET ALL QUESTIONS
// =======================
router.get("/", async (req, res) => {

  try {
    const questions = await Question.find();
    res.json(questions);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching questions" });
  }
});


// =======================
// ✅ GET SINGLE QUESTION
// =======================
router.get("/:id",auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(question);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching question" });
  }
});


// =======================
// ✅ UPDATE QUESTION
// =======================
router.put("/questions/:id",auth, async (req, res) => {

  console.log("Update question called---");
  try {
    const { question, options, answer } = req.body;

    // Optional validation during update
    if (options && answer && !options.includes(answer)) {
      return res.status(400).json({
        message: "Answer must match one of the options",
      });
    }
    console.log("question find by id "); // Debugging line to check incoming data
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
   
    console.log("question find by id end"); // Debugging line to check incoming data
    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(updatedQuestion);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating question" });
  }
});


// =======================
// ❌ DELETE QUESTION
// =======================
router.delete("/questions/:id",auth, async (req, res) => {
  try {
    const deleted = await Question.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ message: "Question deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting question" });
  }
});




module.exports = router;