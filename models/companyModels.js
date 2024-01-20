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
    rating: [{

        1: { type: Boolean, required: true },
        2: { type: Boolean, required: true },
        3: { type: Boolean, required: true },
        4: { type: Boolean, required: true },
        5: { type: Boolean, required: true },
    }],
});


const Company = mongoose.model('Company', companySchema);
module.exports = Company;


