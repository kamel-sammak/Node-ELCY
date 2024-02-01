const mongoose = require('mongoose');
const DrugsSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "please enter name !"]
    },
    imageUrl: {
        type: String,
        required: [true, "please enter imageUrl !"]
    },
    group: { type: mongoose.Schema.Types.ObjectId },
});
const Drugs = mongoose.model('Drugs', DrugsSchema);
module.exports = Drugs;