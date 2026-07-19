const express = require('express');
const router = express.Router();

const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');
 
/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Restituisce la lista di tutti gli annunci di lavoro
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: Lista degli annunci recuperata con successo
 */
router.get('/', jobController.getAllJobs);

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Crea un nuovo annuncio di lavoro (Solo Azienda)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Annuncio creato con successo
 *       401:
 *         description: Token mancante o non valido
 *       403:
 *         description: Accesso negato (L'utente non è un'azienda)
 */
router.post('/', authMiddleware, jobController.createJob);

console.log("Contenuto di authMiddleware:", authMiddleware);
console.log("Contenuto di jobController:", jobController);

/**
 * @swagger
 * /api/jobs/company-jobs:
 *   get:
 *     summary: Restituisce gli annunci pubblicati dall'azienda attualmente loggata
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista delle candidature recuperata con successo
 *       401:
 *         description: Token mancante o ID utente mancante
 */
router.get('/company-jobs', authMiddleware, jobController.getCompanyJobs);

/**
 * @swagger
 * /api/jobs/{id}/apply:
 *   post:
 *     summary: Invia la candidatura per un annuncio (Solo Candidato)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID dell'annuncio
 *     responses:
 *       200:
 *         description: Candidatura inviata con successo
 *       400:
 *         description: L'utente si è già candidato
 *       401:
 *         description: Token mancante o non valido
 *       403:
 *         description: Solo i candidati possono inviare candidature
 *       404:
 *         description: Annuncio non trovato
 */
router.post('/:id/apply', authMiddleware, jobController.applyForJob);

module.exports = router;