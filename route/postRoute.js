const express = require('express');
const router = express.Router();

const Post = require("../models/postModels");
const Category = require("../models/categoryModels");


router.post("/addPost/:companyId", async (req, res) => {
    try {
        const { companyId } = req.params;
        const { title, content, engineeringDivision, Skills } = req.body;

        // Validate engineeringDivision and Skills
        const validOptions = {
            informationEngineering: [
                'font-end', 'backend', 'flutter', 'nodejs', 'viewjs', 'AI',
                'laravel', 'asp.net', 'django', 'go', 'rube', 'machine learning',
                'deep learning', 'java', 'c#', 'c', 'c++', 'network', 'neural network',
                'software', 'search engine', 'web desgin', 'web development', 'UI',
                'oop', 'information security', 'data Analysis', 'Mobile app development'
            ],
            civil: [
                'Structural Engineering', 'Aotucade', '3D Max',
                'Roads and bridges engineering (Transportation Engineering)',
                'Water Resources Engineering', 'Construction Management Engineering',
                'Engineering Design', 'Engineering Inspection', 'Engineering Project Management',
                'Engineering Quality', 'Structural Analysis', 'Infrastructure',
                'Architectural Design', 'Excavation and Excavating', 'Cost Estimation'
            ],
            architecture: [
                'Architectural Design', 'Urban Planning', 'Architectural Facade',
                'Interior Design', 'Architectural Plans', 'Sustainable Design',
                'Landscape Design', 'Structural Design', 'Lighting Design',
                'Open Design', 'Glass Facade Design', 'Architectural Integration'
            ],
            medical: [
                'Medical imaging devices', 'Digital Medical Imaging Techniques',
                'Vital Signs Monitoring Devices', 'Intensive Care Unit Devices',
                'Surgical Robots', 'Cardiovascular Devices', 'Telemedicine Technologies',
                'Pain Management Devices', 'Biomechanical Design', 'Organ Regeneration Technologies',
                'Artificial limbs', 'Medical Device Manufacturing'
            ]
        };

        if (engineeringDivision && (!validOptions[engineeringDivision] || !validOptions[engineeringDivision].includes(Skills))) {
            return res.status(400).json({
                message: 'Invalid Skills for the selected engineering division, please choose from the specified options'
            });
        }

        const category = await Category.findOne({ "specialties.company._id": companyId });

        if (!category) {
            return res.status(404).json({ message: "Company with the specified ID not found in any category" });
        }

        const specialty = category.specialties.find(spec => spec.company.some(company => company._id.toString() === companyId));

        if (!specialty) {
            return res.status(404).json({ message: "Company with the specified ID not found in the category" });
        }

        const foundCompany = specialty.company.find(company => company._id.toString() === companyId);

        if (!foundCompany) {
            return res.status(404).json({ message: "Company with the specified ID not found in the specialty" });
        }

        // Assuming you have a 'posts' field in the Company model
        foundCompany.posts = foundCompany.posts || [];

        // Create a new post instance and associate it with the company
        const newPost = new Post({
            title, content,
            Engineering: engineeringDivision,
            Skills: Skills,
        });

        // Add the companyId to the newPost
        newPost.company = companyId;

        // Add the new post to the company
        foundCompany.posts.push(newPost);

        // Save the updated category and the new post
        await Promise.all([category.save(), newPost.save()]);

        // Include companyId in the response
        res.status(200).json(newPost);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});



// router.post("/addPostOld/:companyId", async (req, res) => {
//     try {
//         const { companyId } = req.params;
//         const { title, content } = req.body;

//         const category = await Category.findOne({ "specialties.company._id": companyId });

//         if (!category) {
//             return res.status(404).json({ message: "Company with the specified ID not found in any category" });
//         }

//         const specialty = category.specialties.find(spec => spec.company.some(company => company._id.toString() === companyId));

//         if (!specialty) {
//             return res.status(404).json({ message: "Company with the specified ID not found in the category" });
//         }

//         const foundCompany = specialty.company.find(company => company._id.toString() === companyId);

//         if (!foundCompany) {
//             return res.status(404).json({ message: "Company with the specified ID not found in the specialty" });
//         }

//         // Assuming you have a 'posts' field in the Company model
//         foundCompany.posts = foundCompany.posts || [];

//         // Create a new post instance and associate it with the company
//         const newPost = new Post({ title, content});

//         // Add the companyId to the newPost
//         newPost.company = companyId;

//         // Add the new post to the company
//         foundCompany.posts.push(newPost);

//         // Save the updated category and the new post
//         await Promise.all([category.save(), newPost.save()]);

//         // Include companyId in the response
//         res.status(200).json(newPost);
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ message: error.message });
//     }
// });


router.get('/getAllPost/:companyId', async (request, response) => {
    try {
        const { companyId } = request.params;

        const post = await Post.find({ company: companyId }, 'content title');

        if (post.length === 0) {
            return response.status(404).json({ message: 'No post found for the given companyId' });
        }

        response.status(200).json({ post });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

router.get("/getPost_info/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const post = await Post.findById(id).select('title content');
        if (!post) {
            return response.status(404).json({ message: "post not found" });
        }
        response.status(200).json(post);
    } catch (error) {
        console.log(error.message);
        response.status(500).json({ message: error.message });
    }
});

router.put("/editPost/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const post = await Post.findByIdAndUpdate(id, request.body);
        if (!post)
            response.status(404).json({ message: `cannot find user with id ${id} !` });
        else {
            const newPost = await Post.findById(id);
            response.status(200).json(newPost);
        }
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});


router.delete("/deletePost/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const post = await Post.findByIdAndDelete(id);

        if (!post) {
            return response.status(404).json({ message: "post not found" });
        }

        response.status(200).json({ message: "Deleted post" });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});


module.exports = router;