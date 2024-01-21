const express = require('express');
const router = express.Router();

const Category = require("../models/categoryModels");
const Service = require("../models/serviceModels");

const multer = require('multer');
const Image = require('../models/imageModels');


// Storage configuration for multer
const Storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: Storage
}).single('image');


router.post("/addCategory2", async (request, response) => {
    try {
        upload(request, response, async (err) => {
            if (err) {
                console.log(err);
                return response.status(500).json({ status: 500, message: 'Error uploading image', error: err.message });
            }
            try {
                const { name, serviceId, specialties } = request.body;

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

                const newImage = new Image({
                    name: request.body.name,
                    image: {
                        data: request.file.filename,
                        contentType: request.file.mimetype,
                    },
                });

                // Save the image document
                await newImage.save();

                // If no existing category and service, create a new category
                const category = await Category.create({
                    name,
                    serviceId,
                    imageUrl: '/uploads/' + newImage.name + '.' + newImage.image.contentType.split('/')[1],
                    image: newImage,
                    specialties,

                });

                response.status(200).json(category);

            } catch (saveError) {
                console.error(saveError);
                response.status(500).json({ status: 500, message: 'Error saving image data', error: saveError.message });
            }
        });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});



router.post("/addCategory1", async (request, response) => {
    try {
        upload(request, response, async (err) => {
            if (err) {
                console.log(err);
                return response.status(500).json({ message: 'Error uploading image', error: err.message });
            }

            try {
                const { name, serviceId, specialties } = request.body;

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
                const newImage = new Image({
                    name: name,
                    image: {
                        data: request.file.filename,
                        contentType: request.file.mimetype,
                    },
                });

                await newImage.save();

                const category = await Category.create({
                    name,
                    serviceId,
                    imageUrl: '/uploads/' + newImage.name + '.' + newImage.image.contentType.split('/')[1],
                    image: newImage,
                    specialties
                });

                response.status(200).json(category);

            } catch (saveError) {
                console.error(saveError);
                response.status(500).json({ message: 'Error saving image data', error: saveError.message });
            }
        });

    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});



// router.post("/addCategory", async (request, response) => {
//     try {
//         const { name, serviceId } = request.body;

//         // Check if a category with the same name already exists
//         const existingCategory = await Category.findOne({ name });

//         if (existingCategory) {
//             return response.status(400).json({ message: "Category with the same name already exists" });
//         }

//         // Check if the specified serviceId exists in the Service collection
//         const existingService = await Service.findById(serviceId);

//         if (!existingService) {
//             return response.status(400).json({ message: "Service with the specified ID not found" });
//         }

//         // If no existing category and service, create a new category
//         const category = await Category.create(request.body);

//         response.status(200).json(category);
//     } catch (error) {
//         response.status(500).json({ message: error.message });
//     }
// });


router.post("/addCategoryOnly", async (request, response) => {
    try {
        const { name, serviceId, imageUrl } = request.body;

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
        const category = await Category.create({ name, serviceId, imageUrl });

        response.status(200).json({ name, serviceId });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});



// router.get("/getAllCategory", async (request, response) => {
//     try {
//         const category = await Category.find();
//         if (category.length > 0) {
//             // Map each category object to the desired format
//             const formattedCategory = category.map(category => ({
//                 id: category._id,
//                 name: category.name,
//                 imageUrl: category.imageUrl
//                 // serviceId: category.serviceId,
//                 // imageUrl: category.imageUrl
//             }));

//             response.status(200).json({ category: formattedCategory });
//         } else {
//             response.status(200).json({ message: "no data" });
//         }
//     } catch (error) {
//         response.status(500).json({ message: error.message });
//     }
// });

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
                imageUrl: category.imageUrl
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
        const { name, imageUrl } = request.body;

        // Check if a category with the same name already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory && existingCategory._id != id) {
            return response.status(400).json({ message: `Category with name ${name} already exists!` });
        }

        // Find the category by ID
        const category = await Category.findByIdAndUpdate(id, { name, imageUrl }, { new: true }).select('name imageUrl');

        // If the category does not exist, return a 404 response
        if (!category) {
            return response.status(404).json({ message: `Cannot find category with id ${id}!` });
        }

        response.status(200).json(category);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});



router.delete("/deleteCategory/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return response.status(404).json({ message: "category not found" });
        }

        response.status(200).json({ message: "Deleted category" });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});



///////////


router.post("/addSpecialtiesToCategory/:idCategory", async (request, response) => {
    try {
        const { name, imageUrl } = request.body;
        const { idCategory } = request.params;

        // Check if the specified Category Specialties exists
        const existingSpecialties = await Category.findById(idCategory);

        if (!existingSpecialties) {
            return response.status(400).json({ message: "Category specialties with the specified ID not found" });
        }

        // Check if a specialties with the same name already exists
        const specialtiesWithSameName = existingSpecialties.specialties.find(specialties => specialties.name === name);

        if (specialtiesWithSameName) {
            return response.status(400).json({ message: "A specialties with the same name already exists in the Category" });
        }

        // Add the new item to the "all" array
        existingSpecialties.specialties.push({ name, imageUrl });
        const updatedSpecialties = await existingSpecialties.save();

        response.status(200).json(updatedSpecialties);
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
            const modifiedSpecialties = specialties.map(({ imageUrl, name, _id }) => ({ name, _id, imageUrl }));

            res.status(200).json({ _id, specialties: modifiedSpecialties });
        } else {
            res.status(404).json({ message: "Can't find category" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/updateSpecialties/:SpecialtiesId", async (request, response) => {
    try {
        const { name, imageUrl } = request.body;
        const { SpecialtiesId } = request.params;

        // Check if the specified Specialties exists
        const existingSpecialties = await Category.findOne({ 'specialties._id': SpecialtiesId });

        if (!existingSpecialties) {
            return response.status(400).json({ message: "Specialties with the specified ID not found" });
        }

        // Find the Specialties within the category with the specified SpecialtiesId
        const existingItem = existingSpecialties.specialties.find(specialties => specialties._id.toString() === SpecialtiesId);

        if (!existingItem) {
            return response.status(400).json({ message: "Specialties with the specified ID not found in the category" });
        }

        // Check if a group with the same name already exists (excluding the current group)
        const groupWithSameName = existingSpecialties.specialties.find(specialties => specialties.name === name && specialties._id.toString() !== SpecialtiesId);

        if (groupWithSameName) {
            return response.status(400).json({ message: "A Specialties with the same name already exists in the Category" });
        }

        // Update the item in the "all" array
        existingItem.name = name;
        existingItem.imageUrl = imageUrl;
        await existingSpecialties.save();

        response.status(200).json({ message: "Modified successfully" });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});


router.delete("/deleteSpecialties/:SpecialtiesId", async (request, response) => {
    try {
        const { SpecialtiesId } = request.params;

        // Check if the specified pharmacy specialties exists
        const existingSpecialties = await Category.findOne({ 'specialties._id': SpecialtiesId });

        if (!existingSpecialties) {
            return response.status(400).json({ message: "Pharmacy specialties with the specified ID not found" });
        }

        // Find the index of the specialties within the medical category with the specified SpecialtiesId
        const specialtiesIndex = existingSpecialties.specialties.findIndex(specialties => specialties._id.toString() === SpecialtiesId);

        if (specialtiesIndex === -1) {
            return response.status(400).json({ message: "specialties with the specified ID not found in the pharmacy" });
        }

        // Remove the item from the "all" array
        existingSpecialties.specialties.splice(specialtiesIndex, 1);
        await existingSpecialties.save();

        response.status(200).json({ message: "Deleted Item In specialties" });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});




module.exports = router;