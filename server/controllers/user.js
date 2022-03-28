const { validationResult } = require("express-validator");
const hash = require("../utils/hash");

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
          res.status(409).json({
            ...errors[409],
            data: `Authentication failed!`
          });
        } else {
          const maxAge = 3*60*60;
          const token = await user.generateAuthToken();

          // res.cookie("jwt",token,{
          //   httpOnly: true,
          //   maxAge : maxAge * 1000,
          // })
          // res.cookie("user",user,{
          //   httpOnly: true,
          //   maxAge : maxAge * 1000,
          // })
          console.log(user)
          res.status(200).json({user, token:{value: token, expiresAt: maxAge}});
        }
    }
    
  } catch(err){
      next(err);
    }
}

const updatePassword = async (req,res,next) => {
  try{
    const err= validationResult(req)
    if(!err.isEmpty()){
      throw {
        data: err.array()
      }
    }
    else{
      const {email, password} = req.body
      const existinguser = await User.findOne({email: email.toUpperCase()})
      if(!existinguser){
        //INVALID EMAIL ID
        res.status(404).json({...errors[404] })
      }
      else{
        //USER EXISTS AND UPDATE NEW PASSWORD
        const hashedpwd = hash.encrypt(password);
        await User.updateOne({_id: existinguser._id}, {password: hashedpwd})
        res.status(200).send(true)
      }
    }
  }
  catch(err){
    next(err)
  }
}

exports.signup = signup;
exports.login = login;
exports.updatePassword = updatePassword