const Job = require('../models/Job');

// FUNZIONE PER CREARE L'ANNUNCIO
exports.createJob = async (req, res) => {
    try {
        // SCUDO ANTI-CRASH: controlla se req.user esiste prima di leggere l'ID
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Errore di sicurezza: ID utente mancante. Riprova il login." });
        }

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
        console.error("Errore nella creazione dell'annuncio:", error);
        res.status(500).json({ message: "Errore interno nella creazione dell'annuncio.", error });
    }
};

// FUNZIONE PER VEDERE TUTTI GLI ANNUNCI 
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('company', 'email role');
        
        res.status(200).json(jobs);
    } catch (error) {
        console.error("Errore nel recupero degli annunci:", error);
        res.status(500).json({ message: "Errore nel recupero degli annunci: ", error });
    }
};

// FUNZIONE PER VEDERE I PROPRI ANNUNCI E LE CANDIDATURE (Solo Aziende)
exports.getCompanyJobs = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Errore di sicurezza: ID utente mancante." });
        }

        // Cerca i lavori dove l'azienda creatrice è quella che sta facendo la richiesta
        // ".populate" serve a popolare con i lavori
        const jobs = await Job.find({ company: req.user.id }).populate('applicants', 'email');
        
        res.status(200).json(jobs);
    } catch (error) {
        console.error("Errore nel recupero delle candidature:", error);
        res.status(500).json({ message: "Errore nel recupero delle candidature: ", error });
    }
};



// FUNZIONE PER INVIARE LA CANDIDATURA (Solo Candidati)
exports.applyForJob = async (req, res) => {
    try {
        // Anti crash per apply. Serve a validare l'user
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Errore di sicurezza: ID utente mancante." });
        }

        if (req.user.role !== 'candidato') {
            return res.status(403).json({ message: "Solo i candidati possono inviare candidature." });
        }

        const jobId = req.params.id; // Prendo l'ID di chi ha pubblicato l'annuncio
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ message: "Annuncio non trovato." });
        }

        // Controlla se l'utente si è già candidato a questo annuncio
        if (job.applicants.includes(req.user.id)) {
            return res.status(400).json({ message: "Ti sei già candidato per questo annuncio." });
        }

        // Aggiunge l'ID del candidato e salva nel database
        job.applicants.push(req.user.id);
        await job.save();

        res.status(200).json({ message: "Candidatura inviata con successo!" });
    } catch (error) {
        console.error("Errore nell'invio della candidatura:", error);
        res.status(500).json({ message: "Errore interno durante la candidatura.", error });
    }
};