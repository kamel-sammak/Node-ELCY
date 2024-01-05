const express = require('express');
const router = express.Router();

const Service = require("../models/serviceModels");


router.post("/addService", async (request, response) => {
    try {
        const { name } = request.body;

        // Check if a service  with the same name already exists
        const existingService = await Service.findOne({ name });

        if (existingService) {
            return response.status(400).json({ message: "Service with the same name already exists" });
        }

        // If no existing service , create a new one
        const service = await Service.create(request.body);

        response.status(200).json(service);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});



router.get("/getAllServices", async (request, response) => {
    try {
        const services = await Service.find({}).select(' name '); // Exclude the _id field ('name -_id')
        if (services.length > 0) {
            response.status(200).json({ services });
        } else {
            response.status(200).json({ "message": "no data" });
        }
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});


router.put("/editService/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const service = await Service.findByIdAndUpdate(id, request.body);
        if (!service)
            response.status(404).json({ message: `cannot find user with id ${id} !` });
        else {
            const newService = await Service.findById(id);
            response.status(200).json(newService);
        }
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});



router.delete("/deleteService/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const service = await Service.findByIdAndDelete(id);

        if (!service) {
            return response.status(404).json({ message: "Service not found" });
        }

        response.status(200).json({ message: `Deleted service: ${service.name}` });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});



module.exports = router;