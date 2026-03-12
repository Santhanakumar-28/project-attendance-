const mongoose = require('mongoose');

const teamMemberSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add student name'],
        },
        registerNumber: {
            type: String,
            required: [true, 'Please add register number'],
            unique: true,
        },
        section: {
            type: String,
            required: [true, 'Please add section'],
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
        },
        role: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('TeamMember', teamMemberSchema);
