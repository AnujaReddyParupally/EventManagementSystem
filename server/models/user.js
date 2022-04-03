const mongoose = require("mongoose");
const hash = require("../utils/hash");
const jwt = require('jsonwebtoken');

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
      maxlength: 12,
    },
    tokens : [{
      token:{
        type:String,
        required: true
      }
    }]
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  user.email = user.email.toLowerCase()
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
  if (!user || !hash.decrypt(user.password,password)){
      return null;
  }
  return user
}

userSchema.methods.generateAuthToken = async function(){
  const user = this;
  const maxAge = 3*60*60;
  const token = jwt.sign(
    {
     _id: user._id.toString(), 
     email: user.email, 
     role: user.role
    }, 
    process.env.JWT_SECRET,
    {
      algorithm: 'HS512',
      expiresIn: maxAge,
    });
  //user.tokens = user.tokens.concat({ token })
  await user.updateOne({_id: user._id},{tokens: user.tokens.concat({token})})
  console.log('done')
  return token;
}

var User = mongoose.model('User', userSchema);
module.exports = User;