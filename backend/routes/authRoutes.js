const express = require('express');
const router = express.Router();



//Importo le funzioni dal controller
const authController = require('../controllers/authController');

// POST, rotte per la registrazione
router.post('/register', authController.register);

//POST, rotte per il login
router.post('/login', authController.login);


module.exports = router;

