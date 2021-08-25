const Order = require('../../../models/order');
const moment = require('moment');
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
          Order.populate(result, { path: 'customerId' }, (err, placedOrder) => {
            req.flash('success', 'Order placed sucessfully');
            delete req.session.cart;
            //Emitter
            const eventEmitter = req.app.get('eventEmitter');
            eventEmitter.emit('orderPlaced', result);
            return res.redirect('/customer/orders');
          });
        })
        .catch((err) => {
          req.flash('error', 'Something went wrong');
          return res.redirect('/cart');
        });
    },
    async index(req, res) {
      //Sort in the descending order of times ordered at
      const orders = await Order.find({ customerId: req.user._id }, null, {
        sort: { createdAt: -1 },
      });
      //Makes sure that the order wont be taken again on pressing back button and forward button by deleting cache
      res.header(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'
      );
      res.render('customers/orders', { orders: orders, moment: moment });
    },
    async show(req, res) {
      const order = await Order.findById(req.params.id);
      // Authorize user
      if (req.user._id.toString() === order.customerId.toString()) {
        return res.render('customers/track', { order });
      }
      return res.redirect('/');
    },
  };
}
module.exports = orderController;
