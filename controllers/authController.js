const User = require('../models/User'); 
const bcrypt = require('bcrypt');       
const jwt = require('jsonwebtoken');    


// FUNZIONE DI REGISTRAZIONE 
exports.register = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Questa email è già registrata." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username: email, email,
            password: hashedPassword,
            role
        });

        await newUser.save();

        res.status(201).json({ message: "Utente registrato con successo!" });

    } catch (error) {
        res.status(500).json({ message: "Errore durante la registrazione: ", error });
    }
};



// FUNZIONE DI LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Utente non trovato." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Password errata." });
        }

        
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.status(200).json({ 
            message: "Login effettuato con successo!",
            token,
            user: { id: user._id, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error("ERRORE REALE SUL SERVER:", error);
        res.status(500).json({ message: "Errore durante il login: ", error });
    }
};


