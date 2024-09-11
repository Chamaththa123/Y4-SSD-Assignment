const asyncHandler = require('express-async-handler');
const Staff = require('../models/staffModel');
const { body, query, param, validationResult } = require('express-validator');

// @desc    Fetch all staff members
// @route   GET /api/staffmembers
// @access  Private/Admin
const getStaff = asyncHandler(async (req, res) => {
  const qSearch = req.query.search ? req.query.search.trim() : null;

  // Use parameterized queries to prevent injection
  let staffs;
  if (qSearch) {
    // Safe parameterized query using text search
    staffs = await Staff.find({
      $text: { $search: qSearch }  // This query is safe and parameterized
    });
  } else {
    // Safe query to get all staff members
    staffs = await Staff.find();  // This is a parameterized query
  }

  res.status(200).json(staffs);
});

// @desc    Fetch a staff member by ID
// @route   GET /api/staffmembers/:id
// @access  Private
const getStaffById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Input validation for ObjectId (this ensures the input is properly sanitized)
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error('Invalid staff ID format');
  }

  // Safe parameterized query to find staff by ID
  const staff = await Staff.findById(id);  // This is a parameterized query
  if (staff) {
    res.status(200).json(staff);
  } else {
    res.status(404);
    throw new Error('Staff member not found');
  }
});

// @desc    Create staff member
// @route   POST /api/staffmembers
// @access  Private
const addStaff = [
  // Validate the incoming data using express-validator
  body('firstName').not().isEmpty().withMessage('First name is required').trim(),
  body('lastName').not().isEmpty().withMessage('Last name is required').trim(),
  body('email').isEmail().withMessage('Email is invalid').trim().normalizeEmail(),

  // Handle the request
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      firstName,
      lastName,
      address,
      nic,
      contactNo,
      dob,
      email,
      department,
      designation,
      joinedDate,
      salary,
      simage
    } = req.body;

    // Create a new staff document using sanitized and validated inputs
    const staff = new Staff({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      address: address?.trim(),
      nic: nic?.trim(),
      contactNo: contactNo?.trim(),
      dob: new Date(dob),
      email: email.toLowerCase().trim(),
      department,
      designation,
      joinedDate: new Date(joinedDate),
      salary: parseFloat(salary),
      simage: simage?.trim()
    });

    // Safe parameterized query to save staff
    const savedStaff = await staff.save();  // Parameterized query
    res.status(200).json(savedStaff);
  })
];

// @desc    Update staff member
// @route   PUT /api/staffmembers/:id
// @access  Private
const updateStaff = [
  // Validate staff ID and incoming data
  param('id').isMongoId().withMessage('Invalid staff ID format'),
  body('email').optional().isEmail().withMessage('Invalid email format'),

  // Handle the request
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Safe parameterized query to find staff by ID
    const staff = await Staff.findById(id);
    if (staff) {
      const updatedFields = {
        firstName: req.body.firstName?.trim(),
        lastName: req.body.lastName?.trim(),
        address: req.body.address?.trim(),
        nic: req.body.nic?.trim(),
        contactNo: req.body.contactNo?.trim(),
        dob: req.body.dob ? new Date(req.body.dob) : staff.dob,
        email: req.body.email?.toLowerCase().trim(),
        department: req.body.department,
        designation: req.body.designation,
        joinedDate: req.body.joinedDate ? new Date(req.body.joinedDate) : staff.joinedDate,
        salary: req.body.salary ? parseFloat(req.body.salary) : staff.salary,
        simage: req.body.simage?.trim()
      };

      // Safe parameterized query to update staff
      const updatedStaff = await Staff.findByIdAndUpdate(id, { $set: updatedFields }, { 
        new: true,
        runValidators: true  // Ensure validations are applied
      });

      res.status(200).json(updatedStaff);
    } else {
      res.status(404);
      throw new Error('Staff member not found');
    }
  })
];

// @desc    Delete staff member
// @route   DELETE /api/staffmembers/:id
// @access  Private
const deleteStaff = [
  // Validate staff ID format
  param('id').isMongoId().withMessage('Invalid staff ID format'),

  // Handle the request
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Safe parameterized query to find staff by ID
    const staff = await Staff.findById(id);
    if (staff) {
      // Safe parameterized query to delete staff
      await staff.deleteOne();  // Parameterized query
      res.status(200).json({ message: 'Staff member removed' });
    } else {
      res.status(404);
      throw new Error('Staff member not found');
    }
  })
];

module.exports = { getStaff, getStaffById, addStaff, updateStaff, deleteStaff };
