const mongoose = require('mongoose');
const MedicalPostSchema = new mongoose.Schema({

    content: { type: String },
    title: { type: String },
    group: { type: mongoose.Schema.Types.ObjectId },

});
const MedicalPost = mongoose.model('MedicalPost', MedicalPostSchema);
module.exports = MedicalPost;