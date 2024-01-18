const mongoose = require('mongoose');
const MedicalCategorySchema = new mongoose.Schema({
    id: { type: String },
    serviceId: { type: String },
    name: { type: String },
    imageUrl: { type: String },
    group: [{
        id: { type: Number },
        name: { type: String },
        imageUrl: { type: String },
        email: { type: String },
        password: { type: String }
    }]
});
const MedicalCategory = mongoose.model('MedicalCategory', MedicalCategorySchema);
module.exports = MedicalCategory;