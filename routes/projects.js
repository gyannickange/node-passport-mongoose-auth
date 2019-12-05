const express = require('express')
const router = express.Router()
const csurf = require('csurf')
const csrfProtection = csurf({ cookie: true })

const projectController = require('../controllers/project')
const usefulService = require('../services/functions')

// Route for project
router.get('/', usefulService.isLogged, csrfProtection, projectController.getProjects)

router.get('/new', usefulService.isLogged, csrfProtection, projectController.getNewProject)

router.get('/edit/:id', usefulService.isLogged, csrfProtection, projectController.getProjectById)

router.post('/new', csrfProtection, projectController.postProject)

router.post('/update/:id', csrfProtection, projectController.updateProject)

router.post('/remove/:id', csrfProtection, projectController.removeProject)

module.exports = router