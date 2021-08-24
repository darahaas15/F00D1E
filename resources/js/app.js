import axios from 'axios';
import Noty from 'noty';
import { initAdmin } from './admin';

let addCart = document.querySelectorAll('.add-cart');
let cartCounter = document.querySelector('#cartCounter');

function updateCart(items) {
  axios
    .post('/update-cart', items)
    .then((res) => {
      cartCounter.innerText = res.data.totalQty;
      new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Item added to cart',
        progressBar: false,
      }).show();
    })
    .catch((err) => {
      new Noty({
        type: 'error',
        timeout: 1000,
        text: 'Something went wrong',
        progressBar: false,
      }).show();
    });
}

addCart.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    let items = JSON.parse(btn.dataset.items);
    updateCart(items);
  });
});

//Remove "Order placed" message alert after 2 seconds
const alertMsg = document.querySelector('#success-alert');
if (alertMsg) {
  setTimeout(() => {
    alertMsg.remove();
  }, 2000);
}

initAdmin();
