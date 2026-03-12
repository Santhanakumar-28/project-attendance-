const TeamMemberQueries = require('../models/teamMemberQueries');

// @desc    Get all members
// @route   GET /api/members
// @access  Private
const getMembers = async (req, res) => {
    try {
        const members = await TeamMemberQueries.findAll();
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a member
// @route   POST /api/members
// @access  Private
const addMember = async (req, res) => {
    try {
        const { name, registerNumber, section, email, phone, role } = req.body;

        if (!name || !registerNumber || !section) {
            return res.status(400).json({ message: 'Name, Reg No, and Section are mandatory' });
        }

        const memberExists = await TeamMemberQueries.findByRegisterNumber(registerNumber);
        if (memberExists) {
            return res.status(400).json({ message: 'Member already exists with this Register Number' });
        }

        const member = await TeamMemberQueries.create({
            name,
            registerNumber,
            section,
            email,
            phone,
            role,
        });

        res.status(201).json(member);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a member
// @route   PUT /api/members/:id
// @access  Private
const updateMember = async (req, res) => {
    try {
        const member = await TeamMemberQueries.findById(req.params.id);

        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        await TeamMemberQueries.update(req.params.id, req.body);

        const updatedMember = await TeamMemberQueries.findById(req.params.id);
        res.status(200).json(updatedMember);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a member
// @route   DELETE /api/members/:id
// @access  Private
const deleteMember = async (req, res) => {
    try {
        const member = await TeamMemberQueries.findById(req.params.id);

        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        await TeamMemberQueries.delete(req.params.id);
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMembers,
    addMember,
    updateMember,
    deleteMember,
};
