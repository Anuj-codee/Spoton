const { check, validationResult } = require('express-validator');
const Home = require("../models/home");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    isLoggedIn: false,
  });
};
exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    isLoggedIn: false,
    oldInput: {name: "",email: "",userType: ""}
  });
};

exports.postLogin = (req,res,next) =>{
  console.log(req.body);
  req.session.isLoggedIn = true;
  // res.cookie("isLoggedIn",true);
  //req.isLoggedIn=true;
  res.redirect("/");
}



exports.postSignup = [

  // Name
  check('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long')
    .matches(/^[A-Za-z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),

  // Email
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),

  // Password
  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters long')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[@$!%*?&_]/)
    .withMessage('Password must contain at least one special character'),

  // Confirm password
  check('confirmPassword')
    .notEmpty()
    .withMessage('Confirm Password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  // User type
  check('userType')
    .notEmpty()
    .withMessage('User Type is required')
    .isIn(['host', 'guest'])
    .withMessage('Invalid User Type'),

  // Terms
  check('terms')
    .notEmpty()
    .withMessage('Please accept the terms and conditions'),

  // Final middleware
  (req, res, next) => {

    const { name, email, password, userType } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render('auth/signup', {
        pageTitle: 'Sign Up',
        isLoggedIn: false,

        errorMessages: errors.array().map(error => error.msg),

        oldInput: {
          name,
          email,
          userType
        }
      });
    }

    // Validation successful
    console.log('Validation successful');

    // TODO:
    // Save user to database here

    res.redirect('/login');
  }

];

exports.postLogout =(req,res,next) =>{
  req.session.destroy(()=>{
    res.redirect("/login")
  })
}
