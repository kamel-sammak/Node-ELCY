const express = require('express');
const router = express.Router();

const Admin = require("../models/adminModels");

router.post("/addAdmin", async (request, response) => {
    try {
      const admin = await Admin.create(request.body);
      response.status(200).json(admin);
    } catch (error) {
      console.log(error.message);
      response.status(500).json({ message: error.message });
    }
  });


module.exports = router;