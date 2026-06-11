const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: "Accesso negato. Nessun token fornito." });
    }

    try {
        const cleanToken = token.replace('Bearer ', ''); //Bearer è il formato del token

        const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
        req.user = decoded;

        next(); // Porto al controller

    } catch (error) {
        res.status(400).json({ message: "Token non valido o scaduto." });
    }
};