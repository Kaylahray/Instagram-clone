const {
  generateAccessToken,
  generateRefreshToken,
  generateHashedPassword,
  checkHashedPassword,
} = require("../middlewares/token.middleware");
const User = require("../models/user");

const userSignup = async (req, res) => {
  try {
    const {
      name,
      username,
      gender,
      email,
      password,
      phoneNumber,
      website,
      bio,
      accountType,
    } = req.body;

    // Check if user exists
    const checkUser = await User.findOne({ email: email });
    if (checkUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Create hashed password
    const hashedPassword = await generateHashedPassword(password);
    const privateInfoDetails = {
      gender: gender,
      phoneNumber: phoneNumber,
      email: email,
    };

    // Create new user and required fields
    const newUser = new User({
      name,
      username,
      website,
      bio,
      accountType,
      privateInfo: privateInfoDetails,
      password: hashedPassword,
    });
    const accessToken = await generateAccessToken(newUser._id);
    const refreshToken = await generateRefreshToken(newUser._id);
    newUser.refreshToken = refreshToken;
    newUser.save();

    return res.status(200).json({
      message: "User created Successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error Occured!" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkUser = await User.findOne({ 'privateInfo.email': email });
    if (!checkUser) {
      return res.status(404).send({ message: "User does not exist!" });
    }

    const checkPassword = await checkHashedPassword(checkUser, password);
    if (!checkPassword) {
      return res.status(400).send({ message: "Invalid Login Details" });
    }

    const newRefreshToken = generateRefreshToken(checkUser._id);
    checkUser.refreshToken = newRefreshToken;
    await checkUser.save();
    res.status(200).send({
      message: "Sign in Successful!",
      token: generateAccessToken(checkUser._id),
      refreshToken: checkUser.refreshToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "A Server Error Occured!" });
  }
};

module.exports = {
  userLogin,
  userSignup,
};
