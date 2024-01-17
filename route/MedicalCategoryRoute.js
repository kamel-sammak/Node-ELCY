const express = require('express');
const router = express.Router();
const Service = require("../models/serviceModels");
const MedicalCategory = require("../models/MedicalCategory");
const Drugs = require("../models/DrugsModels");




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


//////////////////////////




router.post("/addItemToGroup/:idPharmacies", async (request, response) => {
    try {
        const { name, imageUrl } = request.body;
        const { idPharmacies } = request.params;

        // Check if the specified pharmacy group exists
        const existingGroup = await MedicalCategory.findById(idPharmacies);

        if (!existingGroup) {
            return response.status(400).json({ message: "Pharmacy group with the specified ID not found" });
        }

        // Check if a group with the same name already exists
        const groupWithSameName = existingGroup.group.find(group => group.name === name);

        if (groupWithSameName) {
            return response.status(400).json({ message: "A group with the same name already exists in the pharmacy" });
        }

        // Add the new item to the "all" array
        existingGroup.group.push({ name, imageUrl });
        const updatedGroup = await existingGroup.save();

        response.status(200).json(updatedGroup);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});


router.get("/getAllGroup/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const medicalCategory = await MedicalCategory.findById(id);

        if (medicalCategory) {
            const { _id, group } = medicalCategory;
            // Remove the 'company' field from each specialty
            const modifiedGroups = group.map(({ imageUrl, name, _id }) => ({ name, _id, imageUrl }));

            res.status(200).json({ _id, group: modifiedGroups });
        } else {
            res.status(404).json({ message: "Can't find medicalCategory" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});





////////////////

router.post("/addDrug/:groupId", async (req, res) => {
    try {
        const { groupId } = req.params;
        const { name, imageUrl } = req.body;

        // Find the medical category with the specified groupId
        const medicalCategory = await MedicalCategory.findOne({ "group._id": groupId });

        if (!medicalCategory) {
            return res.status(404).json({ message: "Medical category with the specified groupId not found" });
        }

        // Find the group within the medical category with the specified groupId
        const foundGroup = medicalCategory.group.find(group => group._id.toString() === groupId);

        if (!foundGroup) {
            return res.status(404).json({ message: "Group with the specified groupId not found in the medical category" });
        }

        // Assuming you have a 'schedule' field in the Group model
        foundGroup.schedule = foundGroup.schedule || [];

        // Create a new drug instance and associate it with the group
        const newDrug = new Drugs({ name, imageUrl });

        // Add the groupId to the newDrug
        newDrug.group = groupId;

        // Add the new drug to the schedule
        foundGroup.schedule.push(newDrug);

        // Save the updated category and the new drug
        await Promise.all([medicalCategory.save(), newDrug.save()]);

        // Include groupId in the response
        res.status(200).json(newDrug);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});



router.get('/getAllDrug/:groupId', async (request, response) => {
    try {
        const { groupId } = request.params;

        const drugs = await Drugs.find({ group: groupId }, 'name imageUrl');

        if (drugs.length === 0) {
            return response.status(404).json({ message: 'No drugs found for the given groupId' });
        }

        response.status(200).json({ drugs });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});





router.put("/editDrug/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const drugs = await Drugs.findByIdAndUpdate(id, request.body);
        if (!drugs)
            response.status(404).json({ message: `cannot find user with id ${id} !` });
        else {
            const newDrugs = await Drugs.findById(id);
            response.status(200).json(newDrugs);
        }
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});


router.delete("/deleteDrug/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const drugs = await Drugs.findByIdAndDelete(id);

        if (!drugs) {
            return response.status(404).json({ message: "drugs not found" });
        }

        response.status(200).json({ message: "Deleted drugs" });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});


module.exports = router;