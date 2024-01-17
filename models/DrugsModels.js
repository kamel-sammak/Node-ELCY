const mongoose = require('mongoose');
const DrugsSchema = new mongoose.Schema({

    name: { type: String },
    imageUrl: { type: String },
    group: { type: mongoose.Schema.Types.ObjectId },
});
const Drugs = mongoose.model('Drugs', DrugsSchema);
module.exports = Drugs;