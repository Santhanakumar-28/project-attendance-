const express = require('express');
const router = express.Router();
const { getMembers, addMember, updateMember, deleteMember } = require('../controllers/memberController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getMembers)
    .post(protect, addMember);

router.route('/:id')
    .put(protect, updateMember)
    .delete(protect, deleteMember);

module.exports = router;
