const { check, validationResult } = require('express-validator');
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    isLoggedIn: false,
    errorMessages: [],
    oldInput: { email: "" },
    user: {},
  });
};
exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    isLoggedIn: false,
    oldInput: { name: "", email: "", userType: "" },
    user: {},
    errorMessages: [],
  });
};

exports.postLogin =async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(422).render('auth/login', {
      pageTitle: 'Login',
      isLoggedIn: false,
      errorMessages: ['User does not exist'],
      oldInput: { email },
      user: {},
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(422).render('auth/login', {
      pageTitle: 'Login',
      isLoggedIn: false,
      errorMessages: ['Invalid password'],
      oldInput: { email },
      user: {},
    });
  }
  req.session.isLoggedIn = true;
  req.session.user = {
    // Keep session data JSON/BSON primitives only. Mongoose's ObjectId comes
    // from a newer BSON package than connect-mongodb-session uses.
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
  req.session.userType = user.userType;

  req.session.save(err => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
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

    bcrypt.hash(password, 12)
      .then(hashedPassword => {
        const user = new User({ name, email, password: hashedPassword, userType });
        return user.save();
      })
      .then(() => {
        console.log('User saved to database');
        return res.redirect('/login');
      })
      .catch(() => {
        return res.status(422).render('auth/signup', {
          pageTitle: 'Sign Up',
          isLoggedIn: false,
          errorMessages: ['Could not create the account. The email may already be registered.'],
          oldInput: {
            name,
            email,
            userType
          }
        });
      });
  }

];

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login")
  })
}
