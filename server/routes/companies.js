// server/routes/companies.js
const express = require('express');
const Counter = require('./models/Counter'); // ✅ Import Counter model

module.exports = function (Company) {
  const router = express.Router();

  // ➕ Add new company
  router.post('/', async (req, res) => {
    console.log('📥 Incoming company data:', req.body);
    try {
      const { name, status, startdate, enddate, cname, cnumber, cemail, caddress } = req.body;
      if (!name || !cname || !cnumber || !cemail || !caddress) {
        return res.status(400).json({ error: "Please fill all required fields." });
      }

      // 🔁 Get next company ID from counter
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'companyId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      const newCompany = new Company({
        id: counter.seq, // ✅ Use auto-incremented ID
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
      return res.status(201).json(saved);
    } catch (err) {
      console.error("❌ Error adding company:", err);
      return res.status(500).json({ error: "Failed to add company." });
    }
  });

  // 📄 Get all companies
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
