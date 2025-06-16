const express = require('express');

module.exports = function(Company) {
  const router = express.Router();

  // POST: Add new company
  router.post('/', async (req, res) => {
    try {
      const companyData = req.body;

      // Optional: Simple validation
      if (!companyData.name || !companyData.contactEmail) {
        return res.status(400).json({ error: "Name and contactEmail are required." });
      }

      const newCompany = new Company(companyData);
      await newCompany.save();

      res.status(201).json({
        message: "Company added successfully.",
        company: newCompany
      });
    } catch (err) {
      console.error("Error adding company:", err.message);
      res.status(500).json({ error: "Failed to add company." });
    }
  });

  // GET: Fetch all companies
  router.get('/', async (req, res) => {
    try {
      const companies = await Company.find();
      res.status(200).json(companies);
    } catch (err) {
      console.error("Error fetching companies:", err.message);
      res.status(500).json({ error: "Failed to fetch companies." });
    }
  });

  return router;
};
