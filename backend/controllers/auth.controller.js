const prisma = require("../config/db");

const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "USER",
      },
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User with that email does not exist" });
    }

    // 2. Generate a special reset token (valid for 15 mins)
    // We sign it with the user's password hash so it becomes invalid if password changes
    const secret = process.env.JWT_SECRET + user.password;
    const token = jwt.sign({ id: user.id, email: user.email }, secret, {
      expiresIn: "15m",
    });

    // 3. Create reset link
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset-password/${user.id}/${token}`;

    const message = `
      <h1>Password Reset Request</h1>
      <p>Click the link below to reset your password. This link is valid for 15 minutes.</p>
      <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    // 4. Send Email
    await sendEmail({
      email: user.email,
      subject: "Password Reset Token",
      message: `Reset link: ${resetUrl}`,
      html: message,
    });

    res.status(200).json({ message: "Password reset link sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Details: " + error.message });
  }
};
