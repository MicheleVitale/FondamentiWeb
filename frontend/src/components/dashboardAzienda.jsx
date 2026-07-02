import { useState, useEffect } from "react";
import styles from "./dashboardAzienda.module.css";

function DashboardAzienda() {
    const emailAzienda = localStorage.getItem("email");
    const ruoloUtente = localStorage.getItem("role");
    const [activeTab, setActiveTab] = useState("pubblica");
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        company: emailAzienda
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [jobs, setJobs] = useState([]);

    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target;

        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/jobs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.status === 400 || response.status === 401) {
                alert("La tua sessione è scaduta. Effettua di nuovo il login.");
                localStorage.clear();
                window.location.reload();
                return;
            }

            console.log("STATUS DELLA RISPOSTA:", response.status);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Impossibile pubblicare l'annuncio.");
            }

            setMessage("Annuncio pubblicato con successo!");
            setFormData({title: "", description: "", company: emailAzienda});
            fetchMyJobs();
        }
        catch (err) {
            setError(err.message);
        }
    }

    const fetchMyJobs = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/jobs", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status === 400 || response.status === 401) {
                localStorage.clear();
                window.location.reload();
                return;
            }

            const data = await response.json();

            if (response.ok) {
                console.log("ECCO I TUOI ANNUNCI DAL SERVER:", data);
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

    useEffect(() => {
        fetchMyJobs();
    }, []);

    return (
        <div className={styles.window}>
            <div className={styles.titleBar}>
                <span>Gestione annunci aziendali</span>
                <button
                    onClick={handleLogout}
                    className="win-btn"
                    style={{ fontWeight: "bold", fontSize: "11px", padding: "0 6px" }}
                >
                    X
                </button>
            </div>
            
            <div className={styles.menuBar}>
                <span className={styles.menuItem}>File</span>
                <span className={styles.menuItem}>Opzioni</span>
                <span className={styles.menuItem}>?</span>
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
                        Bacheca Annunci ({jobs.length})
                    </button>
                </div>

                <div className={styles.tabContentPanel}>
                    {activeTab ===  "pubblica" ? (
                        <form onSubmit={handleSubmit}>
                            <span
                                className={styles.formNotice}
                            >
                                Compilare i campi record di inserimento:
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
                    ) : (
                        <div className={styles.jobsListScrollable}>
                            {jobs.length === 0 ? (
                                <p 
                                    className={styles.emptyMessage}
                                >
                                    Non hai pubblicato nessun annuncio.
                                </p>
                            ) : (
                                jobs.map((job) => (
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
                </div>
            </div>

            <div className={styles.statusBar}>
                <div className={styles.statusField}>Pronto</div>
                <div className={styles.statusField}>ID: {emailAzienda}</div>
                <div className={styles.statusField}>Ruolo: {ruoloUtente ? ruoloUtente.toUpperCase() : "AZIENDA"}</div>
            </div>
        </div>
    )
}

export default DashboardAzienda;