const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware');

const { authUser, registerUser, getUserProfile, updateUserProfile, getUsers, deleteUser, getUserById, updateUser, getUserStats } = require('../controllers/userController');
const { loginLimiter } = require('../middleware/loginLimiter');
const { authorizeRoles } = require('../middleware/authorizeRoles');

router.post('/', registerUser)
router.post('/login',loginLimiter, authUser)

router.get('/profile', protect, getUserProfile)
router.put('/profile', protect, updateUserProfile)

router.get('/',protect,authorizeRoles(1,3), getUsers)
router.get('/:id', protect, getUserById)
router.delete('/:id', protect, deleteUser)
router.put('/:id', protect, updateUser)
router.get('/stats', protect, getUserStats)

module.exports = router;