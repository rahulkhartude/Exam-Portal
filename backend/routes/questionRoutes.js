
const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const auth = require("../middleware/auth");
const Result = require("../models/Result");
const User = require("../models/User");
const Setting = require("../models/Setting");


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
// ✅ GET 20 QUESTIONS
// =======================
router.get("/", async (req, res) => {
  try {
    const questions = await Question.aggregate([
      { $sample: { size: 20 } },
      { $project: { answer: 0 } }
    ]);

    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching questions" });
  }
});

router.get("/allforAdmin",async (req, res) => {
  try {
    const questions = await Question.find();

    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching questions" });
  }
});

// Admin: GET /api/admin/settings - returns all settings (admin only)
router.get("/settings", auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const settings = await Setting.find();
    const obj = {};
    settings.forEach((s) => {
      obj[s.key] = s.value;
    });

    res.json(obj);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching settings" });
  }
});

// Admin: PUT /api/admin/settings - update settings (admin only)
router.put("/settings", auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const updates = req.body || {};
    const keys = Object.keys(updates);
    for (const key of keys) {
      const value = updates[key];
      await Setting.findOneAndUpdate({ key }, { value, updatedAt: new Date() }, { upsert: true, new: true });
    }

    const settings = await Setting.find();
    const obj = {};
    settings.forEach((s) => {
      obj[s.key] = s.value;
    });

    res.json(obj);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating settings" });
  }
});

// Admin: GET /api/admin/results - list all results (admin only)
router.get("/results", auth, async (req, res) => {
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
    res.status(500).json({ message: "Error fetching results" });
  }
});

// Admin: GET /api/admin/users - list all users for retake bypass management
router.get("/users", auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.find({}, "name email role retakeBypass").sort({ name: 1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Admin: PUT /api/admin/users/:id/retake-bypass - toggle per-user bypass
router.put("/users/:id/retake-bypass", auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const admin = await User.findById(userId);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { retakeBypass } = req.body;
    if (typeof retakeBypass !== "boolean") {
      return res.status(400).json({ message: "retakeBypass must be a boolean" });
    }

    targetUser.retakeBypass = retakeBypass;
    await targetUser.save();

    res.json({
      id: targetUser._id,
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role,
      retakeBypass: targetUser.retakeBypass,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating user" });
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