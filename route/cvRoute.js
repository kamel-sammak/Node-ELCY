const express = require('express');
const router = express.Router();
const Customer = require("../models/customerModels.js");
const Post = require("../models/postModels");

router.get('/matchPostsToCV/:customerId', async (req, res, next) => {
    try {
        // Replace with your authentication middleware logic
        const { customerId } = req.params;

        // Fetch customer CV
        const customer = await Customer.findOne({ _id: customerId });

        // Check if customer and cvContent exist
        if (!customer || !customer.cvContent) {
            return res.status(404).json({
                success: false,
                message: "Customer not found or cvContent is missing.",
            });
        }

        const customerSkills = customer.cvContent.toLowerCase().split(' ');

        // Fetch all posts
        const posts = await Post.find({});

        // Store matches with customized information
        const matchedResults = [];

        // Iterate through posts and find matches
        posts.forEach((post) => {
            // Check if postContent exists
            if (post.postContent) {
                const postSkills = post.postContent.toLowerCase().split(' ');

                // Check if there is a match between postContent and cvContent
                const intersection = customerSkills.filter((skill) => postSkills.includes(skill));
                const union = [...new Set([...customerSkills, ...postSkills])];
                const jaccardSimilarity = union.length === 0 ? 0 : intersection.length / union.length;

                if (jaccardSimilarity > 0) {
                    // Customize the information you want to include in the result
                    const matchResult = {
                        postId: post._id, // Include post ID or other relevant information
                        postTitle: post.title, // Include post title or other relevant information
                        similarity: jaccardSimilarity,
                    };

                    matchedResults.push(matchResult);
                }
            }
        });

        // Sort matched results by similarity in descending order
        matchedResults.sort((a, b) => b.similarity - a.similarity);

        res.status(200).json({
            success: true,
            data: matchedResults,
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
