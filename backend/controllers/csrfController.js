const csrf = require("csurf");

// Initialize CSRF protection middleware
const csrfProtection = csrf({ cookie: true });

// Function to get and send CSRF token to the client
const getCsrfToken = (req, res) => {
  // Send the CSRF token to the client
  res.json({ csrfToken: req.csrfToken() });
};

module.exports = {
  csrfProtection,
  getCsrfToken,
};
