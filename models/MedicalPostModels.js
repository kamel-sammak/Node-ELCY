const mongoose = require('mongoose');
const MedicalPostSchema = new mongoose.Schema({

    content: {
        type: String,
        required: [true, "please enter content !"]
    },
    title: {
        type: String,
        required: [true, "please enter title !"]
    },
    group: { type: mongoose.Schema.Types.ObjectId },

});
const MedicalPost = mongoose.model('MedicalPost', MedicalPostSchema);
module.exports = MedicalPost;