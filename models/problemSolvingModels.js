const mongoose = require('mongoose');
const problemSolvingSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'resolved'],
        default: 'open',
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        required: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    EditedByAdminAt: {
        type: Date,
        default: Date.now,
    },
    comments: [
        {
            text: String,
            createdBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'admin',
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
});

const ProblemSolving = mongoose.model('ProblemSolving', problemSolvingSchema);
module.exports = ProblemSolving;
