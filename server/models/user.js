const mongoose = require("mongoose");
const hash = require("../utils/hash");
const jwt = require('jsonwebtoken');
const jwtsecret = '8531b17998123b1e068999df6c385ed95ec45a88157fdf4a582249c8bd254023c158c9';

const userSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
      minlength: 3,
    },
    lname: {
      type: String,
      required: true,
      minlength: 3,
    },
    role: {
      type: Boolean,
      default: 0,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 100,
    },
    tokens : [{
      token:{
        type:String,
        required: true
      }
    }]
  },
  { 
    timestamps: true 
  } 
);

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

//hashing a password before saving it to the database
userSchema.pre("save", function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = hash.encrypt(user.password);
  }
  next();
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({
      email: email.toUpperCase()
    });
  if (!user || !hash.validPassword(password,user.password)){
      return null;
  }
  return user;
}

userSchema.methods.generateAuthToken = async function(){
  const user = this;
  const maxAge = 3*60*60;
  const token = jwt.sign({
    _id: user._id.toString(), email: user.email, role: user.role}, 
    jwtsecret,{
    expiresIn: maxAge,
    });
  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token;
}

var User = mongoose.model('User', userSchema);
module.exports = User;