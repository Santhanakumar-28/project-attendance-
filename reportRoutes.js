const express = require('express');
const router = express.Router();
const { getDailyReport, exportDailyPDF, exportDailyCSV, getRangeReport, exportRangePDF, exportRangeCSV } = require('../controllers/reportController');
// const { protect } = require('../middleware/authMiddleware');

router.get('/daily-present', getDailyReport);
router.get('/daily-present/pdf', exportDailyPDF);
router.get('/daily-present/csv', exportDailyCSV);

router.get('/range-present', getRangeReport);
router.get('/range-present/pdf', exportRangePDF);
router.get('/range-present/csv', exportRangeCSV);

module.exports = router;
