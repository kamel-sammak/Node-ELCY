const mongoose = require('mongoose');
const imageSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "please enter name !"]
    },
    image: {
        data: Buffer,
        contentType: String,
    }

});
const Image = mongoose.model('Image', imageSchema);
module.exports = Image