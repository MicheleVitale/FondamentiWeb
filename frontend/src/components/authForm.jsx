import { useState } from "react";
import styles from "./authForm.module.css"

function AuthForm({onLoginSuccess}) {
    const [isLogin, setisLogin] = useState(true);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "candidato"
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleInputChange = (e) => {          // si attiva alla digitazione
        const {name, value} = e.target;
 
        setFormData({...formData, [name]: value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        const endpoint = isLogin ? "login" : "register";            // scelta della route di backend in base alle operazioni dell'utente
        const url = `http://localhost:3000/api/auth/${endpoint}`;

        try {
            const respons = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await respons.json();

            if (!respons.ok) {
                throw new Error(data.message || "Qualcosa è andato storto!");
            }

            setMessage(data.message);


            if (isLogin) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.user.role);
                localStorage.setItem("email", data.user.email);

                onLoginSuccess(data.token, data.user.role);         // comunica ad App.js che il login è andata a buon fine passando i dati
            }
            else {
                setisLogin(true);           // registrazione andata a buon fine, passaggio al login
            }
        }
        catch (err) {
            setError(err.message);
        }
        finally {           // a prescindere dall'esito svuota i campi del form
            setFormData({
                email: "",
                password: "",
                role: "candidato"
            });
        }
    }

    return (
        <div className={`win-window ${styles.windowContainer}`}>

            <div className={`win-title-bar ${styles.titleBar}`}>
                <span>{isLogin ? "Accedi" : "Registrati"}</span>
            </div>

            <div className={styles.windowBody}>
                {message && <p className="form-success-msg">{message}</p>}
                {error && <p className="form-error-msg">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Email: </label>
                        <input
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="win-input"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Password: </label>
                        <input
                            type="password" 
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            className="win-input"
                        />
                    </div>

                    {!isLogin && (
                        <div className={styles.formGroup}>
                            <label>Ruolo: </label>
                            <div className={styles.selectWrapper}>
                                <select 
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    required
                                    className={styles.selectRetro}
                                >
                                        <option value="candidato">Candidato</option>
                                        <option value="azienda">Azienda</option>
                                </select>

                                <div className={styles.selectBtn}>
                                    <div className={styles.arrowIcon}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={styles.actionBar}>
                        <button
                            type="submit"
                            className={`win-btn ${styles.actionBtn}`}
                        >
                            {isLogin ? "OK" : "Salva"}
                        </button>
                        <button 
                            type="button" 
                            className={`win-btn ${styles.actionBtn}`}
                            onClick={() => { setisLogin(!isLogin); setError(""); setMessage(""); }}
                        >
                            {isLogin ? "Registrati" : "Accedi"}
                        </button>
                    </div>

                </form>

            </div>
        </div>
    )
}

export default AuthForm;