const asyncHandler = require("express-async-handler");
const User = require("../model/userModels");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

//@desc Register a user
//@route POST api/user/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, phone_number } = req.body;

  if (!email || !password || !phone_number) {
    res.status(400);
    throw new Error("All Field Are Required");
  }

  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User Already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: hashedPassword,
    phone_number,
  });

  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data are not valid");
  }

  res.json({ message: "Register the user" });
});

//@desc Register a user
//@route POST api/user/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("All Field Are Required");
  }

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = await jwt.sign(
      {
        user: {
          // username: user.username,
          email: user.email,
          id: user._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "45m" }
    );

    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Email or Password is not valid");
  }
});

//@desc Current user
//@route POST api/user/login
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser };
