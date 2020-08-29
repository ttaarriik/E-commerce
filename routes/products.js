const express = require('express');
const Product = require('../models/product');

const router = express.Router();

router.get('/', async (req, res) => {
  const product = await Product.find({});
  res.render('products/index', {product, currentUser: req.user});
  
});

module.exports = router;
