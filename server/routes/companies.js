const express = require('express');

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

      // ✅ Get the highest current ID from the Company collection
      const lastCompany = await Company.findOne().sort({ id: -1 });
      const nextId = lastCompany ? lastCompany.id + 1 : 1;

      const newCompany = new Company({
        id: nextId,
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
      const list = await Company.find().sort({ id: 1 });
      return res.status(200).json(list);
    } catch (err) {
      console.error("❌ Error fetching companies:", err);
      return res.status(500).json({ error: "Failed to fetch companies." });
    }
  });

  // ✏️ Update an existing company
  router.put('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id); // ✅ ensure numeric ID
      const company = await Company.findOne({ id });

      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

      const fields = ['name', 'status', 'startdate', 'enddate', 'cname', 'cnumber', 'cemail', 'caddress'];
      fields.forEach(field => {
        if (req.body[field] !== undefined) {
          company[field] = req.body[field];
        }
      });

      const updated = await company.save();
      res.status(200).json(updated);
    } catch (err) {
      console.error("❌ Error updating company:", err);
      return res.status(500).json({ error: "Failed to update company." });
    }
  });

router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log("🔍 Attempting to delete company with id:", id);

    // Check if the company with this ID exists
    const company = await Company.findOne({ id });
    if (!company) {
      console.log("❌ Company not found with ID:", id);
      return res.status(404).json({ error: "Company not found" });
    }

    console.log("✅ Company found:", company);

    const deleted = await Company.findOneAndDelete({ id });

    if (!deleted) {
      console.log("❌ Failed to delete company with id:", id);
      return res.status(500).json({ error: "Deletion failed" });
    }

    console.log("✅ Successfully deleted:", deleted);
    return res.status(200).json({ message: "Company deleted successfully." });
  } catch (err) {
    console.error("❌ Error deleting company:", err);
    return res.status(500).json({ error: "Failed to delete company." });
  }
});


  return router;
};
