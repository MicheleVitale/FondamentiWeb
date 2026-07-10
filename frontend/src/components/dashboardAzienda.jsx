import { useState, useEffect } from "react";
import styles from "./dashboardAzienda.module.css";

function DashboardAzienda() {
    const emailAzienda = localStorage.getItem("email");         // recupera la informazioni dal browser al momento del login
    const ruoloUtente = localStorage.getItem("role");

    const [activeTab, setActiveTab] = useState("pubblica");         // gestisce la scheda visibile form/lista annunci
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        company: emailAzienda           // auto-assengna la l'email di chi è loggato
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [jobs, setJobs] = useState([]);           // contiene la lista degli annunci scaricati dal server
    const [candidature, setCandidature] = useState([]);

    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();           // ricarica la pagina, non essendoci più il token, App.js ci rimanda al login
    }

    const handleInputChange = (e) => {          // si attiva alla digitazione
        const {name, value} = e.target;

        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/jobs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`          // dimostra al server di avere i permessi
                },
                body: JSON.stringify(formData)
            });

            if (response.status === 400 || response.status === 401) {           // se il token è scaduto o l'utente non ha i permessi, forza il logout
                alert("La tua sessione è scaduta. Effettua di nuovo il login.");
                localStorage.clear();
                window.location.reload();
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Impossibile pubblicare l'annuncio.");
            }

            setMessage("Annuncio pubblicato con successo!");
            setFormData({title: "", description: "", company: emailAzienda});           // se la pubblicazione ha successo, svuota i campi e aggiorna la bacheca in background
            fetchMyJobs();
        }
        catch (err) {
            setError(err.message);
        }
    }

    const fetchMyJobs = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/jobs", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status === 400 || response.status === 401) {           // anche qui controlla se la sessione è ancora valida
                localStorage.clear();
                window.location.reload();
                return;
            }

            const data = await response.json();

            if (response.ok) {          // se la risposta è OK, salva gli annunci nello stato "jobs"
                setJobs(data);
            }
            else {
                setError(data.message || "Errore nel caricamento degli annunci.");
            }
        }
        catch (error) {
            setError("Impossibile connettersi al server per caricare gli annunci.");
        }
    }

    const fetchCandidature = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/jobs/company-jobs", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCandidature(data);
            }
        } catch (error) {
            console.error("Errore nel caricamento delle candidature:", error);
        }
    }

    const myJobs = jobs.filter(
        (job) => (job.company?.email || job.company) === emailAzienda
    );

    useEffect(() => {           // recupera il annunci dal server
        fetchMyJobs();
    }, []);         // avendo l'array vuoto [] esegue la funzione solo un volta quando la dashboard viene aperta

    useEffect(() => {
        if (activeTab === "candidature") {
            fetchCandidature();
        }
    }, [activeTab]);

    return (
        <div className={`win-window ${styles.window}`}>
            <div className={`win-title-bar ${styles.titleBar}`}>
                <span>Gestisci annunci aziendali e candidature, {emailAzienda.split('@')[0]}</span>
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
                <div className={styles.tabContainer}>
                    <button 
                        className={activeTab === "pubblica" ? styles.tabActive : styles.tab}
                        onClick={() => setActiveTab("pubblica")}
                    >
                        Nuovo Annuncio
                    </button>
                    <button 
                        className={activeTab === "bacheca" ? styles.tabActive : styles.tab}
                        onClick={() => setActiveTab("bacheca")}
                    >
                        Bacheca Annunci ({myJobs.length})
                    </button>
                    <button 
                        className={activeTab === "candidature" ? styles.tabActive : styles.tab}
                        onClick={() => setActiveTab("candidature")}
                    >
                        Candidature
                    </button>
                </div>

                <div className={styles.tabContentPanel}>
                    {activeTab === "pubblica" && (
                        <form onSubmit={handleSubmit}>
                            <span
                                className={styles.formNotice}
                            >
                                Inserire Titolo e Descrizione della posizione 
                            </span>

                            {message && <p className="form-success-msg">{message}</p>}
                            {error && <p className="form-error-msg">{error}</p>}

                            <div className={styles.formGroup}>
                                <label>Titolo della posizione: </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="win-input"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Descrizione: </label>
                                <textarea
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    className={`win-textarea ${styles.descriptionTextarea}`}
                                />
                            </div>

                            <div className={styles.formActions}>
                                <button
                                    type="submit"
                                    className="win-btn"
                                    style={{ minWidth: "100px" }}
                                >
                                    Pubblica Annuncio
                                </button>
                            </div>
                        </form>
                    )}

                    {activeTab === "bacheca" && (
                        <div className={styles.jobsListScrollable}>
                            {myJobs.length === 0 ? (
                                <p 
                                    className={styles.emptyMessage}
                                >
                                    Non hai pubblicato nessun annuncio.
                                </p>
                            ) : (
                                myJobs.map((job) => (
                                    <div
                                        key={job._id}
                                        className={styles.jobCard}
                                    >
                                        <h4>{job.title}</h4>
                                        <p>{job.description}</p>

                                        <div
                                            className={styles.jobAuthor}
                                        >
                                            Pubblicato da: {job.company?.email || job.company || "Dato non disponibile"}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === "candidature" && (
                        <div className={styles.jobsListScrollable}>
                            {candidature.length === 0 ? (
                                <p className={styles.emptyMessage}>
                                    Non hai ancora ricevuto candidature o pubblicato annunci.
                                </p>
                            ) : (
                                candidature.map((job) => (
                                    <div
                                        key={job._id}
                                        className={styles.jobCard}
                                    >
                                        <h4>{job.title}</h4>
                                        
                                        <div style={{ marginTop: "10px", fontSize: "14px" }}>
                                            <strong>Candidati ricevuti:</strong>
                                            {job.applicants && job.applicants.length > 0 ? (
                                                <ul style={{ paddingLeft: "20px", marginTop: "5px", marginBottom: "0" }}>
                                                    {job.applicants.map((candidato, index) => (
                                                        <li key={index}>{candidato.email}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p style={{ margin: "5px 0", fontStyle: "italic" }}>Nessun candidato, per ora...</p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className={`win-status-bar ${styles.statusBar}`}>
                <div className="win-status-field">Pronto</div>
                <div className="win-status-field">ID: {emailAzienda}</div>
                <div className="win-status-field">Ruolo: {ruoloUtente.toUpperCase()}</div>
            </div>
        </div>
    )
}

export default DashboardAzienda;