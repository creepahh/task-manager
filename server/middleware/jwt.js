const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. Token was not provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify 
        req.user = decoded; // Attach the decoded token payload to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Access denied. Token has expired.' });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Access denied. Invalid token.' });
        }
        return res.status(500).json({ message: 'An error occurred while verifying the token.' });
    }
};

module.exports = verifyToken;