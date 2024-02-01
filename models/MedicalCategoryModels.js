const mongoose = require('mongoose');
const MedicalCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter name !"]
    },
    serviceId: {
        type: String,
        required: [true, "please enter serviceId !"]
    },
    imageUrl: {
        type: String,
        required: [true, "please enter imageUrl !"]
    },
    group: [{
        name: {
            type: String,
            required: [true, "please enter name !"]
        },
        imageUrl: {
            type: String,
            required: [true, "please enter imageUrl !"]
        },
        email: {
            type: String,
            required: [true, "please enter email !"]
        },
        password: {
            type: String,
            required: [true, "please enter password !"]
        }
    }]
});
const MedicalCategory = mongoose.model('MedicalCategory', MedicalCategorySchema);
module.exports = MedicalCategory;