const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const Image = require('../models/imageModels'); 

const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {

    const modifiedFileName = req.body.name + path.extname(file.originalname);
    cb(null, modifiedFileName);
  },
});

const upload = multer({
  storage: Storage
}).single('image');


router.post('/upload', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      res.status(500).send({ status: 500, message: 'Error uploading image', error: err.message });
    } else {
      try {
        const newImage = new Image({
          name: req.body.name,
          image: {
            data: req.file.filename,
            contentType: req.file.mimetype,
          },
        });

        await newImage.save();
        res.status(200).send({ status: 200, message: 'Successfully uploaded' });
      } catch (saveError) {
        console.error(saveError);
        res.status(500).send({ status: 500, message: 'Error saving image data', error: saveError.message });
      }
    }
  });
});


router.get('/getImage/:name', async (req, res) => {
  try {
    const result = await Image.findOne({ name: req.params.name });

    if (result) {
      const imageUrl = `/uploads/${req.params.name}`;

      res.status(200).send({ imageUrl: `${imageUrl}.${result.image.contentType.split('/')[1]}` });
    } else {
      res.status(404).send({ status: 404, message: 'Image not found' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).send({ status: 500, message: e.message });
  }
});

module.exports = router;
