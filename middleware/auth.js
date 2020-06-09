const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({err: "Authentication failure"});
    };
    //token validation
    try {
        const decoded = jwt.verify(token, jwtSecret);
        // because we returned id & token
        req.userID = decoded.id;
        next() ;
    } catch (error) {
        res.status(401).json({err: "Invalid request"});
    }
}

module.exports = auth;
