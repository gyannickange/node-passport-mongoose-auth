const crypto = require('crypto')
const uuid = require('uuid')
const shortid = require('shortid')

const Admin = require('../models/admin')
const adminController = {}

// Get admins
adminController.getAdmins = async (req, res) => {
  const admins = await Admin.find().sort('lastname')

  res.render('admins/list', {
    admins,
    messages: req.flash('messages'),
    errors: req.flash('errors'),
    csrfToken: req.csrfToken()
  })
}

// Get new admin
adminController.getNewAdmin = (req, res) => {
  res.render('admins/new', {
    messages: req.flash('messages'),
    errors: req.flash('errors'),
    csrfToken: req.csrfToken()
  })
}

// Get profile
adminController.getProfile = (req, res) => {
  res.render('admins/profile', {
    messages: req.flash('messages'),
    errors: req.flash('errors'),
    csrfToken: req.csrfToken()
  })
}

// Update profile
adminController.updateProfile = async (req, res, next) => {
  let params = {
    firstname: req.body.firstname,
    lastname: req.body.lastname
  }

  const admin = await Admin.findByIdAndUpdate(req.user._id, params, {
    new: true
  })
  req.flash('messages', 'Your information has been correctly updated.') 
  res.redirect('back')
}

// Update password
adminController.updatePassword = async (req, res, next) => {
  let currentPassword = req.body.currentPassword
  let newPassword = req.body.newPassword
  let confirmPassword = req.body.confirmPassword

  let shaSumPass = crypto.createHash('sha256')
  shaSumPass.update(currentPassword)

  const admin = await Admin.findOne({ email: req.user.email, password: shaSumPass.digest('hex') })

  if (!admin) {
    req.flash('errors', 'The password is wrong!')
    return res.redirect('back')
  }
  
  if (newPassword != confirmPassword) {
    req.flash('errors', 'The new passwords are not the same!')
    return res.redirect('back')
  }

  let shaSumNewPass = crypto.createHash('sha256')
  shaSumNewPass.update(newPassword)

  const updatedAdmin = await Admin.findByIdAndUpdate(req.user._id, { password: shaSumNewPass.digest('hex') })

  req.flash('messages', 'Your password has been correctly updated!')
  res.redirect('back')
}

// Update Email
adminController.updateEmail = async (req, res, next) => {
  var currentemail = req.body.currentemail
  var newemail = req.body.newemail
  var password = req.body.password

  let shaSum = crypto.createHash('sha256')
  shaSum.update(password)

  const admin = await Admin.findOne({ email: currentemail, password: shaSum.digest('hex') })
  
  if (!admin) {
    req.flash('errors', 'The password email is wrong!');
    return res.redirect('back');
  }

  const exist = await Admin.findOne({ email: newemail })

  if (exist) {
    req.flash('errors', 'The email address is already used');
    return res.redirect('back');
  }

  const updatedAdmin = await Admin.findByIdAndUpdate(req.user._id, { email: newemail })

  req.flash('messages', 'Your email address has been correctly updated!')
  res.redirect('back')
}

// Add admin
adminController.postAdmin = async (req, res, next) => {
  const admin = await Admin.findOne({ email: req.body.email })
  
  if (admin) {
    req.flash('errors', 'Email already exist')
    return res.redirect('back')
  }
  
  let password = shortid.generate()
  let shaSum = crypto.createHash('sha256')
  shaSum.update(password)

  let newAdmin = new Admin({
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: shaSum.digest('hex'),
    firstname: req.body.firstname,
    confirmationToken: uuid(),
  })
  newAdmin = await newAdmin.save()

  req.flash('messages', `The admin has been successfully created with password ${password}. Copy before reloading the page`)
  res.redirect('/admins')
}

// Remove admin
adminController.removeAdmin = async (req, res, next) => {
  const admin = await Admin.findByIdAndRemove(req.params.id)
  
  req.flash('errors', 'The user has been deleted.')
  res.redirect('back')
}

module.exports = adminController