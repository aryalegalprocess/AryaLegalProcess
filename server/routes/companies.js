const express = require('express');

module.exports = function (Company) {
  const router = express.Router();

  // POST: Add new company
  router.post('/', async (req, res) => {
    try {
      const {
        name,
        status,
        startdate,
        enddate,
        cname,
        cnumber,
        cemail,
        caddress
      } = req.body;

      // Validate required fields
      if (!name || !cemail || !cname || !cnumber || !caddress) {
        return res.status(400).json({ error: "Please fill all required fields." });
      }

      // Create company document
      const newCompany = new Company({
        id: Date.now(), // optional ID
        name,
        status,
        startdate,
        enddate,
        cname,
        cnumber,
        cemail,
        caddress
      });

      await newCompany.save();

      res.status(201).json(newCompany); // return the saved company object directly

    } catch (err) {
      console.error("❌ Error adding company:", err.message);
      res.status(500).json({ error: "Failed to add company." });
    }
  });

  // GET: Fetch all companies
  router.get('/', async (req, res) => {
    try {
      const companies = await Company.find();
      res.status(200).json(companies);
    } catch (err) {
      console.error("❌ Error fetching companies:", err.message);
      res.status(500).json({ error: "Failed to fetch companies." });
    }
  });

  return router;
};
