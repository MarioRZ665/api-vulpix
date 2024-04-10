const User = require('../models/User');
const Blacklist = require ('../models/Blacklist.js');

exports.createUser = async (req, res) => {
	 // get required variables from request body
  // using es6 object destructing
  const { first_name, last_name, email, password } = req.body;
  try {
    // create an instance of a user
    const newUser = new User({
      first_name,
      last_name,
      email,
      password,
    });
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        status: 'failed',
        data: [],
        message: 'It seems you already have an account, please log in instead.',
      });
    const savedUser = await newUser.save(); // save new user into the database
    const { role, ...user_data } = savedUser._doc;
    res.status(200).json({
      status: 'success',
      data: [user_data],
      message:
        'Thank you for registering with us. Your account has been successfully created.',
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      code: 500,
      data: [],
      message: 'Internal Server Error',
    });
  }
};

exports.Logout = async (req, res) => {
  try {
    const authHeader = req.headers['cookie']; // get the session cookie from request header
    if (!authHeader) return res.sendStatus(204); // No content
    const cookie = authHeader.split('=')[1]; // If there is, split the cookie string to get the actual jwt token
    const accessToken = cookie.split(';')[0];
    const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken }); // Check if that token is blacklisted
    // if true, send a no content response.
    if (checkIfBlacklisted) return res.sendStatus(204);
    // otherwise blacklist token
    const newBlacklist = new Blacklist({
      token: accessToken,
    });
    await newBlacklist.save();
    // Also clear request cookie on client
    res.setHeader('Clear-Site-Data', '"cookies"');
    res.status(200).json({ message: 'You are logged out!' });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};

