// Middleware to authorize users based on roles
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        console.log(req.user)
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, no user found' });
        }

        // Check if the user's role is one of the allowed roles
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Access denied for role: ${req.user.role}` });
        }

        // Proceed to the next middleware if the user has the right role
        next();
    };
};

module.exports = { authorizeRoles };
