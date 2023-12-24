const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Customer = require('../models/customerModels');


router.post('/forgot-password', async (request, response) => {
    try {
        const { email } = request.body;

        // Validate email format
        if (!email || !email.includes('@')) {
            return response.status(400).json({ error: 'Invalid email format' });
        }

        // Check if the user with the provided email exists
        const customer = await Customer.findOne({ email });

        if (!customer) {
            return response.status(404).json({ error: 'User not found with this email address' });
        }

        // Generate a token for password reset (you can use a library like crypto to create a random token)
        const resetToken = jwt.sign({ userId: customer._id }, 'your-reset-secret-key', { expiresIn: '1h' });

        response.status(200).json({ resetToken });
    } catch (error) {
        console.error(error.message);
        response.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/reset-password', async (request, response) => {
    try {
        const { token, newPassword, confirmPassword } = request.body;

        // Validate token and passwords
        if (!token || !newPassword || !confirmPassword) {
            return response.status(400).json({ error: 'Token, newPassword, and confirmPassword are required' });
        }

        // Verify the reset token
        jwt.verify(token, 'your-reset-secret-key', async (error, decoded) => {
            if (error) {
                return response.status(400).json({ error: 'Invalid or expired token' });
            }

            // Update the user's password
            const userId = decoded.userId;
            const customer = await Customer.findById(userId);

            if (!customer) {
                return response.status(404).json({ error: 'User not found' });
            }

            // Validate password length
            if (newPassword.length < 8) {
                return response.status(400).json({ error: 'Password must be at least 8 characters long' });
            }

            // Validate password contains both numbers and letters
            if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(newPassword)) {
                return response.status(400).json({ error: 'Password must contain both letters and numbers.' });
            }

            // Check if newPassword and confirmPassword match
            if (newPassword !== confirmPassword) {
                return response.status(400).json({ error: 'Passwords do not match' });
            }

            // Update the password (you may want to hash the password before storing it)
            customer.password = newPassword;
            await customer.save();

            response.status(200).json({ message: 'Password reset successful' });
        });
    } catch (error) {
        console.error(error.message);
        response.status(500).json({ message: 'Internal server error' });
    }
});
















// function generateRandomCode() {
//     return Math.floor(100000 + Math.random() * 900000);
// }

function generateRandomCode(userId) {
    // Concatenate userId with a random number
    const codeSeed = userId.toString() + Math.floor(100000 + Math.random() * 900000).toString();
    
    // Shuffle the characters in the codeSeed to make it more random
    const shuffledCode = codeSeed.split('').sort(() => 0.5 - Math.random()).join('');

    // Take the first 6 characters as the final reset code
    return shuffledCode.slice(0, 6);
}

router.post('/forgot-password1', async (request, response) => {
    try {
        const { email } = request.body;

        // Validate email format
        if (!email || !email.includes('@')) {
            return response.status(400).json({ error: 'Invalid email format' });
        }

        // Check if the user with the provided email exists
        const customer = await Customer.findOne({ email });

        if (!customer) {
            return response.status(404).json({ error: 'User not found with this email address' });
        }

        // Generate a 6-digit random number for password reset with userId
        const resetCode = generateRandomCode(customer._id);

        // TODO: Send an email to the user with the resetCode
        // You would typically send an email with the resetCode for verification

        response.status(200).json({ resetCode });
    } catch (error) {
        console.error(error.message);
        response.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/reset-password1', async (request, response) => {
    try {
        const { resetCode, newPassword } = request.body;

        // Validate reset code and password
        if (!resetCode || !newPassword) {
            return response.status(400).json({ error: 'Reset code and newPassword are required' });
        }

        // Verify the reset code
        // For simplicity, we assume the reset code is stored in the database during the forgot-password step
        const customer = await Customer.findOne({ resetCode });

        if (!customer) {
            return response.status(404).json({ error: 'Invalid or expired reset code' });
        }

        // Update the password (you may want to hash the password before storing it)
        customer.password = newPassword;
        customer.resetCode = null; // Clear the reset code after successful reset
        await customer.save();

        response.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error.message);
        response.status(500).json({ message: 'Internal server error' });
    }
});




module.exports = router;
