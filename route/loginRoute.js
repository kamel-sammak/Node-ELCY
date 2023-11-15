const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router(); 

const Customer = require ("../models/customerModels.js");


// router.post("/login", async (request, response) => {
//     try {
//         const { nationalNumber, password } = request.body;
     
//         const customer = await Customer.findOne({ nationalNumber, password});
//          if(customer) {
//           return response.status(200).json({role: "customer", message: "customer login successful", id: customer._id, name: `${customer.firstName} ${customer.lastName}` });
//         }

//         return response.status(400).json({ error: "Invalid nationalNumber or password" });
//        } 
//         catch (error) {
//         console.log(error.message);
//         response.status(500).json({ message: error.message });
//        }

//       });




router.post("/login", async (request, response) => {
    try {
        const { nationalNumber, password } = request.body;
     
        const customer = await Customer.findOne({ nationalNumber, password });

        if (customer) {
            // Generate a JWT token with the customer information
            const token = jwt.sign({ id: customer._id, role: "customer" }, 'your-secret-key', { expiresIn: '1h' });

            // Set the token as an HttpOnly cookie for better security
            response.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour in milliseconds

            return response.status(200).json({
                role: "customer",
                message: "Customer login successful",
                id: customer._id,
                name: `${customer.firstName} ${customer.lastName}`
            });
        }

        return response.status(400).json({ error: "Invalid nationalNumber or password" });
    } catch (error) {
        console.log(error.message);
        response.status(500).json({ message: error.message });
    }
});










module.exports = router;