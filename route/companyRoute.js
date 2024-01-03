const express = require('express');
const router = express.Router();

const Company = require("../models/companyModels");
const Category = require("../models/categoryModels");


router.post("/addCompanies", async (req, res) => {
    try {
        const { SpecialtiesId, name } = req.body;
        const category = await Category.findOne({ "specialties._id": SpecialtiesId });

        if (!category) {
            return res.status(404).json({ message: "Specialty with the specified ID not found in any category" });
        }

        const specialty = category.specialties.find(spec => spec._id.toString() === SpecialtiesId);

        if (!specialty) {
            return res.status(404).json({ message: "Specialty with the specified ID not found in the category" });
        }

        // Check if a company with the same name already exists in the specialty
        const existingCompany = specialty.company.find(company => company.name === name);

        if (existingCompany) {
            return res.status(400).json({ message: "A company with the same name already exists in the specialty" });
        }

        // Create a new company
        const newCompany = new Company({ name });

        // Add the new company to the specialty
        specialty.company.push(newCompany);

        // Save the updated category
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
        var findCat = false;
        var allCompanies = []
        categories.forEach(category => {
            findCat = true

            category.specialties.forEach(specialtie => {
                if(id == specialtie._id)
                allCompanies = specialtie.company
            });
        });
        if (findCat) res.status(200).json(allCompanies);
        else res.status(404).json({ message: "can't find category" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});








// router.post("/addCompaniesNew", async (req, res) => {
//     try {
//         const { id , name } = req.body;
//         const categories = await Category.find();
//         // const newCat = {}
//         var newCategory
//         categories.forEach(category => {
//             category.specialties.forEach(specialtie => {
//                 if(id == specialtie._id)
//                 specialtie.company.push({"name" : name})
//                 newCategory = Category.findByIdAndUpdate(category._id, category);
//             });
            
//             res.status(200).json(newCategory);
//         });
//         // if (category) res.status(200).json(category);
//         // else res.status(404).json({ message: "can't find category" });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });




router.put("/updateCompanyName/:companyId", async (req, res) => {
    try {
        const { companyId } = req.params;
        const { newName } = req.body;

        // Find the category and specialty containing the company
        const category = await Category.findOne({ "specialties.company._id": companyId });

        if (!category) {
            return res.status(404).json({ message: "Company not found in any category" });
        }

        const specialty = category.specialties.find(spec => spec.company.some(company => company._id.toString() === companyId));

        if (!specialty) {
            return res.status(404).json({ message: "Company not found in the specialty" });
        }

        // Find the company and update its name
        const companyToUpdate = specialty.company.find(company => company._id.toString() === companyId);

        if (!companyToUpdate) {
            return res.status(404).json({ message: "Company not found" });
        }

        companyToUpdate.name = newName;

        // Save the updated category
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