const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: [true, "please enter user firstName !"]
    },
    lastName: {
        type: String,
        required: [true, "please enter user lastName !"]
    },
    gender: {
        type: String,
        required: [true, "please enter gender !"]
    },
    phoneNumber: {
        type: String,
        required: [true, "please enter phoneNumber !"]
    },
    password: {
        type: String,
        required: [true, "please enter password !"]
    },
    email: {
        type: String,
        required: [true, "please enter email !"]
    },

});
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;