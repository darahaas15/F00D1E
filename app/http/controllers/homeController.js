function homeController() {
  // factory function - simple function that returns an object
  return {
    index(req, res) {
      res.render('home');
    },
  };
}

module.exports = homeController;
