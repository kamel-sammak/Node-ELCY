const express = require('express');
const router = express.Router();

const Company = require("../models/companyModels");
const Category = require("../models/categoryModels");




router.post("/addCompany1", async (request, response) => {
    try {
        const { name, category } = request.body;

        // Check if a company with the same name already exists
        const existingCompany = await Company.findOne({ name });

        if (existingCompany) {
            return response.status(400).json({ message: "Company with the same name already exists" });
        }

        // Find the category by name (assuming your category has a 'name' field)
        const selectedCategory = await Category.findOne({ name: category });

        if (!selectedCategory) {
            return response.status(400).json({ message: "Invalid category specified" });
        }

        // If no existing company, create a new one and associate it with the category
        const company = await Company.create({ name, category: selectedCategory._id });

        response.status(200).json({ company });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});



router.post("/addCompany", async (request, response) => {
    try {
        const { name } = request.body;

        // Check if a company with the same name already exists
        const existingCompany = await Company.findOne({ name });

        if (existingCompany) {
            return response.status(400).json({ message: "company with the same name already exists" });
        }

        // If no existing company, create a new one
        const company = await Company.create(request.body);

        response.status(200).json({company});
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});




router.post("/addCompany1", async (request, response) => {
    try {
        const { name } = request.body;

        // Check if a company with the same name already exists
        const existingCompany = await Company.findOne({ name });

        if (existingCompany) {
            return response.status(400).json({ message: "Company with the same name already exists" });
        }

        // If no existing company, create a new one
        const company = await Company.create(request.body);

        // Find categories for the company and extract specialization names
        const categories = await Category.find({ _id: { $in: company.categories } });
        const specializationNames = categories.flatMap(category => category.specialties.map(specialty => specialty.name));

        response.status(200).json({ company, specializationNames });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});











module.exports = router;