const mongoose = require("mongoose");
const hash = require("../utils/hash");

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
    }
  },
  { timestamps: true }
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
      return 'Unable to login';
  }
  return user;
}

var User = mongoose.model('User', userSchema);
module.exports = User;