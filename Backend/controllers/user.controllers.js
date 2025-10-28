// controllers/user.controller.js
const userModel = require('../models/User_models');
const User = require('../models/User_models');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');

module.exports.registerUser = async (req, res, next) => {
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
};

module.exports.loginUser = async (req, res, next) => {
   
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ message: 'email and password are required' });
      }
  
      // fetch with password for comparison
      const user = await userModel.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const token = user.generateAuthToken();
  
      // never return hashed password
      const safeUser = user.toObject();
      delete safeUser.password;
  
      return res.status(200).json({ token, user: safeUser });
    
  };