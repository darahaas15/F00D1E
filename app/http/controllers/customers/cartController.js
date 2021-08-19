function cartController() {
  // factory function - simple function that returns an object
  return {
    index(req, res) {
      res.render('customers/cart');
    },
  };
}

module.exports = cartController;
