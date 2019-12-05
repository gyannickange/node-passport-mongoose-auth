const express = require('express')
const router = express.Router()
const csurf = require('csurf')
const csrfProtection = csurf({ cookie: true })

const adminController = require('../controllers/admin')
const usefulService = require('../services/functions')

// Route for admin
router.get('/', usefulService.isLogged, csrfProtection, adminController.getAdmins)

router.get('/new', usefulService.isLogged, csrfProtection, adminController.getNewAdmin)

router.get('/profile', usefulService.isLogged, csrfProtection, adminController.getProfile)

router.post('/profile', usefulService.isLogged, csrfProtection, adminController.updateProfile)

router.post('/update-password', usefulService.isLogged, csrfProtection, adminController.updatePassword)

router.post('/update-email', usefulService.isLogged, csrfProtection, adminController.updateEmail)

router.post('/new', usefulService.isLogged, csrfProtection, adminController.postAdmin)

router.post('/remove/:id', csrfProtection, adminController.removeAdmin)

module.exports = router