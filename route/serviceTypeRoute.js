const express = require('express');
const router = express.Router();

const ServiceType = require("../models/serviceTypeModels")


router.get("/getServiceTypes/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const serviceType = await ServiceType.findById(id);
        response.status(200).json(serviceType);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

router.post("/addServiceTypes", async (request, response) => {
    try {
        const serviceType = await ServiceType.create(request.body);
        response.status(200).json(serviceType);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

router.delete("/deleteServiceTypes/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const serviceType = await ServiceType.findByIdAndDelete(id);
        response.status(200).json(serviceType);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

router.put("/editServiceTypes/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const serviceType = await ServiceType.findByIdAndUpdate(id, request.body);
        if (!serviceType)
            response.status(404).json({ message: `cannot find user with id ${id} !` });
        else {
            const newService = await ServiceType.findById(id);
            response.status(200).json(newService);
        }
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});



module.exports = router;