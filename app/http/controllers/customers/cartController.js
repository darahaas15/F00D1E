function cartController() {
  // factory function - simple function that returns an object
  return {
    index(req, res) {
      res.render('customers/cart');
    },
    update(req, res) {
      return res.json({ data: 'All OK' });
    },
  };
}

module.exports = cartController;
