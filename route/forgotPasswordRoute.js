const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Customer = require('../models/customerModels');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'elcy.forget@gmail.com',
        pass: 'elcy2024',
    },
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const customer = await Customer.findOne({ email });
    
    if (!customer) {
        return res.status(404).json({ error: 'User not found with this email address' });
    }

    const resetToken = generateResetToken();
    customer.resetToken = resetToken;
    await customer.save();

    sendResetEmail(email, resetToken);

    res.json({ message: 'Reset email sent successfully.' });
});

router.get('/reset-password', (req, res) => {
    const { token } = req.query;
    // Make sure the path to your HTML file is correct
    res.sendFile(__dirname + '/reset-password.html');
});

router.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const customer = await Customer.findOne({ email });

        if (!customer) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Use bcrypt to hash the new password
        // const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password and clear the reset token
        customer.password = newPassword;
        // customer.resetToken = null;
        await customer.save();

        res.json({ message: 'Password reset successful.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

function generateResetToken() {
    return crypto.randomBytes(20).toString('hex');
}

function sendResetEmail(email, resetToken) {
    const resetLink = `http://elcy.com/reset-password?token=${resetToken}`;
    const mailOptions = {
        from: 'elcy.forget@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: `Click on the following link to reset your password: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = router;
