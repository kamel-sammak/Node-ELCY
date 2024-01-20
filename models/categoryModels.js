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
            rating: [{

                1: { type: Boolean, required: true },
                2: { type: Boolean, required: true },
                3: { type: Boolean, required: true },
                4: { type: Boolean, required: true },
                5: { type: Boolean, required: true },
            }],

        }]
    }]
});
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;