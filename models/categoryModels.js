const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
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
    specialties: [{
        name: {
            type: String,
            required: [true, "please enter name !"]
        },
        imageUrl: {
            type: String,
            required: [true, "please enter imageUrl !"]
        },
        company: [{
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
            },
            years: {
                type: Number,
                required: [false, "please enter years !"]
            },
            employees: {
                type: Number,
                required: [false, "please enter employees !"]
            },
            NumberPost: {
                type: Number,
            },
            rating: {
                type: Number,
                required: [false, "please enter rating !"]
            },
        }]
    }]
});
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;