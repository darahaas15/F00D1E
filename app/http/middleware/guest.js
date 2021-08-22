function guest(req, res, next) {
  //Function to make sure that customer cannot access login and register routes once already logged in
  if (!req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/');
}

module.exports = guest;
