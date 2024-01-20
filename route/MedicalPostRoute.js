const express = require('express');
const router = express.Router();
const MedicalCategory = require("../models/MedicalCategoryModels");
const MedicalPost = require("../models/MedicalPostModels");


router.post("/addPostToGroup/:groupId", async (req, res) => {
    try {
        const { groupId } = req.params;
        const { title, content } = req.body;

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

        // Create a new MedicalPost instance and associate it with the group
        const newMedicalPost = new MedicalPost({ title, content });

        // Add the groupId to the newMedicalPost
        newMedicalPost.group = groupId;

        // Add the new MedicalPost to the schedule
        foundGroup.schedule.push(newMedicalPost);

        // Save the updated category and the new MedicalPost
        await Promise.all([medicalCategory.save(), newMedicalPost.save()]);

        // Include groupId in the response
        res.status(200).json(newMedicalPost);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});


router.get('/getAllMedicalPost/:groupId', async (request, response) => {
    try {
        const { groupId } = request.params;

        const medicalPost = await MedicalPost.find({ group: groupId });

        if (medicalPost.length === 0) {
            return response.status(404).json({ message: 'No medicalPost found for the given groupId' });
        }

        response.status(200).json({ medicalPost });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

router.get("/getMedicalPost_info/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const medicalPost = await MedicalPost.findById(id).select('title content');
        if (!medicalPost) {
            return response.status(404).json({ message: "medicalPost not found" });
        }
        response.status(200).json(medicalPost);
    } catch (error) {
        console.log(error.message);
        response.status(500).json({ message: error.message });
    }
});

router.put("/editMedicalPost/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const medicalPost = await MedicalPost.findByIdAndUpdate(id, request.body);
        if (!medicalPost)
            response.status(404).json({ message: `cannot find user with id ${id} !` });
        else {
            const newMedicalPost = await MedicalPost.findById(id);
            response.status(200).json(newMedicalPost);
        }
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});


router.delete("/deleteMedicalPost/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const medicalPost = await MedicalPost.findByIdAndDelete(id);

        if (!medicalPost) {
            return response.status(404).json({ message: "medicalPost not found" });
        }

        response.status(200).json({ message: "Deleted medicalPost" });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});


module.exports = router;