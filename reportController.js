const AttendanceQueries = require('../models/attendanceQueries');
const { jsPDF } = require('jspdf');
require('jspdf-autotable');
const { Parser } = require('json2csv');

// Helper to get present students for a date
const getPresentStudentsData = async (date) => {
    return await AttendanceQueries.findPresentByDate(date);
};

// Helper for range
const getPresentByDateRangeData = async (fromDate, toDate) => {
    return await AttendanceQueries.findPresentByDateRange(fromDate, toDate);
};

// Validate date range
const validateDateRange = (from, to) => {
    const today = new Date().toISOString().split('T')[0];
    if (!from || !to) throw new Error('Both from_date and to_date are required');
    if (from > to) throw new Error('from_date must be before or equal to to_date');
    if (to > today) throw new Error('to_date cannot be in the future');
};

// @desc    Get daily present report (JSON)
// @route   GET /api/reports/daily-present
const getDailyReport = async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) return res.status(400).json({ message: 'Date is required' });

        const data = await getPresentStudentsData(date);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get range present report (JSON)
// @route   GET /api/reports/range-present
const getRangeReport = async (req, res) => {
    try {
        const { from_date: from, to_date: to } = req.query;
        validateDateRange(from, to);

        const data = await getPresentByDateRangeData(from, to);
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Export daily report as PDF
// @route   GET /api/reports/daily-present/pdf
const exportDailyPDF = async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) return res.status(400).json({ message: 'Date is required' });
        const data = await getPresentStudentsData(date);

        const doc = new jsPDF();
        doc.text(`Daily Attendance Report - ${date}`, 14, 15);

        const tableRows = data.map(record => [
            record.name,
            record.registerNumber,
            record.section,
            record.p1, record.p2, record.p3, record.p4,
            record.p5, record.p6, record.p7, record.p8,
            record.totalPresentPeriods
        ]);

        doc.autoTable({
            startY: 20,
            head: [['Name', 'Reg No', 'Sec', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'Total']],
            body: tableRows,
        });

        const pdfBuffer = doc.output('arraybuffer');
        res.set('Content-Type', 'application/pdf');
        res.set('Content-Disposition', `attachment; filename=attendance_daily_${date}.pdf`);
        res.send(Buffer.from(pdfBuffer));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Export range report as PDF
// @route   GET /api/reports/range-present/pdf
const exportRangePDF = async (req, res) => {
    try {
        const { from_date: from, to_date: to } = req.query;
        validateDateRange(from, to);
        const data = await getPresentByDateRangeData(from, to);

        const doc = new jsPDF();
        doc.text(`Attendance Report (${from} to ${to})`, 14, 15);
        doc.text(`Total Students Present: ${data.length}`, 14, 25);

        const tableRows = data.map(record => [
            record.name,
            record.registerNumber,
            record.section,
            record.daysPresent,
            record.totalPeriods
        ]);

        doc.autoTable({
            startY: 35,
            head: [['Name', 'Reg No', 'Sec', 'Days Present', 'Total Periods']],
            body: tableRows,
        });

        const pdfBuffer = doc.output('arraybuffer');
        res.set('Content-Type', 'application/pdf');
        res.set('Content-Disposition', `attachment; filename=attendance_range_${from}_to_${to}.pdf`);
        res.send(Buffer.from(pdfBuffer));
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Export daily report as CSV
// @route   GET /api/reports/daily-present/csv
const exportDailyCSV = async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) return res.status(400).json({ message: 'Date is required' });
        const data = await getPresentStudentsData(date);

        const fields = ['name', 'registerNumber', 'section', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'totalPresentPeriods'];
        const json2csv = new Parser({ fields });
        const csv = json2csv.parse(data);

        res.header('Content-Type', 'text/csv');
        res.attachment(`attendance_${date}.csv`);
        res.send(csv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Export range report as CSV
// @route   GET /api/reports/range-present/csv
const exportRangeCSV = async (req, res) => {
    try {
        const { from_date: from, to_date: to } = req.query;
        validateDateRange(from, to);
        const data = await getPresentByDateRangeData(from, to);

        const fields = ['name', 'registerNumber', 'section', 'daysPresent', 'totalPeriods'];
        const json2csv = new Parser({ fields });
        const csv = json2csv.parse(data);

        res.header('Content-Type', 'text/csv');
        res.attachment(`attendance_range_${from}_to_${to}.csv`);
        res.send(csv);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getDailyReport,
    exportDailyPDF,
    exportDailyCSV,
    getRangeReport,
    exportRangePDF,
    exportRangeCSV
};
