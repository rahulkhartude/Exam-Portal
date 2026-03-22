const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {

  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashed,
    role:"student"  // Default role is "user". Admins should be created manually in the database.
  });

  await user.save();

  res.json(user);
});

router.post("/login", async (req, res) => {

  const { email, password } = req.body;
  const user = await User.findOne({ email });
 
  if (!user) return res.status(400).json({ message: "User not found" });

  // 🔐 If using bcrypt (recommended)
  const valid = await bcrypt.compare(password, user.password);

  if (!valid) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ id: user._id,name: user.name }, process.env.JWT_SECRET,{ expiresIn: "1h" });
   
  // ✅ 🔥 SEND USER ALSO
  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role   
    }
  });
});

module.exports = router;