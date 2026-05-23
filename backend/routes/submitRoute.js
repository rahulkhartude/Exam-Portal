
const express = require("express");
const router = express.Router();

const Result = require("../models/Result");
const Question = require("../models/Question");
const Setting = require("../models/Setting");
const User = require("../models/User");
const auth = require("../middleware/auth");

// POST /api/result/submit
router.post("/submit", auth, async (req, res) => {
  try {
    const { answers } = req.body;

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

      const isCorrect = question.answer === ans.selectedAnswer;

      if (isCorrect) score++;

      return {
        questionId: ans.questionId,
        selectedAnswer: ans.selectedAnswer,
        isCorrect,
      };
    });

    // Prefer authenticated user info from token
    const authUser = req.user;
    const result = new Result({
      user: authUser?.id || null,
      name: authUser?.name || "Guest",
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


// GET /api/result/me - get latest result for authenticated user
// Returns: { latest: Result|null, canRetake: boolean, nextAvailableAt: Date|null }
router.get("/me", auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const latest = await Result.findOne({ user: userId }).sort({ createdAt: -1 });

    // Admin-configurable cooldown (hours). Default 24 hours.
    let cooldownHours = Number(process.env.EXAM_COOLDOWN_HOURS) || 24;

    // try to read setting from DB
    try {
      const s = await Setting.findOne({ key: 'exam_cooldown_hours' });
      if (s && !isNaN(Number(s.value))) {
        cooldownHours = Number(s.value);
      }
    } catch (e) {
      console.error('Error reading settings:', e.message);
    }

    // Fetch user to allow per-user bypass or role checks
    const user = await User.findById(userId);

    // Special-case: allow unlimited retakes for test account or explicit user bypass
    const testBypassEmails = ["student@gmail.com"];
    const isBypassed = user && (user.retakeBypass || testBypassEmails.includes(user.email));

    let canRetake = true;
    let nextAvailableAt = null;

    if (!isBypassed) {
      if (!latest) {
        canRetake = true;
      } else {
        const next = new Date(latest.createdAt);
        next.setHours(next.getHours() + cooldownHours);
        nextAvailableAt = next;
        canRetake = new Date() >= next;
      }
    }

    res.json({ latest: latest || null, canRetake, nextAvailableAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// GET /api/result/all - admin only: list all results
router.get("/all", auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const results = await Result.find().sort({ createdAt: -1 }).populate('user', 'name email');

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;