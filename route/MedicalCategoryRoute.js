const express = require('express');
const router = express.Router();
const Service = require("../models/serviceModels");
const MedicalCategory = require("../models/MedicalCategoryModels");




router.post("/addMedicalCategory", async (request, response) => {
    try {
        const { name, serviceId } = request.body;

        // Check if a MedicalCategory with the same name already exists
        const existingMedicalCategory = await MedicalCategory.findOne({ name });

        if (existingMedicalCategory) {
            return response.status(400).json({ message: "MedicalCategory with the same name already exists" });
        }

        // Check if the specified serviceId exists in the Service collection
        const existingService = await Service.findById(serviceId);

        if (!existingService) {
            return response.status(400).json({ message: "Service with the All ID not found" });
        }

        // If no existing MedicalCategory and service, create a new category
        const medicalCategory = await MedicalCategory.create(request.body);

        response.status(200).json(medicalCategory);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});


router.get("/getAllMedicalCategory/:id", async (request, response) => {
    try {
        const { id } = request.params;

        // Assuming there's a serviceId field in the Category model
        const medicalCategory = await MedicalCategory.find({ serviceId: id });

        if (medicalCategory.length > 0) {
            // Map each medicalCategory object to the desired format
            const formattedMedicalCategories = medicalCategory.map(medicalCategory => ({
                id: medicalCategory._id,
                name: medicalCategory.name,
                imageUrl: medicalCategory.imageUrl
            }));

            response.status(200).json({ medicalCategory: formattedMedicalCategories });
        } else {
            response.status(200).json({ message: "No medicalCategory found for the specified service ID" });
        }
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});




router.put("/editMedicalCategory/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const medicalCategory = await MedicalCategory.findByIdAndUpdate(id, request.body);
        if (!medicalCategory)
            response.status(404).json({ message: `cannot find user with id ${id} !` });
        else {
            const newMedicalCategory = await MedicalCategory.findById(id);
            response.status(200).json(newMedicalCategory);
        }
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});




router.delete("/deleteMedicalCategory/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const medicalCategory = await MedicalCategory.findByIdAndDelete(id);

        if (!medicalCategory) {
            return response.status(404).json({ message: "medicalCategory not found" });
        }

        response.status(200).json({ message: "Deleted medicalCategory" });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});





module.exports = router;