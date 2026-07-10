import { useState, useEffect } from 'react';
import './App.css';
import AuthForm from './components/authForm';
import DashboardAzienda from './components/dashboardAzienda';
import DashboardCandidato from './components/dashboardCandidato';

function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");     // verifica nello storage del browser se l'utente aveva già effettuato l'accesso
    const savedRole = localStorage.getItem("role");

    if (savedToken && savedRole) {      // se trova i dati nella sessione precedente li carica nello stato, evitando che l'utente venga buttato fuori se ricarica la pagina
      setToken(savedToken);
      setRole(savedRole);
    }
  }, []);     // avendo l'array vuoto [] esegue la funzione solo un volta quando viene aperto il sito

  return (
    <div className="App">
      {!token ? (
        <AuthForm onLoginSuccess={(savedToken, savedRole) => {
          setToken(savedToken);
          setRole(savedRole);
        }} />
      ) : role === "azienda" ? (
        <DashboardAzienda />
      ) : (
        <DashboardCandidato />
      )}
    </div>
  );
}

export default App;
