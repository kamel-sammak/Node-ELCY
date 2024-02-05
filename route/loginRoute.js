const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const Customer = require("../models/customerModels.js");
const Category = require("../models/categoryModels");
const MedicalCategory = require("../models/MedicalCategoryModels");
const Admin = require("../models/adminModels");


router.post("/loginFlutter", async (request, response) => {
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



// router.post("/loginCompany", async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const categories = await Category.find();
//         let authenticatedCompany = null;

//         categories.forEach(category => {
//             category.specialties.forEach(specialty => {
//                 const company = specialty.company.find(company => company.email === email);

//                 if (company && company.password === password) {
//                     authenticatedCompany = company;
//                 }
//             });
//         });

//         if (authenticatedCompany) {
//             // Generate a JWT token for authentication
//             const token = jwt.sign({ companyId: authenticatedCompany._id }, 'your-secret-key', { expiresIn: '1h' });
//             res.status(200).json({ token, companyId: authenticatedCompany._id });
//         } else {
//             res.status(401).json({ message: "Invalid email or password" });
//         }
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ message: error.message });
//     }
// });

// router.post("/loginGroup", async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const medicalCategories = await MedicalCategory.find();
//         let authenticatedGroup = null;

//         medicalCategories.forEach(medicalCategory => {
//             const group = medicalCategory.group.find(group => group.email === email);

//             if (group && group.password === password) {
//                 authenticatedGroup = group;
//             }
//         });

//         if (authenticatedGroup) {
//             // Generate a JWT token for authentication
//             const token = jwt.sign({ groupId: authenticatedGroup._id }, 'your-secret-key', { expiresIn: '1h' });
//             res.status(200).json({ token, groupId: authenticatedGroup._id });
//         } else {
//             res.status(401).json({ message: "Invalid email or password" });
//         }
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ message: error.message });
//     }
// });


router.post("/loginVueJS", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Fetch both categories, medical categories, and admin from the database
        const categories = await Category.find();
        const medicalCategories = await MedicalCategory.find();
        const admins = await Admin.find();

        let authenticatedUser = null;
        let userType = null;

        // Check if the email and password match an admin
        const adminUser = admins.find(admin => admin.email === email && admin.password === password);
        if (adminUser) {
            authenticatedUser = adminUser;
            userType = 'admin';
        }

        // If not an admin, check if the email and password match a company
        if (!authenticatedUser) {
            categories.forEach(category => {
                category.specialties.forEach(specialty => {
                    const company = specialty.company.find(company => company.email === email);
                    if (company && company.password === password) {
                        authenticatedUser = company;
                        userType = 'company';
                    }
                });
            });
        }

        // If not a company or admin, check if the email and password match a group
        if (!authenticatedUser) {
            medicalCategories.forEach(medicalCategory => {
                const group = medicalCategory.group.find(group => group.email === email);
                if (group && group.password === password) {
                    authenticatedUser = group;
                    userType = 'group';
                }
            });
        }

        if (authenticatedUser) {
            // Generate a JWT token for authentication
            const token = jwt.sign({ userId: authenticatedUser._id, userType }, 'your-secret-key', { expiresIn: '1h' });
            res.status(200).json({ message: `Successfully logged in as ${userType}`, token, userId: authenticatedUser._id });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});




module.exports = router;