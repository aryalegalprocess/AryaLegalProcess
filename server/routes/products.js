module.exports = function(Product) {
  const express = require('express');
  const router = express.Router();

  // Add a new product
  router.post('/', async (req, res) => {
    try {
      const newProduct = new Product(req.body);
      await newProduct.save();
      res.status(201).json({ message: 'Product added!' });
    } catch (err) {
      console.error('Error saving product:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Get all products
  router.get('/', async (req, res) => {
    try {
      const products = await Product.find({}, { image: 0 }); // exclude image for list
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // ✅ Get product by barcode
  router.get('/:barcode', async (req, res) => {
    try {
      const barcode = req.params.barcode.trim();
      console.log("🔍 Searching for product with barcode:", barcode);

      const product = await Product.findOne({ barcode });
      if (!product) {
        console.log("❌ Product not found");
        return res.status(404).json({ message: 'Product not found' });
      }

      res.json(product);
    } catch (err) {
      console.error("Error in GET /:barcode:", err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  return router;
};
