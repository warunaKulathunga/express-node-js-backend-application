// controllers/authController.js
const jwt = require("jsonwebtoken");
const { auth } = require("../config/firebase");
const asyncHandler = require("express-async-handler");

// Utility function to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// User Registration
const register = async (req, res) => {
  const { email, password, phoneNumber } = req.body;

  try {
    if (!email || !password || !phoneNumber) {
      res.status(400);
      throw new Error("All Field Are Required");
    }

    const userRecord = await auth.createUser({
      email,
      password,
      phoneNumber,
    });

    const token = generateToken(userRecord.uid);

    res.status(201).json({
      token,
      email: userRecord.email,
      phoneNumber: userRecord.phoneNumber,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// User Login
const login = async (req, res) => {
  const { idToken } = req.body;

  try {
    if (!idToken) {
      res.status(400);
      throw new Error("ID Token is required");
    }

    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Fetch user details
    // const userRecord = await auth.getUser(userId);

    const token = generateToken(userId);

    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 2FA Validation
const validate2FA = async (req, res) => {
  const { code, verificationId } = req.body;

  try {
    const verificationResult = await auth.verifyPhoneNumber(
      verificationId,
      code
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { register, login, validate2FA };
