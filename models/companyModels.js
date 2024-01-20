const mongoose = require('mongoose');
const companySchema = new mongoose.Schema({
    id: { type: String },
    specialtiesId: { type: String },
    name: { type: String },
    imageUrl: { type: String },
    password: { type: String },
    email: { type: String },
    years: { type: Number },
    employees: { type: Number },
    NumberPost: { type: Number },
    rating: { type: Number },
});


const Company = mongoose.model('Company', companySchema);
module.exports = Company;


