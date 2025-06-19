module.exports = function(Product, Company) {
  const express = require('express');
  const router = express.Router();

  // Add a new product with auto-increment ID
router.post('/', async (req, res) => {
  try {
    const lastProduct = await Product.findOne().sort({ id: -1 });
    const nextId = lastProduct ? lastProduct.id + 1 : 1;

    const newProduct = new Product({
      id: nextId,
      barcode: req.body.barcode,
      name: req.body.name,
      details: req.body.details,
      weight: req.body.weight,
      quantity: req.body.quantity,
      company: req.body.company,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      price: req.body.price,
      image: req.body.image
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product added!', product: newProduct });
  } catch (err) {
    console.error('Error saving product:', err);
    res.status(500).json({ error: err.message });
  }
});


  // 📦 Get all products (excluding image for performance)
  router.get('/', async (req, res) => {
    try {
      const products = await Product.find({}, { image: 0 });
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // 🔍 Get product by barcode
  router.get('/:barcode', async (req, res) => {
    try {
      const barcode = req.params.barcode.trim();
      const product = await Product.findOne({ barcode });

      if (!product) return res.status(404).json({ message: 'Product not found' });

      const company = await Company.findOne({ id: product.company });

      const responseData = {
        ...product.toObject(),
        companyName: company ? company.name : 'Unknown'
      };

      res.json(responseData);
    } catch (err) {
      console.error("Error fetching product by barcode:", err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  return router;
};
