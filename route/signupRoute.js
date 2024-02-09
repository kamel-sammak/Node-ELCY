const express = require('express');
const router = express.Router();

const Customer = require("../models/customerModels.js");


router.post("/signup", async (request, response) => {
  try {
    const existingCustomer = await Customer.findOne({ email: request.body.email });

    if (existingCustomer) {
      return response.status(400).json({ error: "User with this email already exists. Please choose a different one or log in." });
    }

    if (!request.body.email || !isValidEmail(request.body.email)) {
      return response.status(400).json({ error: "Invalid email format. Please provide a valid email address with exactly one '@' symbol." });
    }

    if (!request.body.password || request.body.password.length < 8) {
      return response.status(400).json({ error: "Password must be at least 8 characters long." });
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(request.body.password)) {
      return response.status(400).json({ error: "Password must contain both letters and numbers." });
    }

    const customer = await Customer.create(request.body);

    response.status(200).json( "successfully registered" );
  } catch (error) {
    if (error.name === 'MongoError' && error.code === 11000) {

      response.status(400).json({ error: "Email must be unique. User with this email already exists. Please choose a different one or log in." });
    } else {
      console.error(error.message);
      response.status(500).json({ message: error.message });
    }
  }
});


// Helper function to validate email format
function isValidEmail(email) {
  const atSymbolCount = email.split('@').length - 1;
  return atSymbolCount === 1;
}



module.exports = router;