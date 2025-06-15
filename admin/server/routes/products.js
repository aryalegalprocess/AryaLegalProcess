module.exports = function(Product) {
  const express = require('express');
  const router = express.Router();

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

router.get('/', async (req, res) => {
  try {
    // Exclude image field by projection: { image: 0 }
    const products = await Product.find({}, { image: 0 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


  return router;
};
