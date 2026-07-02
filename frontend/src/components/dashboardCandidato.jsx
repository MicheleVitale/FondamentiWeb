import { useState, useEffect } from "react";
import styles from "./dashboardCandidato.module.css";

function DashboardCandidato() {
    const emailUtente = localStorage.getItem("email");          // recupera la informazioni dal browser al momento del login
    const ruoloUtente = localStorage.getItem("role");

    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState("");
    const [selectedJob, setSelectedJob] = useState(null);           // tiene traccia dell'annuncio su cui l'utente ha cliccato

    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();           // ricarica la pagina, non essendoci più il token, App.js ci rimanda al login
    }

    const fetchAllJobs = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/jobs", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`          // dimostra al server di avere i permessi
                }
            });

            if (response.status === 400 || response.status === 401) {           // se il token è scaduto o l'utente non ha i permessi, forza il logout
                localStorage.clear();
                window.location.reload();
                return;
            }

            const data = await response.json();

            if (response.ok) {          // se la risposta è OK, salva gli annunci nello stato "jobs", se ci sono annunci seleziona il primo
                setJobs(data);
                if (data.length > 0) {
                    setSelectedJob(data[0]);
                }
            }
            else {
                setError(data.message || "Errore nel caricamento della bacheca.");
            }
        }
        catch (error) {
            setError("Impossibile connettersi al server per caricare gli annunci.");
        }
    }

    useEffect(() => {           // recupera il annunci dal server
        fetchAllJobs();
    }, []);         // avendo l'array vuoto [] esegue la funzione solo un volta quando la dashboard viene aperta

    return (
        <div className={`win-window ${styles.window}`}>

            <div className={`win-title-bar ${styles.titleBar}`}>
                <span>Esplora annunci di lavoro</span>
                <button onClick={handleLogout}
                    className="win-btn"
                    style={{ fontSize: "11px", padding: "0 6px", fontWeight: "bold" }}
                >
                    X
                </button>
            </div>

            <div className="win-menu-bar">
                <span className="win-menu-item">File</span>
                <span className="win-menu-item">Opzioni</span>
                <span className="win-menu-item">?</span>
            </div>

            <div className={styles.windowBody}>

                {error && <p className="form-error-msg">{error}</p>}

                <div className={styles.mainLayout}>
                    
                    <div className={styles.leftColumn}>
                        <span className={styles.sectionTitle}>Selezionare una posizione:</span>

                        <div className={styles.listBox}>
                            {jobs.length === 0 ? (
                                <p className={styles.emptyText}>Nessun annuncio disponibile.</p>
                            ) : (
                                jobs.map((job) => (
                                    <div
                                        key={job._id}
                                        className={`${styles.listBoxItem} ${selectedJob?._id === job._id ? styles.itemSelected : ""}`}
                                        onClick={() => setSelectedJob(job)}
                                    >
                                        {job.title}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className={styles.rightColumn}>
                        <span className={styles.sectionTitle}>Dettagli record selezionato:</span>

                        <div className={styles.detailsPanel}>
                            {selectedJob ? (
                                <div className={styles.detailsContent}>
                                    <h3 className={styles.jobTitle}>{selectedJob.title}</h3>
                                    <div className={styles.metaInfo}>
                                        Pubblicato da: {selectedJob.company?.email || selectedJob.company || "Anonima"}
                                    </div>

                                    <div className={styles.descriptionBox}>
                                        {selectedJob.description}
                                    </div>

                                    <div className={styles.actionContainer}>
                                        <button
                                            className="win-btn"
                                            style={{ minWidth: "140px" }}
                                            onClick={() => alert("Candidatura inviata con successo!")}
                                        >
                                            Invia Candidatura
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className={styles.emptyText}>Selezionare un annuncio dalla lista per consultare i dati.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            <div className={`win-status-bar ${styles.statusBar}`}>
                <div className="win-status-field">Pronto</div>
                <div className="win-status-field">Utente: {emailUtente}</div>
                <div className="win-status-field">Ruolo: {ruoloUtente.toUpperCase()}</div>
            </div>

        </div>
    );
}

export default DashboardCandidato;