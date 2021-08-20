const User = require('../../models/user');
function authController() {
  // factory function - simple function that returns an object
  return {
    login(req, res) {
      res.render('auth/login');
    },
    register(req, res) {
      res.render('auth/register');
    },
    postRegister(req, res) {
      const { name, email, password } = req.body;
      //Validate request
      if (!name || !email || !password) {
        req.flash('error', 'All fields are required');
        req.flash('name', name);
        req.flash('email', email);
        return res.redirect('/register');
      }
      // Check if email exists
      User.exists({ email: email }, (err, result) => {
        if (result) {
          req.flash('error', 'Email already taken');
          req.flash('name', name);
          req.flash('email', email);
          return res.redirect('/register');
        }
      });
      // Create a user
      const user = new User({
        name: name,
        email: email,
        password: password,
      });
    },
  };
}

module.exports = authController;
