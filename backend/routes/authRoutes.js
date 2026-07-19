const express = require('express');
const router = express.Router();

//Importo le funzioni dal controller
const authController = require('../controllers/authController');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuovo utente (azienda o candidato)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [azienda, candidato]
 *     responses:
 *       201:
 *         description: Utente registrato con successo
 *       400:
 *         description: Errore nei dati inviati o email già registrata
 */
// POST, rotte per la registrazione
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autentica un utente e restituisce il token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login effettuato con successo
 *       401:
 *         description: Password errata
 *       404:
 *         description: Utente non trovato
 */
//POST, rotte per il login
router.post('/login', authController.login);

module.exports = router;