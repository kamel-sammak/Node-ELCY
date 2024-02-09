const express = require('express');
const router = express.Router();

const Company = require("../models/companyModels");
const Category = require("../models/categoryModels");
const Post = require("../models/postModels");


router.post("/addCompaniesAndSignup/:SpecialtiesId", async (req, res) => {
    try {
        const { name, imageUrl, email, password, years, employees } = req.body;
        const { SpecialtiesId } = req.params;

        const category = await Category.findOne({ "specialties._id": SpecialtiesId });

        if (!category) {
            return res.status(404).json({ message: "Specialty with the specified ID not found in any category" });
        }

        const specialty = category.specialties.find(spec => spec._id.toString() === SpecialtiesId);

        const existingCompany = specialty.company.find(company => company.name === name);

        if (existingCompany) {
            return res.status(400).json({ message: "A company with the same name already exists in the specialty" });
        }

        const companyWithSameEmail = specialty.company.find(company => company.email === email);

        if (companyWithSameEmail) {
            return res.status(400).json({ message: "A user with the same email already exists in the specialty. Please choose a different one or log in." });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format. Please provide a valid email address with exactly one '@' symbol." });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long." });
        }

        const newCompany = new Company({ name, imageUrl, email, password });

        // Add optional fields if provided
        if (years) newCompany.years = years;
        if (employees) newCompany.employees = employees;

        if ('rating' in req.body) {
            const validatedRating = parseInt(req.body.rating);
            if (isNaN(validatedRating) || validatedRating < 1 || validatedRating > 5) {
                return res.status(400).json({ message: "Invalid rating. Please provide a rating between 1 and 5." });
            }
            newCompany.rating = validatedRating;
        }

        specialty.company.push(newCompany);

        await category.save();

        res.status(200).json(newCompany);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});



router.get("/getAllCompanies/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const categories = await Category.find();
        let findCat = false;
        let allCompanies = [];

        categories.forEach(category => {
            category.specialties.forEach(specialtie => {
                if (id == specialtie._id) {
                    findCat = true;
                    allCompanies = specialtie.company;
                }
            });
        });

        if (findCat) {
            // Fetch posts for each company
            for (let i = 0; i < allCompanies.length; i++) {
                const companyId = allCompanies[i]._id;
                const posts = await Post.find({ company: companyId });
                allCompanies[i].NumberPost = posts.length;
            }

            const simplifiedCompanies = allCompanies.map(company => ({
                id: company.id,
                name: company.name,
                imageUrl: company.imageUrl,
                years: company.years,
                employees: company.employees,
                rating: company.rating,
                NumberPost: company.NumberPost
            }));

            simplifiedCompanies.sort((a, b) => b.rating - a.rating);

            res.status(200).json(simplifiedCompanies);
        } else {
            res.status(404).json({ message: "Can't find category" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get("/getCompany_info/:companyId", async (req, res) => {
    try {
        const { companyId } = req.params;
        const categories = await Category.find();
        let foundCompany = null;

        categories.forEach(category => {
            category.specialties.forEach(specialtie => {
                specialtie.company.forEach(company => {
                    if (companyId == company._id) {
                        foundCompany = {
                            id: company.id,
                            name: company.name,
                            imageUrl: company.imageUrl,
                            years: company.years,
                            employees: company.employees,
                            rating: company.rating
                        };
                        return; 
                    }
                });
            });
        });

        if (foundCompany) {
            res.status(200).json(foundCompany);
        } else {
            res.status(404).json({ message: "Can't find company" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



router.put("/updateCompanyName/:companyId", async (req, res) => {
    try {
        const { companyId } = req.params;
        const { newName } = req.body;

        const category = await Category.findOne({ "specialties.company._id": companyId });

        if (!category) {
            return res.status(404).json({ message: "Company not found in any category" });
        }

        const specialty = category.specialties.find(spec => spec.company.some(company => company._id.toString() === companyId));

        const companyToUpdate = specialty.company.find(company => company._id.toString() === companyId);

        if (!companyToUpdate) {
            return res.status(404).json({ message: "Company not found" });
        }
        
        companyToUpdate.name = newName;

        await category.save();

        res.status(200).json({ message: "Company name updated successfully", updatedCompany: companyToUpdate });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});







router.delete("/deleteCompany/:companyId", async (req, res) => {
    try {
        const { companyId } = req.params;

        // Find the category and specialty containing the company
        const category = await Category.findOne({ "specialties.company._id": companyId });

        if (!category) {
            return res.status(404).json({ message: "Company not found in any category" });
        }

        const specialty = category.specialties.find(spec => spec.company.some(company => company._id.toString() === companyId));

        if (!specialty) {
            return res.status(404).json({ message: "Company not found in the specialty" });
        }

        // Remove the company from the specialty
        specialty.company = specialty.company.filter(company => company._id.toString() !== companyId);

        // Save the updated category
        await category.save();

        res.status(200).json({ message: "Company deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});





module.exports = router;