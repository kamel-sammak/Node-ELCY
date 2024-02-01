// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const SingleFile = require('../models/singlefile');
// const MultipleFile = require('../models/multiplefile');


// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads');
//     },
//     filename: (req, file, cb) => {
//         cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
//     }
// });

// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// }

// const upload = multer({ storage: storage, fileFilter: fileFilter });

// router.post('/singleFileUpload', upload.single('file'), async (req, res, next) => {
//     try {
//         const file = new SingleFile({
//             fileName: req.file.originalname,
//             filePath: req.file.path,
//             fileType: req.file.mimetype,
//             fileSize: fileSizeFormatter(req.file.size, 2) // 0.00
//         });
//         await file.save();
//         res.status(201).send('File Uploaded Successfully');
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// });

// router.post('/multipleFileUpload', upload.array('files', 3), async (req, res, next) => {
//     try {
//         let filesArray = [];
//         req.files.forEach(element => {
//             const file = {
//                 fileName: element.originalname,
//                 filePath: element.path,
//                 fileType: element.mimetype,
//                 fileSize: fileSizeFormatter(element.size, 2)
//             }
//             filesArray.push(file);
//         });
//         const multipleFiles = new MultipleFile({
//             title: req.body.title,
//             files: filesArray
//         });
//         await multipleFiles.save();
//         res.status(201).send('Files Uploaded Successfully');
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// });

// router.get('/getallSingleFiles', async (req, res, next) => {
//     try {
//         const files = await SingleFile.find();
//         res.status(200).send(files);
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// });

// router.get('/getallMultipleFiles', async (req, res, next) => {
//     try {
//         const files = await MultipleFile.find();
//         res.status(200).send(files);
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// });

// const fileSizeFormatter = (bytes, decimal) => {
//     if (bytes === 0) {
//         return '0 Bytes';
//     }
//     const dm = decimal || 2;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB'];
//     const index = Math.floor(Math.log(bytes) / Math.log(1000));
//     return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index];
// }


// module.exports = router;
