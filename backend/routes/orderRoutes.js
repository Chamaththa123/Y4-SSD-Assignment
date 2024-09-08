const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
	createOrder,
	getOrderById,
	updateOrder,
	getMyOrders,
	getOrders,
	deleteOrder,
	getMonthlyIncome,
	getYearlyIncome,
	getDailyOrderCount,
	getOrderStats,
	getProductIncome
} = require("../controllers/orderController");

// router.post("/", protect, createOrder);
router.get("/:id", protect, getOrderById);
router.get("/my/orders", protect, getMyOrders);

router.get('/', protect, getOrders)
router.put('/:id', protect, updateOrder)
router.delete('/:id', protect, deleteOrder)
router.get('/insights/montlyIncome', protect, getMonthlyIncome)
router.get('/insights/yearlyIncome', protect, getYearlyIncome)
router.get('/insights/dailyOrderCount', protect, getDailyOrderCount)
router.get('/insights/orderStats', protect, getOrderStats)
router.get('/insights/productIncome/:id', protect, getProductIncome)


module.exports = router;
