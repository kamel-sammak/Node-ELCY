const express = require('express');
const router = express.Router();
const MedicalCategory = require("../models/MedicalCategoryModels");


router.post("/addItemAndSignup/:idPharmacies", async (request, response) => {                                     //idGroup
    try {
        const { name, imageUrl, email, password } = request.body;
        const { idPharmacies } = request.params;                                                                  //idGroup

        const existingGroup = await MedicalCategory.findById(idPharmacies);                                       //idGroup

        if (!existingGroup) {
            return response.status(400).json({ message: "group with the specified ID not found" });
        }

        const groupWithSameName = existingGroup.group.find(group => group.name === name);

        if (groupWithSameName) {
            return response.status(400).json({ message: "A group with the same name already exists in the item" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return response.status(400).json({ message: "Invalid email format. Please provide a valid email address with exactly one '@' symbol." });
        }

        if (password.length < 8) {
            return response.status(400).json({ message: "Password must be at least 8 characters long." });
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
        if (!passwordRegex.test(password)) {
            return response.status(400).json({ message: "Password must contain both letters and numbers." });
        }

        const existingUser = existingGroup.group.find(user => user.email === email);

        if (existingUser) {
            return response.status(400).json({ message: "User with this email already exists. Please choose a different one or log in." });
        }

        existingGroup.group.push({ name, imageUrl, email, password });

        const updatedGroup = await existingGroup.save();

        response.status(200).json({ message: "Item added and user signed up successfully", updatedGroup });
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            // Duplicate key (email) error
            response.status(400).json({ error: "Email must be unique. User with this email already exists. Please choose a different one or log in." });
        } else {
            console.error(error.message);
            response.status(500).json({ message: error.message });
        }
    }
});


router.get("/getAllGroup/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const medicalCategory = await MedicalCategory.findById(id);

        if (medicalCategory) {
            const { _id, group } = medicalCategory;

            const modifiedGroups = group.map(({ imageUrl, name, _id }) => ({ name, _id, imageUrl }));

            res.status(200).json({ _id, group: modifiedGroups });
        } else {
            res.status(404).json({ message: "Can't find medicalCategory" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/getGroup_info/:groupId", async (req, res) => {
    try {
        const { groupId } = req.params;
        const medicalCategory = await MedicalCategory.findOne({ "group._id": groupId });

        if (medicalCategory) {
            const group = medicalCategory.group.find(group => group._id == groupId);

            if (group) {
                const { _id, imageUrl, name } = group;
                const modifiedGroup = { _id, imageUrl, name };

                res.status(200).json(modifiedGroup);
            } else {
                res.status(404).json({ message: "Can't find group" });
            }
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

        const existingGroup = await MedicalCategory.findOne({ 'group._id': groupId });

        if (!existingGroup) {
            return response.status(400).json({ message: "group with the specified ID not found" });
        }

        const existingItem = existingGroup.group.find(group => group._id.toString() === groupId);

        const groupWithSameName = existingGroup.group.find(group => group.name === name && group._id.toString() !== groupId);

        if (groupWithSameName) {
            return response.status(400).json({ message: "A group with the same name already exists in the pharmacy" });
        }

        existingItem.name = name;
        existingItem.imageUrl = imageUrl;
        await existingGroup.save();

        response.status(200).json({ message: "Modified successfully" });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});


router.delete("/deleteItemInGroup/:groupId", async (request, response) => {
    try {
        const { groupId } = request.params;

        const existingGroup = await MedicalCategory.findOne({ 'group._id': groupId });

        if (!existingGroup) {
            return response.status(400).json({ message: "Pharmacy group with the specified ID not found" });
        }

        const groupToRemove = existingGroup.group.find(group => group._id.toString() === groupId);

        if (!groupToRemove) {
            return response.status(400).json({ message: "Group with the specified ID not found in the pharmacy" });
        }

        existingGroup.group = existingGroup.group.filter(group => group._id.toString() !== groupId);
        await existingGroup.save();

        response.status(200).json({ message: "Deleted Item In Group" });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});



module.exports = router;