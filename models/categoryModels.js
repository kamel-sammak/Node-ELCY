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
            email: { type: String },
            password: { type: String },
            years: { type: Number },
            employees: { type: Number },
            NumberPost: { type: Number },
            rating: { type: Number },
        }]
    }]
});
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;