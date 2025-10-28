// controllers/user.controller.js
const User = require('../models/User_models');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');

module.exports.registerUser = async (req, res, next) => {
  try {
    // express-validator result
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { fullname, email, password } = req.body || {};
    const firstname = fullname?.firstname;
    const lastname  = fullname?.lastname;

    // basic guards to avoid undefined destructure later
    if (!firstname || !email || !password) {
      return res.status(400).json({ message: 'firstname, email, and password are required' });
    }

    const hashedPassword = await User.hashPassword(password);
    const user = await userService.createUser({
      firstname,
      lastname: lastname || '',
      email,
      password: hashedPassword,
    });

    const token = user.generateAuthToken();
    return res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
};
