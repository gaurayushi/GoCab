// controllers/user.controller.js
const User = require('../models/User_models');                  // model file is models/user.js
const userService = require('../services/user.service'); // business logic
const { validationResult } = require('express-validator');

module.exports.registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { firstname, lastname, email, password } = req.body;

    const hashedPassword = await User.hashPassword(password);
    const user = await userService.createUser({
      firstname, lastname, email, password: hashedPassword,
    });

    const token = user.generateAuthToken();
    return res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
};
