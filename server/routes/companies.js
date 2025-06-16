module.exports = function(Company) {
  const express = require('express');
  const router = express.Router();

  // POST: Add new company
  router.post('/', async (req, res) => {
    try {
      const newCompany = new Company(req.body);
      await newCompany.save();
      res.status(201).json(newCompany);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET: Fetch all companies
  router.get('/', async (req, res) => {
    try {
      const companies = await Company.find();
      res.json(companies);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
