import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/login", { email, password });
      setUser(res.data);
      navigate("/app");
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("El usuario no existe. Debes registrarte.");
      } else if (err.response && err.response.status === 401) {
        setError("Credenciales incorrectas.");
      } else {
        setError("Error de red o del servidor.");
      }
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-bold mb-4">Iniciar Sesión</h2>
      <input
        type="email"
        placeholder="Email"
        className="w-full border rounded px-3 py-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        className="w-full border rounded px-3 py-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full py-2 px-4 rounded font-semibold text-white bg-blue-600 hover:bg-blue-700"
      >
        Entrar
      </button>
      <div className="text-center mt-4">
        <span>¿No tienes cuenta? </span>
        <Link to="/registro" className="text-blue-600 underline">
          Regístrate aquí
        </Link>
      </div>
    </form>
  );
};

export default Login;
