const express = require('express');
const router = express.Router();
const MedicalCategory = require("../models/MedicalCategory");






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


router.put("/updateItemInGroup/:groupId", async (request, response) => {
    try {
        const { name, imageUrl } = request.body;
        const { groupId } = request.params;

        // Check if the specified pharmacy group exists
        const existingGroup = await MedicalCategory.findOne({ 'group._id': groupId });

        if (!existingGroup) {
            return response.status(400).json({ message: "Pharmacy group with the specified ID not found" });
        }

        // Find the group within the medical category with the specified groupId
        const existingItem = existingGroup.group.find(group => group._id.toString() === groupId);

        if (!existingItem) {
            return response.status(400).json({ message: "Item with the specified ID not found in the pharmacy group" });
        }

        // Check if a group with the same name already exists (excluding the current group)
        const groupWithSameName = existingGroup.group.find(group => group.name === name && group._id.toString() !== groupId);

        if (groupWithSameName) {
            return response.status(400).json({ message: "A group with the same name already exists in the pharmacy" });
        }

        // Update the item in the "all" array
        existingItem.name = name;
        existingItem.imageUrl = imageUrl;
         await existingGroup.save();

        response.status(200).json({message: "Modified successfully"});
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});



router.delete("/deleteItemInGroup/:groupId", async (request, response) => {
    try {
        const { groupId } = request.params;

        // Check if the specified pharmacy group exists
        const existingGroup = await MedicalCategory.findOne({ 'group._id': groupId });

        if (!existingGroup) {
            return response.status(400).json({ message: "Pharmacy group with the specified ID not found" });
        }

        // Find the index of the group within the medical category with the specified groupId
        const groupIndex = existingGroup.group.findIndex(group => group._id.toString() === groupId);

        if (groupIndex === -1) {
            return response.status(400).json({ message: "Group with the specified ID not found in the pharmacy" });
        }

        // Remove the item from the "all" array
        existingGroup.group.splice(groupIndex, 1);
        await existingGroup.save();

        response.status(200).json({ message: "Deleted Item In Group" });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});




module.exports = router;