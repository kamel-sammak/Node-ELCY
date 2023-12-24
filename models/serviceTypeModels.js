const mongoose = require('mongoose');
const serviceTypeSchema = new mongoose.Schema({
    id: { type: String },
    categoryId: { type: String },
    companies: { type: String },
    imageUrl: { type: String },
    posts: [{
        id: { type: Number },
        content: { type: String },
        isLike: { type: Boolean }
    }]
});
const serviceType = mongoose.model('serviceType', serviceTypeSchema);
module.exports = serviceType;