const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware');

const {getCarts, getMyCart, createCart, updateCart, deleteCart} = require('../controllers/cartController')


router.post('/', protect, createCart)
router.get('/find/:userId', protect, getMyCart)
router.delete('/:id', protect, deleteCart)
router.put('/:id', protect, updateCart)

router.get('/', protect, getCarts)


module.exports = router;