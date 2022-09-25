const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    position: {
        type: String,
        required: [true, 'Please provide position'],
        trim: true
    },
    company: {
        type: String,
        required: [true, 'Please provide company name'],
        trim: true
    },
    jobLocation: {
        type: String,
        trim: true,
        default: 'my city'
    },
    status: {
        type: String,
        enum: ['pending', 'interview', 'declined'],
        default: 'pending'
    },
    jobType: {
        type: String,
        enum: ['full time', 'part time', 'internship', 'remote'],
        default: 'full time'
    },
    createdBy: {
        ref: 'User',
        type: mongoose.Types.ObjectId,
        required: [true, 'Please provide user']
    }

}, {timestamps: true});

module.exports = mongoose.model('Job', JobSchema);