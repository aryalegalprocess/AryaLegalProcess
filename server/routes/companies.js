// server/routes/companies.js
const express = require('express');

module.exports = function (Company, Counter) {
  const router = express.Router();

  // ➕ POST: Add new company
  router.post('/', async (req, res) => {
    console.log('📥 Incoming company data:', req.body);

    try {
      const { name, status, startdate, enddate, cname, cnumber, cemail, caddress } = req.body;

      if (!name || !cname || !cnumber || !cemail || !caddress) {
        return res.status(400).json({ error: "Please fill all required fields." });
      }

      // 🔢 Get next company ID using counter
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'companyId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      const newCompany = new Company({
        id: counter.seq,
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
      console.log('✅ Company saved:', saved);
      return res.status(201).json(saved);

    } catch (err) {
      console.error("❌ Error adding company:", err);
      return res.status(500).json({ error: "Failed to add company." });
    }
  });

  // 📄 GET: Fetch all companies
  router.get('/', async (req, res) => {
    try {
      const companies = await Company.find().sort({ id: 1 });
      return res.status(200).json(companies);
    } catch (err) {
      console.error("❌ Error fetching companies:", err);
      return res.status(500).json({ error: "Failed to fetch companies." });
    }
  });

  return router;
};
