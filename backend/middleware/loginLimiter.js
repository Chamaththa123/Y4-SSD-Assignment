const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 5 login requests per windowMs
  message: 'Too many login attempts, please try again later.'
});

module.exports = {
    loginLimiter
}