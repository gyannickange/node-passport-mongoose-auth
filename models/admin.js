var mongoose = require('mongoose')

var AdminSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  firstname: String,
  lastname: String,
  phonenumber: String,
  password: String,
  cover: String,
  role: { type: String, enum: ['admin', 'user'], default: 'admin' },
  confirmationToken: String,
  confirmed: { type: Boolean, default: false },
}, {
  timestamps: true,
})

module.exports = mongoose.model('Admin', AdminSchema)