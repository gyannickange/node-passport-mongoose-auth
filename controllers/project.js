const Project = require('../models/project')

const projectController = {}

// Get projects
projectController.getProjects = async (req, res) => {
  const projects = await Project.find().sort('createdAt')

  res.render('projects/list', {
    projects,
    messages: req.flash('messages'),
    errors: req.flash('errors'),
    csrfToken: req.csrfToken()
  })
}

// Get profile by id
projectController.getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id)

  res.render('projects/edit', {
    project,
    messages: req.flash('messages'),
    errors: req.flash('errors'),
    csrfToken: req.csrfToken()
  })
}

// Get new project
projectController.getNewProject = (req, res) => {
  res.render('projects/new', {
    messages: req.flash('messages'),
    errors: req.flash('errors'),
    csrfToken: req.csrfToken()
  })
}

// Add project
projectController.postProject = async (req, res, next) => {
  let newProject = new Project({
    name: req.body.name,
    description: req.body.description,
  })
  newProject = await newProject.save()

  req.flash('messages', `The project has been successfully created.`);
  res.redirect('/projects')
}

// Update project
projectController.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })
    req.flash('messages', 'Your project has been correctly updated.') 
    res.redirect('back')
  } catch (e) {
    return next(e)
  }
}

// Delete project
projectController.removeProject = async (req, res, next) => {
  console.log(req.params.id, 'req.params.id')
  const project = await Project.findByIdAndRemove(req.params.id)
  
  req.flash('errors', 'The user has been deleted.')
  res.redirect('back')
}

module.exports = projectController