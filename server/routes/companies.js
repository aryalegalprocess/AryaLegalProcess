// server/routes/companies.js
const express = require('express');
module.exports = function (Company) {
  const router = express.Router();

  router.post('/', async (req, res) => {
    console.log('📥 Incoming company data:', req.body);
    try {
      const { name, status, startdate, enddate, cname, cnumber, cemail, caddress } = req.body;
      if (!name || !cname || !cnumber || !cemail || !caddress) {
        return res.status(400).json({ error: "Please fill all required fields." });
      }

      const newCompany = new Company({
        id: Date.now(),
        name, status, startdate, enddate, cname, cnumber, cemail, caddress
      });

      const saved = await newCompany.save();
      console.log('✅ Saved company:', saved);
      return res.status(201).json(saved);
    } catch (err) {
      console.error("❌ Error adding company:", err);
      return res.status(500).json({ error: "Failed to add company." });
    }
  });

  router.get('/', async (req, res) => {
    try {
      const list = await Company.find();
      return res.status(200).json(list);
    } catch (err) {
      console.error("❌ Error fetching companies:", err);
      return res.status(500).json({ error: "Failed to fetch companies." });
    }
  });

  return router;
};
