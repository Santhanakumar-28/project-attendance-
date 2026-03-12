const AttendanceQueries = require('../models/attendanceQueries');
const TeamMemberQueries = require('../models/teamMemberQueries');

// @desc    Get attendance for a specific date
// @route   GET /api/attendance
// @access  Private
const getAttendance = async (req, res) => {
    try {
        const { year, month, date } = req.query;
        const query = {};
        if (year) query.year = Number(year);
        if (month) query.month = Number(month);
        if (date) query.date = date;

        const attendance = await AttendanceQueries.find(query);
        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upsert attendance (Mark P/A)
// @route   PUT /api/attendance/upsert
// @access  Private
const upsertAttendance = async (req, res) => {
    try {
        const { memberId, date, periods } = req.body;

        if (!memberId || !date || !periods) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const member = await TeamMemberQueries.findById(memberId);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        await AttendanceQueries.upsert(memberId, date, periods, member);

        const updated = await AttendanceQueries.find({ date })[0]; // Get the updated record
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset attendance for a day
// @route   DELETE /api/attendance/reset-day
// @access  Private
const resetDayAttendance = async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) return res.status(400).json({ message: 'Date is required' });

        await AttendanceQueries.deleteByDate(date);
        res.status(200).json({ message: `Attendance reset for ${date}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAttendance,
    upsertAttendance,
    resetDayAttendance,
};
