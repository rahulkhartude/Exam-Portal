
const express = require("express");
const router = express.Router();

const Result = require("../models/Result");
const Question = require("../models/Question");
const auth = require("../middleware/auth");

// POST /api/result/submit
router.post("/submit",auth ,async (req, res) => {

  try {

    const { answers,user } = req.body;

    // Validation
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: "Invalid answers format" });
    }

    const questionIds = answers.map((a) => a.questionId);

    const questions = await Question.find({
      _id: { $in: questionIds },
    });

    const questionMap = {};
    questions.forEach((q) => {
      questionMap[q._id.toString()] = q;
    });

    let score = 0;

      const processedAnswers = answers.map((ans) => {
      const question = questionMap[ans.questionId];

      if (!question) {
        return {
          questionId: ans.questionId,
          selectedAnswer: ans.selectedAnswer,
          isCorrect: false,
        };
      }

      const isCorrect =
        question.answer === ans.selectedAnswer;

      if (isCorrect) score++;

      return {
        questionId: ans.questionId,
        selectedAnswer: ans.selectedAnswer,
        isCorrect,
      };
    });

    const result = new Result({
      user: user?.id || null,
      name: user?.name || "Guest",
      score,
      totalQuestions: answers.length,
      answers: processedAnswers,
    });

    await result.save();

    res.json({
      message: "Result saved successfully",
      score,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;