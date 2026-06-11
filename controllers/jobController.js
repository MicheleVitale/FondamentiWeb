const Job = require('../models/Job');

// FUNZIONE PER CREARE L'ANNUNCIO
exports.createJob = async (req, res) => {
    try {
        if (req.user.role !== 'azienda') {
            return res.status(403).json({ message: "Solo le aziende possono pubblicare annunci." });
        }

        const { title, description } = req.body;

        const newJob = new Job({
            title,
            description,
            company: req.user.id 
        });

        await newJob.save();
        
        res.status(201).json({ message: "Annuncio creato con successo!", job: newJob });

    } catch (error) {
        res.status(500).json({ message: "Errore nella creazione dell'annuncio: ", error });
    }
};

// FUNZIONE PER VEDERE TUTTI GLI ANNUNCI 
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('company', 'email role');
        
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Errore nel recupero degli annunci: ", error });
    }
};