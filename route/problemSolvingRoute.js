const express = require('express');
const router = express.Router();
const ProblemSolving = require("../models/problemSolvingModels");
const Customer = require("../models/customerModels.js");
const Admin = require("../models/adminModels");



router.post('/problems/:createdBy/:assignedTo', async (req, res) => {
    try {
        const { createdBy, assignedTo } = req.params;
        const { title, description, priority } = req.body;

        const isCustomer = await Customer.findById(createdBy);
        if (!isCustomer) {
            return res.status(400).json({ message: 'Invalid customer ID for createdBy' });
        }

        const isAdmin = await Admin.findById(assignedTo);
        if (!isAdmin) {
            return res.status(400).json({ message: 'Invalid admin ID for assignedTo' });
        }

        const newProblem = new ProblemSolving({
            title,
            description,
            priority,
            createdBy,
            assignedTo,
        });

        await newProblem.save();

        res.status(201).json({ message: 'Problem created successfully', problem: newProblem });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});



router.get('/GetAllProblems', async (req, res) => {
    try {
        const problems = await ProblemSolving.find();
        res.status(200).json({ problems });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.put('/adminProblems/:id', async (req, res) => {
    try {
        const { status, EditedByAdminAt } = req.body;

        const updatedProblem = await ProblemSolving.findByIdAndUpdate(
            req.params.id,
            { status, EditedByAdminAt },
            { new: true }
        );

        if (!updatedProblem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        res.status(200).json({ message: 'Problem status updated successfully', problem: updatedProblem });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.put('/addComment/:createdBy/:id', async (req, res) => {
    try {
        const { status, commentText } = req.body;
        const { createdBy } = req.params;

        const isAdmin = await Admin.findById(createdBy);
        if (!isAdmin) {
            return res.status(400).json({ message: 'Invalid admin ID for createdBy' });
        }

        if (!commentText) {
            return res.status(400).json({ message: 'Comment text is required' });
        }

        const updatedProblem = await ProblemSolving.findByIdAndUpdate(
            req.params.id,
            {
                $set: { status },
                $push: {
                    comments: {
                        text: commentText,
                        createdBy,
                        createdAt: new Date(),
                    },
                },
            },
            { new: true }
        );

        if (!updatedProblem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        res.status(200).json({ message: 'Problem status and comment updated successfully', problem: updatedProblem });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.get('/GetProblems/:id', async (req, res) => {
    try {
        const problem = await ProblemSolving.findById(req.params.id);
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }
        res.status(200).json({ problem });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.delete('/DeleteProblems/:id', async (req, res) => {
    try {
        const deletedProblem = await ProblemSolving.findByIdAndDelete(req.params.id);

        if (!deletedProblem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        res.status(200).json({ message: 'Problem deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;
