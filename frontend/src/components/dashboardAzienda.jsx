import { useState, useEffect } from "react";

function DashboardAzienda() {
    const emailAzienda = localStorage.getItem("email");
    const ruoloUtente = localStorage.getItem("role");
    const [formData, setFormData] = useState({
        title: "",
        description: ""
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
            setFormData({title: "", description: ""});
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
        <div>
            <div>
                <h2>Dashboard Azienda</h2>
                <button onClick={handleLogout}>Logout</button>
            </div>

            <p>Benvenuto, {emailAzienda}!
                Ruolo: <span>{ruoloUtente ? ruoloUtente.toUpperCase() : ""}</span>
            </p>
            <hr />

            <div>
                <h3>Pubblica un nuovo annuncio di lavoro</h3>
                {message && <p>{message}</p>}
                {error && <p>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Titolo: </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div>
                        <label>Descrizione: </label>
                        <textarea
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <button type="submit">Pubblica Annuncio</button>
                </form>
            </div>

            <div>
                <h3>Bacheca annunci</h3>
                {jobs.length === 0 ? (
                    <p>Non hai pubblicato nessun annuncio.</p>
                ) : (
                    jobs.map((job) => (
                        <div key={job._id}>
                            <h4>{job.title}</h4>
                            <p>{job.description}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default DashboardAzienda;