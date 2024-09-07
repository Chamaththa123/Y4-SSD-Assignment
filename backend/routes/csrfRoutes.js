const express = require("express");
const router = express.Router();
const {
  csrfProtection,
  getCsrfToken,
} = require("../controllers/csrfController");

// Route to get CSRF token
router.get("/", csrfProtection, getCsrfToken);

module.exports = router;
