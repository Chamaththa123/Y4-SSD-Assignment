const express = require("express");
const {
	getSingleSupplier,
    getSingleSupplierMongo,
    getAllSuppliers,
    updateSingleSupplier,
    deleteSingleSupplier,
    registerSupplier
} = require("../controllers/supplierController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/authorizeRoles");

const router = express.Router();

// get all the suppliers from the database
router.get("/",protect,authorizeRoles(1,3), getAllSuppliers);

// get a single supplier from the database
router.get("/:id",protect,authorizeRoles(1,3), getSingleSupplier);

// register a suppleir
router.post("/",protect,authorizeRoles(1,3), registerSupplier);

//update a single item
router.put("/:id",protect,authorizeRoles(1,3), updateSingleSupplier);

// delete a single item
router.delete("/:id",protect,authorizeRoles(1,3), deleteSingleSupplier);

// get single item from mongID
router.get("/mongo/:id",protect,authorizeRoles(1,3),getSingleSupplierMongo)

// exporting the express router

module.exports = router;
