const mongoose = require('mongoose');
const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter name !"]
    },
    specialtiesId: {
        type: String,
        required: [true, "please enter specialtiesId !"]
    },
    imageUrl: {
        type: String,
        required: [true, "please enter imageUrl !"]
    },
    password: {
        type: String,
        required: [true, "please enter password !"]
    },
    email: {
        type: String,
        required: [true, "please enter email !"]
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
});


const Company = mongoose.model('Company', companySchema);
module.exports = Company;


