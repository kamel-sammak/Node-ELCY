const mongoose = require('mongoose');
const serviceSchema = new mongoose.Schema({
    id: { type: String },
    name: { type: String },
    imageUrl: { type: String },
});
const services = mongoose.model('service', serviceSchema);
module.exports = services;