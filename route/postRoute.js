const express = require('express');
const router = express.Router();

const Post = require("../models/postModels");
const Category = require("../models/categoryModels");



router.post("/addPost/:companyId", async (req, res) => {
    try {
        const { companyId } = req.params;
        const { title, content, postContent } = req.body;

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
        const newPost = new Post({ title, content, postContent });

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