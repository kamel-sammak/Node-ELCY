const express = require('express');
const router = express.Router();
const MedicalCategory = require("../models/MedicalCategoryModels");


router.post("/addItemAndSignup/:idPharmacies", async (request, response) => {
    try {
        const { name, imageUrl, email, password } = request.body;
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

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return response.status(400).json({ message: "Invalid email format. Please provide a valid email address with exactly one '@' symbol." });
        }

        // Validate password length
        if (password.length < 8) {
            return response.status(400).json({ message: "Password must be at least 8 characters long." });
        }

        // Validate password format (should contain both letters and numbers)
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
        if (!passwordRegex.test(password)) {
            return response.status(400).json({ message: "Password must contain both letters and numbers." });
        }

        // Check if a user with the same email already exists
        const existingUser = existingGroup.group.find(user => user.email === email);

        if (existingUser) {
            return response.status(400).json({ message: "User with this email already exists. Please choose a different one or log in." });
        }

        // Add the new item to the "group" array along with email and password
        existingGroup.group.push({ name, imageUrl, email, password });

        // Update the existing group
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


// router.post("/addItemToGroup/:idPharmacies", async (request, response) => {
//     try {
//         const { name, imageUrl } = request.body;
//         const { idPharmacies } = request.params;

//         // Check if the specified pharmacy group exists
//         const existingGroup = await MedicalCategory.findById(idPharmacies);

//         if (!existingGroup) {
//             return response.status(400).json({ message: "Pharmacy group with the specified ID not found" });
//         }

//         // Check if a group with the same name already exists
//         const groupWithSameName = existingGroup.group.find(group => group.name === name);

//         if (groupWithSameName) {
//             return response.status(400).json({ message: "A group with the same name already exists in the pharmacy" });
//         }

//         // Add the new item to the "all" array
//         existingGroup.group.push({ name, imageUrl });
//         const updatedGroup = await existingGroup.save();

//         response.status(200).json(updatedGroup);
//     } catch (error) {
//         response.status(500).json({ message: error.message });
//     }
// });


router.get("/getAllGroup/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const medicalCategory = await MedicalCategory.findById(id);

        if (medicalCategory) {
            const { _id, group } = medicalCategory;
            // Remove the 'company' field from each specialty
            const modifiedGroups = group.map(({ email, password, imageUrl, name, _id }) => ({ name, _id, imageUrl, email, password }));

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
                const { _id, email, password, imageUrl, name } = group;
                const modifiedGroup = { _id, email, password, imageUrl, name };

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

        response.status(200).json({ message: "Modified successfully" });
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