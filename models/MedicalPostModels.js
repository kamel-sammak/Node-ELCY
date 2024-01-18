const mongoose = require('mongoose');
const MedicalPostSchema = new mongoose.Schema({


    content: {
        type: String,
        //     required: [true, "Please enter the post"],
    },

    title: { type: String },


    group: { type: mongoose.Schema.Types.ObjectId },


    //isLike: { type: Boolean }



});
const MedicalPost = mongoose.model('MedicalPost', MedicalPostSchema);
module.exports = MedicalPost;