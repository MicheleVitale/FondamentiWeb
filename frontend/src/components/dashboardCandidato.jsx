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

// Implementazione delle candidature al server SS
    const handleApply = async () => {
        if (!selectedJob) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:3000/api/jobs/${selectedJob._id}/apply`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            if (response.ok) {
                alert("Candidatura inviata con successo!");
            } else {
                alert(data.message || "Errore durante l'invio della candidatura.");
            }
        } catch (error) {
            console.error("Errore di rete:", error);
            alert("Impossibile connettersi al server.");
        }
    }

















    useEffect(() => {           // recupera il annunci dal server
        fetchAllJobs();
    }, []);         // avendo l'array vuoto [] esegue la funzione solo un volta quando la dashboard viene aperta

    return (
        <div className={`win-window ${styles.window}`}>
            <div className={`win-title-bar ${styles.titleBar}`}>
                <span>Esplora gli annunci di lavoro presenti in Jobby, {emailUtente.split('@')[0]}</span>
                <button
                    onClick={handleLogout}
                    className="win-btn"
                    style={{ fontWeight: "bold", fontSize: "11px", padding: "0 6px" }}
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
                <div className={styles.mainLayout}>
                    
                    {/* COLONNA SINISTRA: LISTA ANNUNCI */}
                    <div className={styles.leftColumn}>
                        <div className={styles.sectionTitle}>Selezionare una posizione:</div>
                        <div className={styles.listBox}>
                            {jobs.map((job) => (
                                <div
                                    key={job._id}
                                    className={`${styles.listBoxItem} ${selectedJob?._id === job._id ? styles.itemSelected : ""}`}
                                    onClick={() => setSelectedJob(job)}
                                >
                                    {job.title}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* COLONNA DESTRA: DETTAGLIO E PULSANTE */}
                    <div className={styles.rightColumn}>
                        <div className={styles.sectionTitle}>Dettagli record selezionato:</div>
                        <div className={styles.detailsPanel}>
                            {selectedJob ? (
                                    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "4px 10px" }}>                                    <div className={styles.detailsHeader}>
                                        <h2>{selectedJob.title}</h2>
                                        <span>Pubblicato da: {selectedJob.company?.email || selectedJob.company || "Anonima"}</span>
                                    </div>

                                    <div className={styles.descriptionBox}>
                                        {selectedJob.description}
                                    </div>

                                    <div className={styles.actionContainer}>
                                        <button
                                            className="win-btn"
                                            style={{ minWidth: "140px" }}
                                            onClick={handleApply}  
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










