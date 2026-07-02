import { useState } from "react";

function AuthForm({onLoginSuccess}) {
    const [isLogin, setisLogin] = useState(true);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "candidato"
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleInputChange = (e) => {
        const {name, value} = e.target;

        setFormData({...formData, [name]: value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        const endpoint = isLogin ? "login" : "register";
        const url = `http://localhost:5000/api/auth/${endpoint}`;

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
                console.log('Login effettuato con successo! Dati dal server:', data);

                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.user.role);
                localStorage.setItem("email", data.user.email);

                onLoginSuccess(data.token, data.user.role);
            }
            else {
                setisLogin(true);
            }
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setFormData({
                email: "",
                password: "",
                role: "candidato"
            });
        }
    }

    return (
        <div>
            <h2>{isLogin ? "Accedi" : "Registrati"}</h2>
            {message && <p>{message}</p>}
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email: </label>
                    <input
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div>
                    <label>Password: </label>
                    <input
                        type="password" 
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {!isLogin && (
                    <div>
                        <label>Ruolo: </label>
                        <select 
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            required>
                                <option value="candidato">Candidato</option>
                                <option value="azienda">Azienda</option>
                        </select>
                    </div>
                )}

                <button type="submit">
                    {isLogin ? "Accedi" : "Crea Account"}
                </button>
            </form>

            <p>
                {isLogin ? "Non hai ancora un account? " : "Hai già un account? "}
                <a 
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        setisLogin(!isLogin);
                    }}
                >
                    {isLogin ? "Registrati qui" : "Accedi qui"}
                </a>
            </p>
        </div>
    )
}

export default AuthForm;