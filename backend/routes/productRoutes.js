const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware');

const {getProducts, getProductById, addProduct, updateProduct, deleteProduct, getProductCountByCategory, getProductStats} = require('../controllers/productController')


router.get('/', getProducts)
router.get('/:id', getProductById)

router.post('/', protect, addProduct)
router.delete('/:id', protect, deleteProduct)
router.put('/:id', protect, updateProduct)
router.get('/insights/productCount', protect, getProductCountByCategory)
router.get('/insights/productStats', protect, getProductStats)

module.exports = router;