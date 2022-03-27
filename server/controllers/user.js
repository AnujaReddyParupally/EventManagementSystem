const { validationResult } = require("express-validator");
const hash = require("../utils/hash");
const User = require("../models/user");
const errors = require("../config/errors.json");

const signup = async (req, res, next) => {
  try {
    const err = validationResult(req);
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
      res.status(200).json(user);
    }
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      throw {
        ...errors[401],
        data: "Auth Failed",
      };
    } else {
      const user = await User.findOne({ email: req.body.email.toUpperCase() });
      if (user) {
        if (hash.decrypt(user.password, req.body.password)) {
          res.status(200).json(user);
        } else {
          res.status(401).json({
            ...errors[401],
            data: `Auth Failed`,
          });
        }
      } else {
        res.status(401).json({
          ...errors[401],
          data: `Auth Failed`,
        });
      }
    }
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      throw {
        ...errors[401],
        data: "Auth Failed",
      };
    } else {
      const { email, password } = req.body;
      const existinguser = await User.findOne({ email: email.toUpperCase() });
      if (!existinguser) {
        //INVALID EMAIL ID
        res.status(404).json({ ...errors[404] });
      } else {
        //USER EXISTS AND UPDATE NEW PASSWORD
        const hashedpwd = hash.encrypt(password);
        await User.updateOne(
          { _id: existinguser._id },
          { password: hashedpwd }
        );
        res.status(200).send(true);
      }
    }
  } catch (err) {
    next(err);
  }
};

exports.fetchUser = async (req, res, next) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      throw {
        ...errors[403],
        data: err.array(),
      };
    }
    const user = await User.findOne({ email: req.body.email.toUpperCase() });
    if (!user) {
      throw {
        ...errors[404],
      };
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      throw {
        ...errors[401],
        data: err.array(),
      };
    }
    const ChangeUser = await User.findOneAndUpdate(
      { email: req.body.email.toUpperCase() },
      { fname: req.body.fname, lname: req.body.lname }
    );
    if (!ChangeUser) {
      res.status(404).json({ ...errors[404] });
    } else {
      const user = await User.findOne({
        email: req.body.email.toUpperCase(),
      });
      res.status(200).send(user);
    }
  } catch (err) {
    next(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      throw {
        ...errors[401],
        data: err.array(),
      };
    }
    const user = await User.findOne({ email: req.body.email.toUpperCase() });
    if (user) {
      if (hash.decrypt(user.password, req.body.oldPassword)) {
        await User.updateOne(
          { _id: user._id },
          { password: hash.encrypt(req.body.password) }
        );
        res.status(200).send(true);
      } else {
        res.status(401).json({
          ...errors[401],
          data: `Auth Failed`,
        });
      }
    } else {
      res.status(401).json({
        ...errors[401],
        data: `Auth Failed`,
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.signup = signup;
exports.login = login;
exports.forgotPassword = forgotPassword;
