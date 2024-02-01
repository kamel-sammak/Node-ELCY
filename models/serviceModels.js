const mongoose = require('mongoose');
const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter name !"]
    },
    imageUrl: {
        type: String,
        required: [true, "please enter imageUrl !"]
    },
});
const services = mongoose.model('service', serviceSchema);
module.exports = services;