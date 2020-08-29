const express = require('express');
const Cart = require('../models/cart');
const Product = require("../models/product");

const router = express.Router();

// Receive a post request to add an item to a cart
router.post('/cart/products', async (req, res) => {
  // Figure out the cart!
  let cart;
  if (!req.session.cartId) {
    // We dont have a cart, we need to create one,
    // and store the cart id on the req.session.cartId
    // property
    cart = await Cart.create({ items: [] });
    req.session.cartId = cart._id;
  } else {
    // We have a cart! Lets get it from the repository
    cart = await Cart.findById(req.session.cartId).exec();
  }

  const existingItem = cart.items.find(item => item.id === req.body.productId);
  if (existingItem) {
    // increment quantity and save cart
    existingItem.quantity++;
  } else {
    // add new product id to items array
    cart.items.push({ id: req.body.productId, quantity: 1 });
	
  }
  await Cart.findByIdAndUpdate(cart._id, {
    items: cart.items
  });

  res.redirect("/cart");
});

// Receive a GET request to show all items in cart
router.get("/cart", async (req, res) => {
  if(!req.session.cartId){
    return res.redirect("/");
  }

  const cart = await Cart.findById(req.session.cartId);

  for(let item of cart.items){
    const product = await Product.findById(item.id);

    item.product = product;
  }
	console.log('cart items:', cart.items.title);

  res.render('carts/show', { items: cart.items, currentUser: req.user});
})

// Receive a post request to delete an item from a cart
router.delete("/cart/products/delete", async (req, res) => {
  const itemId = req.body.productId;
  const cart = await Cart.findById(req.session.cartId);

  const items = cart.items.filter(item => item.id !== itemId);

  await Cart.findByIdAndUpdate(cart.id, { items });

  res.redirect("/cart");
})

module.exports = router;
