const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    id: { type: String },
    serviceId: { type: String },
    name: { type: String },
    imageUrl: { type: String },
    specialties: [{
        id: { type: Number },
        name: { type: String },
        imageUrl: { type: String },
        company: [{
            id: { type: Number },
            name: { type: String },
            imageUrl: { type: String },

        }]
    }]
});
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;