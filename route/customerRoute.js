const express = require('express');
const router = express.Router();

const Customer = require("../models/customerModels.js");


router.get("/getAllCustomer", async (request, response) => {
    try {
        const customer = await Customer.find({}); 
        if (customer.length > 0) {
            response.status(200).json({ customer });
        } else {
            response.status(200).json({ "message": "no data" });
        }
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});


router.get("/getCustomer_info/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const customer = await Customer.findById(id).select('firstName lastName email phoneNumber gender');
        if (!customer) {
            return response.status(404).json({ message: "customer not found" });
        }
        response.status(200).json(customer);
    } catch (error) {
        console.log(error.message);
        response.status(500).json({ message: error.message });
    }
});


router.put("/editCustomerVueJS/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const customer = await Customer.findByIdAndUpdate(id, request.body);
        if (!customer)
            response.status(404).json({ message: `cannot find user with id ${id} !` });
        else {
            const newCustomer = await Customer.findById(id);
            response.status(200).json(newCustomer);
        }
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});


router.put("/editCustomerFlutter/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const { firstName, lastName, phoneNumber, address } = request.body;

        const customer = await Customer.findByIdAndUpdate(id).select('firstName lastName phoneNumber address');
        if (!customer)
            response.status(404).json({ message: `cannot find user with id ${id} !` });

        customer.firstName = firstName;
        customer.lastName = lastName;
        customer.phoneNumber = phoneNumber;
        customer.address = address;

        const newCustomer = await customer.save();

        response.status(200).json(newCustomer);

    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});


router.delete("/deleteCustomer/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const customer = await Customer.findByIdAndDelete(id);

        if (!customer) {
            return response.status(404).json({ message: "Customer not found" });
        }

        response.status(200).json({ message: `Deleted customer: ${customer.firstName} ${customer.lastName}` });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});



module.exports = router;