const express = require('express');
const router = express.Router();
const { getSummary } = require('../controllers/statsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getSummary);

module.exports = router;
