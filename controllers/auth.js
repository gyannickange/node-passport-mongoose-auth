const Admin = require('../models/admin')

const crypto = require('crypto');
const uuid = require('uuid')

const passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

const authController = {}

const verifyEmailAndPassword = async (email, password, done) => {
  let shaSum = crypto.createHash('sha256')
  shaSum.update(password)
  const admin = await Admin.findOne({ email: email, password: shaSum.digest('hex') })
  
  if (!admin) {
    return done(null, false, {message: 'Email ou Mot de Passe Incorrect.'})
  }

  return done(null, admin);
}

passport.use(new LocalStrategy(
  {usernameField: 'email', passwordField: 'password'},
  verifyEmailAndPassword
))

passport.serializeUser((admin, done) => {
  done(null, admin.id)
})

passport.deserializeUser((id, done) => {
  Admin.findById(id, done)
})

// Get Dashboard
authController.getHome = (req, res) => {
  res.render('index', {
    messages: req.flash('messages'),
    errors: req.flash('errors'),
    csrfToken: req.csrfToken()
  })
}

// Go To login
authController.getLogin = (req, res) => {
  res.render('auth/login', {
    messages: req.flash('messages'),
    errors: req.flash('errors'),
    csrfToken: req.csrfToken()
  })
}

// Go To register
authController.getRegister = (req, res) => {
  res.render('auth/register', {
    messages: req.flash('messages'),
    errors: req.flash('errors'),
    csrfToken: req.csrfToken()
  })
}

// Post registration
authController.postRegister = async (req, res, next) => {
  const admin = await Admin.findOne({ email: req.body.email })
  
  if (admin) {
    req.flash('errors', 'Email already exist')
    return res.redirect('back')
  }
  
  let shaSum = crypto.createHash('sha256')
  shaSum.update(req.body.password)
  let newAdmin = new Admin({
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: shaSum.digest('hex'),
    confirmationToken: uuid(),
  })
  newAdmin = await newAdmin.save()

  passport.authenticate('local', {
    successRedirect: '/admins',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next)
}

// Post login
authController.postLogin = (req, res, next) => {
  return passport.authenticate('local', {
    successRedirect: '/admins',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next)
};

// Post logout
authController.logout = (req, res) => {
  if (req.isAuthenticated()) {
    req.logout()
    res.redirect('/login')
  }
};


module.exports = authController