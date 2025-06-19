// server/routes/companies.js
const express = require('express');
const router = express.Router();
const Counter = require('../models/Counter'); // 🔁 Auto-increment logic

module.exports = function (Company) {
  // ➕ Add a new company with auto-incremented ID
  router.post('/', async (req, res) => {
    console.log('📥 Incoming company data:', req.body);
    try {
      const { name, status, startdate, enddate, cname, cnumber, cemail, caddress } = req.body;

      // ✅ Basic validation
      if (!name || !cname || !cnumber || !cemail || !caddress) {
        return res.status(400).json({ error: "Please fill all required fields." });
      }

      // 🔁 Get next auto-incremented ID from "companyId" counter
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'companyId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      // 📦 Create new company
      const newCompany = new Company({
        id: counter.seq, // ✅ Use incremented ID
        name,
        status,
        startdate,
        enddate,
        cname,
        cnumber,
        cemail,
        caddress
      });

      const saved = await newCompany.save();
      console.log('✅ Saved company:', saved);
      res.status(201).json(saved);
    } catch (err) {
      console.error("❌ Error adding company:", err);
      res.status(500).json({ error: "Failed to add company." });
    }
  });

  // 📥 GET all companies (sorted by ID)
  router.get('/', async (req, res) => {
    try {
      const list = await Company.find().sort({ id: 1 }); // 📌 Sorted by ID ASC
      res.status(200).json(list);
    } catch (err) {
      console.error("❌ Error fetching companies:", err);
      res.status(500).json({ error: "Failed to fetch companies." });
    }
  });

  return router;
};
