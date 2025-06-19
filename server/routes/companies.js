// server/routes/companies.js
const express = require('express');
const Counter = require('../models/Counter'); // ⬅️ Import the counter model

module.exports = function (Company) {
  const router = express.Router();

  // POST: Add new company with auto-incremented ID
  router.post('/', async (req, res) => {
    console.log('📥 Incoming company data:', req.body);
    try {
      const { name, status, startdate, enddate, cname, cnumber, cemail, caddress } = req.body;

      // Basic validation
      if (!name || !cname || !cnumber || !cemail || !caddress) {
        return res.status(400).json({ error: "Please fill all required fields." });
      }

      // 🔁 Auto-increment logic for `id`
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'companyId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      const newCompany = new Company({
        id: counter.seq, // ✅ Assign incremented ID
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

  // GET: Get all companies
  router.get('/', async (req, res) => {
    try {
      const list = await Company.find().sort({ id: 1 }); // ✅ Sort by ID
      return res.status(200).json(list);
    } catch (err) {
      console.error("❌ Error fetching companies:", err);
      return res.status(500).json({ error: "Failed to fetch companies." });
    }
  });

  return router;
};
