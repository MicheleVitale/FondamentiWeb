import { useState, useEffect } from 'react';
import './App.css';
import AuthForm from './components/authForm';
import DashboardAzienda from './components/dashboardAzienda';

function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");

    if (savedToken && savedRole) {
      setToken(savedToken);
      setRole(savedRole);
    }
  }, []);

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
        // candidato
        <div></div>
      )}
    </div>
  );
}

export default App;
