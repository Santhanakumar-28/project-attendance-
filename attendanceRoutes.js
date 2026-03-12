const express = require('express');
const router = express.Router();
const { getAttendance, upsertAttendance, resetDayAttendance } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getAttendance);

router.route('/upsert')
    .put(protect, upsertAttendance);

router.route('/reset-day')
    .delete(protect, resetDayAttendance);

module.exports = router;
