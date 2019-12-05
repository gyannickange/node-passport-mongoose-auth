const usefulService = {}

// Check if admin is logged
usefulService.isLogged = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login')
  }
  return next()
}

module.exports = usefulService