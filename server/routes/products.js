module.exports = function(Product, Company) {
  const express = require('express');
  const router = express.Router();

  // Add a new product
 router.post('/', async (req, res) => {
  try {
    const {
      id,
      barcode,
      name,
      details,
      weight,
      quantity,
      company,
      description,
      startdate,
      enddate,
      price,
      image
    } = req.body;

    const newProduct = new Product({
      id,
      barcode,
      name,
      details,
      weight,
      quantity,
      company,
      description,
      startdate,  // ✅ lowercase (as defined in schema)
      enddate,    // ✅ lowercase (as defined in schema)
      price,
      image
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product added!' });
  } catch (err) {
    console.error('Error saving product:', err);
    res.status(500).json({ error: err.message });
  }
});


  // Get all products (list view)
  router.get('/', async (req, res) => {
    try {
      const products = await Product.find({}, { image: 0 }); // Exclude image
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // ✅ Get product by barcode
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
