const express = require('express');
const router = express.Router();

const Category = require("../models/categoryModels");
const Service = require("../models/serviceModels");



router.post("/addCategory", async (request, response) => {
    try {
        const { name, serviceId } = request.body;

        // Check if a category with the same name already exists
        const existingCategory = await Category.findOne({ name });

        if (existingCategory) {
            return response.status(400).json({ message: "Category with the same name already exists" });
        }

        // Check if the specified serviceId exists in the Service collection
        const existingService = await Service.findById(serviceId);

        if (!existingService) {
            return response.status(400).json({ message: "Service with the specified ID not found" });
        }

        // If no existing category and service, create a new category
        const category = await Category.create(request.body);

        response.status(200).json(category);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});


router.post("/addCategoryOnly", async (request, response) => {
    try {
        const { name, serviceId } = request.body;

        // Check if a category with the same name already exists
        const existingCategory = await Category.findOne({ name });

        if (existingCategory) {
            return response.status(400).json({ message: "Category with the same name already exists" });
        }

        // Check if the specified serviceId exists in the Service collection
        const existingService = await Service.findById(serviceId);

        if (!existingService) {
            return response.status(400).json({ message: "Service with the specified ID not found" });
        }

        // If no existing category and service, create a new category with only name and serviceId
        const category = await Category.create({ name, serviceId });

        response.status(200).json({ name, serviceId });
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
                // serviceId: category.serviceId,
                // imageUrl: category.imageUrl
            }));

            response.status(200).json({ category: formattedCategory });
        } else {
            response.status(200).json({ message: "no data" });
        }
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

router.get("/getAllCategory/:id", async (request, response) => {
    try {
        const { id } = request.params;

        // Assuming there's a serviceId field in the Category model
        const categories = await Category.find({ serviceId: id });

        if (categories.length > 0) {
            // Map each category object to the desired format
            const formattedCategories = categories.map(category => ({
                id: category._id,
                name: category.name,
                // Add other fields as needed
            }));

            response.status(200).json({ categories: formattedCategories });
        } else {
            response.status(200).json({ message: "No categories found for the specified service ID" });
        }
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});



router.get("/getAllSpecialties/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        
        if (category) {
            const { _id, specialties } = category;
            // Remove the 'company' field from each specialty
            const modifiedSpecialties = specialties.map(({ name, _id }) => ({ name, _id }));
            
            res.status(200).json({ _id, specialties: modifiedSpecialties });
        } else {
            res.status(404).json({ message: "Can't find category" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




// router.get("/getAllSpecialties1/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const category = await Category.findById(id).select(' specialties ');
//         if (category) res.status(200).json(category);
//         else res.status(404).json({ message: "can't find category" });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });





//   router.get("/getAllSpecialties", async (request, response) => {
//     try {
//         const category = await Category.find();
//         if (category.length > 0) {
//             // Map each category object to the desired format
//             const formattedCategory = category.map(category => ({

//                 specialties: category.specialties
//             }));

//             response.status(200).json({ category: formattedCategory });
//         } else {
//             response.status(200).json({ message: "no data" });
//         }
//     } catch (error) {
//         response.status(500).json({ message: error.message });
//     }
// });





router.put("/editCategory/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const category = await Category.findByIdAndUpdate(id, request.body, { new: true });

        if (!category)
            response.status(404).json({ message: `Cannot find category with id ${id}!` });
        else {
            // Use Category model to find the updated category by id and convert to plain object
            const newCategory = await Category.findById(id).lean();

            response.status(200).json(newCategory);
        }
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});





router.delete("/deleteCategory/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const category = await Category.findByIdAndDelete(id);
        response.status(200).json(category);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

module.exports = router;