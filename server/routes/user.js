const router = require("express").Router();
const { check } = require("express-validator");

const userCtrl = require("../controllers/user");

router.get(
  "/",
  [
    check("email", "Email is required").notEmpty(),
    check("email", "Invalid email").isEmail(),
  ],
  userCtrl.fetchUser
);
router.put(
  "/",
  [
    check("email", "Email is required").notEmpty(),
    check("email", "Invalid email").isEmail(),
    check("fname", "First Name is required").notEmpty(),
    check("fname", "Min 3 Characters required for First Name").isLength({
      min: 3,
    }),
    check("fname", "First Name should be a string").isString(),
    check("lname", "Last Name is required").notEmpty(),
    check("lname", "Min 3 Characters required for Last Name").isLength({
      min: 3,
    }),
    check("lname", "Last Name should be a string").isString(),
  ],
  userCtrl.updateUser
);
router.put(
  "/passwordUpdate",
  [
    check("email", "Email is required").notEmpty(),
    check("email", "Invalid email").isEmail(),
    check("password", "Password is required").notEmpty(),
    check(
      "password",
      "Password should be at least 6 to 12 characters along with an uppercase, a lowercase and a special character"
    ).isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
    }),
    check(
      "Password",
      "Password should be at least 6 to 12 characters along with an uppercase, a lowercase and a special character"
    ).isLength({ max: 12 }),
    check("oldPassword", "Old Password is required").notEmpty(),
    check(
      "oldPassword",
      "Old Password should be at least 6 to 12 characters along with an uppercase, a lowercase and a special character"
    ).isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
    }),
    check(
      "oldPassword",
      "Old Password should be at least 6 to 12 characters along with an uppercase, a lowercase and a special character"
    ).isLength({ max: 12 }),
  ],
  userCtrl.updatePassword
);

module.exports = router;
