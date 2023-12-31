const mongoose = require('mongoose');
const companySchema = new mongoose.Schema({
    id: { type: String },
    specialtiesId: { type: String },
    name: { type: String },
    imageUrl: { type: String },
    company: [{
        id: { type: Number },
        name: { type: String }
    }]
});
//عدد سنوات اكثر يتم ترتبيها(queue)
//عداد على الطلبات

const Company = mongoose.model('Company', companySchema);
module.exports = Company;