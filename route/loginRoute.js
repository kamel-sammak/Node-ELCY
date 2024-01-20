const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const Customer = require("../models/customerModels.js");


router.post("/login", async (request, response) => {
    try {
        const { email, password } = request.body;

        // Validate email format
        if (!email || !email.includes('@')) {
            return response.status(400).json({ error: "Invalid email format" });
        }

        // Validate password length
        if (!password || password.length < 8) {
            return response.status(400).json({ error: "Password must be at least 8 characters long" });
        }

        const customer = await Customer.findOne({ email, password });

        if (customer) {
            // Generate an access token with the customer information
            const accessToken = generateAccessToken(customer);

            // Generate a refresh token
            const refreshToken = generateRefreshToken(customer);

            // Set the refresh token as an HttpOnly cookie for better security
            response.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 days in milliseconds

            return response.status(200).json({
                role: "customer",
                message: "Customer login successful",
                id: customer._id,
                name: `${customer.firstName} ${customer.lastName}`,
                accessToken
            });
        }

        return response.status(400).json({ error: "Invalid email or password" });
    } catch (error) {
        console.log(error.message);
        response.status(500).json({ message: error.message });
    }
});

// Function to generate an access token
function generateAccessToken(customer) {
    return jwt.sign({ id: customer._id, role: "customer" }, 'your-secret-key', { expiresIn: '1h' });
}

// Function to generate a refresh token
function generateRefreshToken(customer) {
    return jwt.sign({ id: customer._id, role: "customer" }, 'your-refresh-secret-key', { expiresIn: '30d' });
}



module.exports = router;