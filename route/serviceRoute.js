const express = require('express');
const router = express.Router();

const Service = require("../models/serviceModels");
const Image = require('../models/imageModels');


// const path = require('path');
// const multer = require('multer');

// const Storage = multer.diskStorage({
//     destination: "uploads",
//     filename: (req, file, cb) => {
//       // Modify the filename to be the entered name with the image suffix
//       const modifiedFileName = req.body.name + path.extname(file.originalname);
//       cb(null, modifiedFileName);
//     },
//   });
  
//   const upload = multer({
//     storage: Storage
//   }).single('image');


// router.post("/addService", async (request, response) => {
//     try {
//         upload(request, response, async (err) => {
//             if (err) {
//                 console.log(err);
//                 return response.status(500).json({ status: 500, message: 'Error uploading image', error: err.message });
//             }

//             try {
//                 const existingService = await Service.findOne({ name: request.body.name });

//                 if (existingService) {
//                     // Service with the same name already exists
//                     return response.status(400).json({ status: 400, message: 'Service with the same name already exists' });
//                 }

//                 // Create a new image document
//                 const newImage = new Image({
//                     name: request.body.name,
//                     image: {
//                         data: request.file.filename,
//                         contentType: request.file.mimetype,
//                     },
//                 });

//                 // Save the image document
//                 await newImage.save();

//                 // Create a new service document with the image details
//                 const service = await Service.create({
//                     id: request.body.id,
//                     name: request.body.name,
//                     imageUrl: '/uploads/' + newImage.name + '.' + newImage.image.contentType.split('/')[1], // Set the image URL in the service document
//                     image: newImage,
//                 });
//                 response.status(200).json(service);

//             } catch (saveError) {
//                 console.error(saveError);
//                 response.status(500).json({ status: 500, message: 'Error saving image data', error: saveError.message });
//             }
//         });

//     } catch (error) {
//         response.status(500).json({ message: error.message });
//     }
// });


router.post("/addService", async (request, response) => {
    try {
        const { name, imageUrl } = request.body;

        const existingService = await Service.findOne({ name });

        if (existingService) {
            return response.status(400).json({ message: "Service with the same name already exists" });
        }

        const service = await Service.create(request.body);

        response.status(200).json(service);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});



router.get("/getAllServices", async (request, response) => {
    try {
        const services = await Service.find({}); // Exclude the _id field ('name -_id')
        if (services.length > 0) {
            response.status(200).json({ services });
        } else {
            response.status(200).json({ "message": "no data" });
        }
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
            response.status(200).json("Modified successfully");
        }
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



module.exports = router;