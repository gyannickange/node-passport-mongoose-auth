const nodemailer = require('nodemailer')
const Email = require('email-templates')

const config = require('../config')

const email = new Email({
  message: {
    from: config.mail.defaults.from
  },
  transport: {
    jsonTransport: true
  },
  views: {
    options: {
      extension: 'njk'
    }
  }
})
let transporter
let from = config.mail.defaults.from

module.exports = {
  init () {
    transporter = nodemailer.createTransport({
      host: 'smtp.sparkpostmail.com',
      port: 587,
      secure: false,
      auth: {
        user: config.mail.config.auth.user,
        pass: config.mail.config.auth.pass
      }
    })
  },
  sendMail(template, to, subject, context, callback) {
    let mailOptions = {
      from,
      to,
      subject, 
    };
    email
      .render(template, context)
      .then((html) => {
        let mailOptions = {
          from,
          to,
          subject, 
          html: html
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return cb(error)
          }

          console.log('Message sent: %s', info.messageId)
          callback()
        })
      })
      .catch(console.error)
  }
}