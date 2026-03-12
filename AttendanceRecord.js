const mongoose = require('mongoose');

const attendanceRecordSchema = mongoose.Schema(
    {
        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'TeamMember',
        },
        name: { type: String, required: true },
        registerNumber: { type: String, required: true },
        section: { type: String, required: true },
        date: {
            type: String, // YYYY-MM-DD
            required: true,
        },
        day: { type: Number, required: true },
        month: { type: Number, required: true },
        year: { type: Number, required: true },
        periods: {
            p1: { type: String, enum: ['P', 'A'], default: 'A' },
            p2: { type: String, enum: ['P', 'A'], default: 'A' },
            p3: { type: String, enum: ['P', 'A'], default: 'A' },
            p4: { type: String, enum: ['P', 'A'], default: 'A' },
            p5: { type: String, enum: ['P', 'A'], default: 'A' },
            p6: { type: String, enum: ['P', 'A'], default: 'A' },
            p7: { type: String, enum: ['P', 'A'], default: 'A' },
            p8: { type: String, enum: ['P', 'A'], default: 'A' },
        },
        totalPresentPeriods: { type: Number, default: 0 },
        totalAbsentPeriods: { type: Number, default: 8 },
    },
    {
        timestamps: true,
    }
);

// Unique index for memberId + date to prevent duplicates
attendanceRecordSchema.index({ memberId: 1, date: 1 }, { unique: true });

// Pre-save hook to calculate totals
attendanceRecordSchema.pre('save', function (next) {
    const periods = this.periods;
    let present = 0;
    let absent = 0;

    for (let i = 1; i <= 8; i++) {
        if (periods[`p${i}`] === 'P') present++;
        else absent++;
    }

    this.totalPresentPeriods = present;
    this.totalAbsentPeriods = absent;
    next();
});

module.exports = mongoose.model('AttendanceRecord', attendanceRecordSchema);
