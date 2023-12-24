const express = require('express');
const router = express.Router();

const Service = require("../models/serviceModels");


const multer = require('multer');
const path = require('path');
const fs = require('fs');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'C:\\Users\\kamel\\Desktop\\New folder';
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post("/addService", upload.single('image'), async (request, response) => {
    try {
        const { name } = request.body;

        // Check if a service with the same name already exists
        const existingService = await Service.findOne({ name });

        if (existingService) {
            return response.status(400).json({ message: "Service with the same name already exists" });
        }

        let imageUrl = null;

        if (request.file) {
            // If an image was uploaded, use the uploaded image
            imageUrl = request.file.path;
        } else if (request.body.imagePath) {
            // If no image was uploaded but imagePath is provided in the request body, use the provided imagePath
            imageUrl = request.body.imagePath;

            // You may want to check if the file at the provided path exists before saving it in the database
            if (!fs.existsSync(imageUrl)) {
                return response.status(400).json({ message: "Image file does not exist" });
            }
        }

        // If no existing service, create a new one
        const service = await Service.create({ name, imageUrl });

        response.status(200).json(service);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});








router.post("/addService1", async (request, response) => {
    try {
        const { name } = request.body;

        // Check if a service  with the same name already exists
        const existingService = await Service.findOne({ name });

        if (existingService) {
            return response.status(400).json({ message: "Service with the same name already exists" });
        }

        // If no existing service , create a new one
        const service = await Service.create(request.body);

        response.status(200).json(service);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});







router.get("/getAllServices", async (request, response) => {
    try {
        const service = await Service.find();
        if (service.length > 0)
            response.status(200).json({ service });
        else
            response.status(200).json({ "message": "no data" });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});


router.delete("/deleteService/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const service = await Service.findByIdAndDelete(id);

        if (!service) {
            return response.status(404).json({ message: "Service not found" });
        }

        response.status(200).json({ message: `Deleted service: ${service.name}` });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});


router.put("/editService/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const service = await Service.findByIdAndUpdate(id, request.body);
        if (!service)
            response.status(404).json({ message: `cannot find user with id ${id} !` });
        else {
            const newService = await Service.findById(id);
            response.status(200).json(newService);
        }
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});




module.exports = router;