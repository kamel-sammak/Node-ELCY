const express = require('express');
const router = express.Router();

const Category = require("../models/categoryModels");


router.post("/addCategory", async (request, response) => {
    try {
        const { name } = request.body;

        // Check if a category with the same name already exists
        const existingCategory = await Category.findOne({ name });

        if (existingCategory) {
            return response.status(400).json({ message: "category with the same name already exists" });
        }

        // If no existing category, create a new one
        const category = await Category.create(request.body);

        response.status(200).json(category);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});


router.get("/getAllCategory", async (request, response) => {
    try {
        const category = await Category.find();
        if (category.length > 0) {
            // Map each category object to the desired format
            const formattedCategory = category.map(category => ({
                id: category._id,
                name: category.name,
                serviceId: category.serviceId,
                imageUrl: category.imageUrl
            }));

            response.status(200).json({ category: formattedCategory });
        } else {
            response.status(200).json({ message: "no data" });
        }
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});



router.get("/getAllSpecialties", async (request, response) => {
    try {
        const category = await Category.find();
        if (category.length > 0) {
            // Map each category object to the desired format
            const formattedCategory = category.map(category => ({
   
                specialties:category.specialties
            }));

            response.status(200).json({ category: formattedCategory });
        } else {
            response.status(200).json({ message: "no data" });
        }
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});



router.get("/getAllCategory_Specialties/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const category = await Category.findById(id);
        response.status(200).json(category);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});














// router.post("/addServiceDetails", async (request, response) => {
//     try {
//         const serviceDetail = await ServiceDetail.create(request.body);
//         response.status(200).json(serviceDetail,);
//     } catch (error) {
//         response.status(500).json({ message: error.message });
//     }
// });

router.delete("/deleteServiceDetails/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const serviceDetail = await ServiceDetail.findByIdAndDelete(id);
        response.status(200).json(serviceDetail);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

router.put("/editServiceDetails/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const serviceDetail = await ServiceDetail.findByIdAndUpdate(id, request.body);
        if (!serviceDetail)
            response.status(404).json({ message: `cannot find user with id ${id} !` });
        else {
            const newService = await ServiceDetail.findById(id);
            response.status(200).json(newService);
        }
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

module.exports = router;