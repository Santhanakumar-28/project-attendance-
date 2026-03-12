const AttendanceQueries = require('../models/attendanceQueries');
const TeamMemberQueries = require('../models/teamMemberQueries');

// @desc    Get dashboard summary
const getSummary = async (req, res) => {
    try {
        const totalMembers = await TeamMemberQueries.count();

        const today = new Date().toISOString().split('T')[0];
        const todayAttendance = await AttendanceQueries.findByDate(today);

        const presentToday = todayAttendance.filter(a => a.totalPresentPeriods > 0).length;
        const absentToday = totalMembers - presentToday;

        res.status(200).json({
            totalMembers,
            presentToday,
            absentToday,
            avgAttendance: 0 // Placeholder
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSummary
};
