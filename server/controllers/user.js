const { validationResult } = require("express-validator");

const User = require("../models/user");
const errors = require("../config/errors.json");

const signup = async (req, res, next) => {

  try {
    const err = validationResult(req);
    console.log(err)
    if (!err.isEmpty()) {
      throw {
        ...errors[400],
        data: err.array(),
      };
    }
    const checkUser = await User.findOne({
      email: req.body.email.toUpperCase(),
    });
    if (checkUser) {
      res.status(409).json({
        ...errors[409],
        data: `User with email : ${req.body.email} already exists`,
      });
    } else {
      let user = new User({
        fname: req.body.fname,
        lname: req.body.lname,
        role: req.body.role,
        email: req.body.email.toUpperCase(),
        password: req.body.password,
      });
      user = await user.save();
      res.status(200).json({ user });
    }
  } catch (err) {
    next(err);
  }
};

const login = async(req,res,next) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      throw {
        data: err.array(),
      };
    } else {
      const user = await User.findByCredentials(req.body.email, req.body.password);
      if (!user){
          res.status(400).json({
            data: `{user}`,
          });
        } else {
          res.status(200).json({user});
        }
    }
    
  } catch(err){
      next(err);
    }
}

exports.signup = signup;
exports.login = login;