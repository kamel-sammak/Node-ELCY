const express = require('express');
const router = express.Router();
const MedicalCategory = require("../models/MedicalCategoryModels");
const Drugs = require("../models/DrugsModels");


router.post("/addDrug/:groupId", async (req, res) => {
    try {
        const { groupId } = req.params;
        const { name, imageUrl } = req.body;

        const medicalCategory = await MedicalCategory.findOne({ "group._id": groupId });

        if (!medicalCategory) {
            return res.status(404).json({ message: "Medical category with the specified groupId not found" });
        }

        const foundGroup = medicalCategory.group.find(group => group._id.toString() === groupId);

        foundGroup.schedule = foundGroup.schedule || [];

        const newDrug = new Drugs({ name, imageUrl });

        newDrug.group = groupId;

        foundGroup.schedule.push(newDrug);

        await Promise.all([medicalCategory.save(), newDrug.save()]);

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

router.get("/getDrug_info/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const drugs = await Drugs.findById(id);
        if (!drugs) {
            return response.status(404).json({ message: "drugs not found" });
        }
        response.status(200).json(drugs);
    } catch (error) {
        console.log(error.message);
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