const express = require('express');
const multer = require('multer');
const router = express.Router();
const { requireAuth } = require("./middleware");
const { handleErrors } = require('./middleware');
const Product = require("../../models/product");
const { requireTitle, requirePrice } = require('./validators');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/admin/products', requireAuth, async (req, res) => {
  const products = await Product.find({});
	res.render('admin/products/index', {products});
});

router.get('/admin/products/new', requireAuth, (req, res) => {
 	res.render("admin/products/new");
});

router.post('/admin/products/new',requireAuth, upload.single('image'),
	[requireTitle, requirePrice],
	handleErrors('admin/products/new'),
  async (req, res) => {
    const image = req.file.buffer.toString('base64');
	const { title, price } = req.body;
    await Product.create({title, price, image});
	
	res.redirect('/admin/products');
  }
);

router.get('/admin/products/:id/edit', requireAuth, async (req, res) => {
  const product = await Product.findById(req.params.id).exec();
  if (!product) {
    return res.send('Product not found');
  }
	res.render('admin/products/edit', {product});

});

router.put(
  '/admin/products/:id/edit',
  requireAuth,
  upload.single('image'),
  [requireTitle, requirePrice],
	handleErrors('admin/products/edit'),
  async (req, res) => {
	 const updatedProduct = {title: req.body.title, price: req.body.price};
	 await Product.findByIdAndUpdate(req.params.id, updatedProduct);
		
	res.redirect('/admin/products');
	
  }
);

router.delete('/admin/products/:id/delete', requireAuth, async (req, res) => {
	await Product.findByIdAndDelete(req.params.id);
  res.redirect('/admin/products');
});



module.exports = router;
