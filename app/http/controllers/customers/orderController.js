const Order = require('../../../models/order');
function orderController() {
  return {
    store(req, res) {
      // Validate request
      const { phone, address, stripeToken, paymentType } = req.body;
      if (!phone || !address) {
        return res.status(422).json({ message: 'All fields are required' });
      }
      const order = new Order({
        customerId: req.user._id,
        items: req.session.cart.items,
        phone: phone,
        address: address,
      });
      order
        .save()
        .then((result) => {
          req.flash('success', 'Order placed sucessfully');
          return res.redirect('/customer/orders');
        })
        .catch((err) => {
          req.flash('error', 'Something went wrong');
          return res.redirect('/cart');
        });
    },
    async index(req, res) {
      const orders = await Order.find({ customerId: req.user._id });
      res.render('customers/orders', { orders: orders });
    },
  };
}
module.exports = orderController;
