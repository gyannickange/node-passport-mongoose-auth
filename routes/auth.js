const express = require('express')
const router = express.Router()
const csurf = require('csurf')
const csrfProtection = csurf({ cookie: true })

const auth = require('../controllers/auth')
const usefulService = require('../services/functions')

// Route for authentification
router.get('/', usefulService.isLogged, csrfProtection, auth.getHome)

router.get('/login', csrfProtection, auth.getLogin)

router.get('/register', csrfProtection, auth.getRegister)

router.post('/login', csrfProtection, auth.postLogin)

router.post('/logout', csrfProtection, auth.logout)

router.post('/register', csrfProtection, auth.postRegister)

module.exports = router