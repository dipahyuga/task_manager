const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak, tidak ada token' });
    }

    try {
        const tokenOnly = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
        const verified = jwt.verify(tokenOnly, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Token tidak valid '});
    }
};

module.exports = verifyToken;