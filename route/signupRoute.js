const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const router = express.Router();

const Customer = require("../models/customerModels.js");


router.post("/signup", async (request, response) => {
  try {
    // Check if the user already exists based on email
    const existingCustomer = await Customer.findOne({ email: request.body.email });

    if (existingCustomer) {
      return response.status(400).json({ error: "User with this email already exists. Please choose a different one or log in." });
    }

    // Validate email format (must contain exactly one '@')
    if (!request.body.email || !isValidEmail(request.body.email)) {
      return response.status(400).json({ error: "Invalid email format. Please provide a valid email address with exactly one '@' symbol." });
    }

    // Validate password length
    if (!request.body.password || request.body.password.length < 8) {
      return response.status(400).json({ error: "Password must be at least 8 characters long." });
    }

    // Validate password contains both numbers and letters
    if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(request.body.password)) {
      return response.status(400).json({ error: "Password must contain both letters and numbers." });
    }

    // Create a new customer account
    const customer = await Customer.create(request.body);

    response.status(200).json(customer);
  } catch (error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      // Duplicate key (email) error
      response.status(400).json({ error: "Email must be unique. User with this email already exists. Please choose a different one or log in." });
    } else {
      console.error(error.message);
      response.status(500).json({ message: error.message });
    }
  }
});


router.post("/signup-login", async (request, response) => {
  try {
    // Check if the user already exists based on email
    const existingCustomer = await Customer.findOne({ email: request.body.email });

    if (existingCustomer) {
      return response.status(400).json({ error: "User with this email already exists. Please choose a different one or log in." });
    }

    // Validate email format (must contain exactly one '@')
    if (!request.body.email || !isValidEmail(request.body.email)) {
      return response.status(400).json({ error: "Invalid email format. Please provide a valid email address with exactly one '@' symbol." });
    }

    // Validate password length
    if (!request.body.password || request.body.password.length < 8) {
      return response.status(400).json({ error: "Password must be at least 8 characters long." });
    }

    // Validate password contains both numbers and letters
    if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(request.body.password)) {
      return response.status(400).json({ error: "Password must contain both letters and numbers." });
    }

    // Create a new customer account
    const customer = await Customer.create(request.body);

    // Generate a JWT token with the customer information
    const token = jwt.sign({ id: customer._id, role: "customer" }, 'your-secret-key', { expiresIn: '1h' });

    // Set the token as an HttpOnly cookie for better security
    response.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour in milliseconds

    response.status(200).json({
      role: "customer",
      message: "Customer account created and logged in successfully",
      id: customer._id,
      name: `${customer.firstName} ${customer.lastName}`,
      token
    });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key (email) error
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