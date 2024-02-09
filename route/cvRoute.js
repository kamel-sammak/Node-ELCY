const express = require('express');
const router = express.Router();
const Customer = require("../models/customerModels.js");
const Post = require("../models/postModels");
const Cv = require("../models/cvModels.js");



router.post('/AddCV/:customerId', async (req, res) => {
    try {
        const { engineeringDivision, Skills } = req.body;
        const { customerId } = req.params;

        const existingCv = await Cv.findOne({ customer: customerId });
        if (existingCv) {
            return res.status(400).json({ error: 'Engineering division already added for this customer' });
        }

        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const divisionOptions = {
            informationEngineering: [
                'font-end', 'backend', 'flutter', 'nodejs', 'viewjs', 'AI',
                'laravel', 'asp.net', 'django', 'go', 'rube', 'machine learning',
                'deep learning', 'java', 'c#', 'c', 'c++', 'network', 'neural network',
                'software', 'search engine', 'web design', 'web development', 'UI',
                'oop', 'information security', 'data analysis', 'Mobile app development'
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
            ],
        };

        if (!engineeringDivision || !(engineeringDivision in divisionOptions)) {
            return res.status(400).json({ error: 'Invalid or missing engineering division' });
        }

        const validEnum = divisionOptions[engineeringDivision];
        const requiredMessage = `Please enter user ${engineeringDivision}!`;
        const SkillsEnum = validEnum;

        if (Skills && !SkillsEnum.includes(Skills)) {
            return res.status(400).json({ error: 'Invalid Skills for the selected engineering division, please choose from the specified options' });
        }
        const newCv = new Cv({
            Engineering: engineeringDivision,
            Skills: Skills, 
            customer: customerId,

        });

        const result = await newCv.save();

        res.status(201).json("Added CV Successfully");
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/matchPostsToCV/:customerId', async (req, res, next) => {
    try {
        const { customerId } = req.params;

        const cv = await Cv.findOne({ customer: customerId });

        if (!cv || !cv.Skills) {
            return res.status(404).json({
                success: false,
                message: "cv not found or Skills is missing.",
            });
        }

        const cvSkills = cv.Skills.toLowerCase().split(' ');

        const posts = await Post.find({});

        const matchedResults = [];

        posts.forEach((post) => {
            if (post.Skills) {
                const postSkills = post.Skills.toLowerCase().split(' ');

                // Check if there is a match between Skills and cv Skills
                const intersection = cvSkills.filter((skill) => postSkills.includes(skill));
                const union = [...new Set([...cvSkills, ...postSkills])];
                const jaccardSimilarity = union.length === 0 ? 0 : intersection.length / union.length;

                if (jaccardSimilarity > 0) {
                    const matchResult = {
                        postId: post._id,
                        companyId: post.company,
                        postTitle: post.title,
                        content: post.content
                        //similarity: jaccardSimilarity,
                        //Skills: post.Skills,
                        
                    };

                    matchedResults.push(matchResult);
                }
            }
        });

        matchedResults.sort((a, b) => b.similarity - a.similarity);

        res.status(200).json(matchedResults);
    } catch (error) {
        next(error);
    }
});



router.get('/matchPostsToCVs', async (req, res, next) => {
    try {

        const cvs = await Cv.find({});

        const matchedResults = [];

        const posts = await Post.find({});

        for (const cv of cvs) {
            if (cv && cv.Skills) {
                const cvSkills = cv.Skills.toLowerCase().split(' ');

                posts.forEach((post) => {
                    if (post.Skills) {
                        const postSkills = post.Skills.toLowerCase().split(' ');

                        // Check if there is a match between Skills and cv Skills
                        const intersection = cvSkills.filter((skill) => postSkills.includes(skill));
                        const union = [...new Set([...cvSkills, ...postSkills])];
                        const jaccardSimilarity = union.length === 0 ? 0 : intersection.length / union.length;

                        if (jaccardSimilarity > 0) {
                            const matchResult = {
                                customerId: cv.customer,
                                postId: post._id,
                                postTitle: post.title,
                                similarity: jaccardSimilarity,
                                Skills: post.Skills
                            };

                            matchedResults.push(matchResult);
                        }
                    }
                });
            }
        }

        matchedResults.sort((a, b) => b.similarity - a.similarity);

        res.status(200).json({
            success: true,
            data: matchedResults,
        });
    } catch (error) {
        next(error);
    }
});


router.get("/getCV_customer/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const cv = await Cv.findOne({ customer: id }).select('Engineering Skills');
        if (!cv) {
            return response.status(404).json({ message: "cv not found" });
        }
        response.status(200).json(cv);
    } catch (error) {
        console.log(error.message);
        response.status(500).json({ message: error.message });
    }
});



module.exports = router;
