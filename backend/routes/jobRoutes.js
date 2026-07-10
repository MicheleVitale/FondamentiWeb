const express = require('express');
const router = express.Router();

const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');
 
router.get('/', jobController.getAllJobs);

router.post('/', authMiddleware, jobController.createJob);



console.log("Contenuto di authMiddleware:", authMiddleware);
console.log("Contenuto di jobController:", jobController);


router.get('/company-jobs', authMiddleware, jobController.getCompanyJobs);


router.post('/:id/apply', authMiddleware, jobController.applyForJob);



module.exports = router;