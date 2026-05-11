const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password;
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password required" });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ msg: "Email already registered" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash });
    res.status(201).json({ id: user._id, email: user.email });
  } catch (err) {
    res.status(500).json({ msg: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ msg: "Invalid email or password" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ msg: "Invalid email or password" });

    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });
    res.json({ token, email: user.email });
  } catch {
    res.status(500).json({ msg: "Login failed" });
  }
});

module.exports = router;