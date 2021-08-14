function homeController() {
  // factory function - simple function that returns an object
  return {
    index() {
      res.render('home');
    },
  };
}
