const express = require('express');
const router = express.Router();


const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');
 
router.get('/', jobController.getAllJobs);

router.post('/', authMiddleware, jobController.createJob); //In questo caso aggiungo il middleware perche non tutti possono creare annunci




module.exports = router;