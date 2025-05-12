import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const validarEmail = (email) => {
  const atIdx = email.indexOf("@");
  const dotIdx = email.indexOf(".", atIdx + 1);
  return atIdx > 0 && dotIdx > atIdx + 1;
};

const RegistroUsuario = ({ setUser }) => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [saldo, setSaldo] = useState("");
  const [tocado, setTocado] = useState({
    nombre: false,
    email: false,
    password: false,
    confirmar: false,
    saldo: false,
  });
  const [mensaje, setMensaje] = useState("");
  const [errorBackend, setErrorBackend] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.email) setEmail(location.state.email);
  }, [location]);

  // Validaciones
  const errores = {
    nombre: nombre.trim() === "" ? "El nombre es obligatorio." : "",
    email:
      email.trim() === ""
        ? "El email es obligatorio."
        : !validarEmail(email)
        ? "El email no es válido."
        : "",
    password:
      password.length < 6
        ? "La contraseña debe tener al menos 6 caracteres."
        : "",
    confirmar:
      confirmar === ""
        ? "Confirma la contraseña."
        : password !== confirmar
        ? "Las contraseñas no coinciden."
        : "",
    saldo:
      saldo === ""
        ? "El saldo es obligatorio."
        : isNaN(Number(saldo)) || Number(saldo) < 0
        ? "El saldo no puede ser negativo."
        : "",
  };

  const hayErrores = Object.values(errores).some((e) => e);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setErrorBackend("");
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/usuarios", {
        nombre,
        email,
        password,
        saldo: Number(saldo),
      });
      setMensaje("¡Usuario registrado correctamente!");
      setUser(response.data);
      setNombre("");
      setEmail("");
      setPassword("");
      setConfirmar("");
      setSaldo("");
      setTocado({
        nombre: false,
        email: false,
        password: false,
        confirmar: false,
        saldo: false,
      });
      setTimeout(() => {
        navigate("/app");
      }, 1000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setErrorBackend(err.response.data.error);
      } else {
        setErrorBackend("Error de red o del servidor.");
      }
    }
    setLoading(false);
  };

  return (
    <form
      className="max-w-md mx-auto p-6 bg-white rounded shadow space-y-4"
      onSubmit={handleSubmit}
      noValidate
    >
      <h2 className="text-xl font-bold mb-4">Registrar Usuario</h2>
      {mensaje && <div className="text-green-600 font-medium">{mensaje}</div>}
      {errorBackend && <div className="text-red-600 font-medium">{errorBackend}</div>}
      {/* Nombre */}
      <div>
        <label className="block font-medium mb-1" htmlFor="nombre">
          Nombre
        </label>
        <input
          id="nombre"
          type="text"
          className={`w-full border rounded px-3 py-2 focus:outline-none ${
            errores.nombre && tocado.nombre ? "border-red-500" : "border-gray-300"
          }`}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onBlur={() => setTocado((t) => ({ ...t, nombre: true }))}
        />
        {errores.nombre && tocado.nombre && (
          <p className="text-red-600 text-sm mt-1">{errores.nombre}</p>
        )}
      </div>
      {/* Email */}
      <div>
        <label className="block font-medium mb-1" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className={`w-full border rounded px-3 py-2 focus:outline-none ${
            errores.email && tocado.email ? "border-red-500" : "border-gray-300"
          }`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTocado((t) => ({ ...t, email: true }))}
        />
        {errores.email && tocado.email && (
          <p className="text-red-600 text-sm mt-1">{errores.email}</p>
        )}
      </div>
      {/* Contraseña */}
      <div>
        <label className="block font-medium mb-1" htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          className={`w-full border rounded px-3 py-2 focus:outline-none ${
            errores.password && tocado.password ? "border-red-500" : "border-gray-300"
          }`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => setTocado((t) => ({ ...t, password: true }))}
        />
        {errores.password && tocado.password && (
          <p className="text-red-600 text-sm mt-1">{errores.password}</p>
        )}
      </div>
      {/* Confirmar contraseña */}
      <div>
        <label className="block font-medium mb-1" htmlFor="confirmar">
          Confirmar contraseña
        </label>
        <input
          id="confirmar"
          type="password"
          className={`w-full border rounded px-3 py-2 focus:outline-none ${
            errores.confirmar && tocado.confirmar ? "border-red-500" : "border-gray-300"
          }`}
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
          onBlur={() => setTocado((t) => ({ ...t, confirmar: true }))}
        />
        {errores.confirmar && tocado.confirmar && (
          <p className="text-red-600 text-sm mt-1">{errores.confirmar}</p>
        )}
      </div>
      {/* Saldo */}
      <div>
        <label className="block font-medium mb-1" htmlFor="saldo">
          Saldo
        </label>
        <input
          id="saldo"
          type="number"
          min="0"
          className={`w-full border rounded px-3 py-2 focus:outline-none ${
            errores.saldo && tocado.saldo ? "border-red-500" : "border-gray-300"
          }`}
          value={saldo}
          onChange={(e) => setSaldo(e.target.value)}
          onBlur={() => setTocado((t) => ({ ...t, saldo: true }))}
        />
        {errores.saldo && tocado.saldo && (
          <p className="text-red-600 text-sm mt-1">{errores.saldo}</p>
        )}
      </div>
      {/* Botón */}
      <button
        type="submit"
        disabled={hayErrores || loading}
        className={`w-full py-2 px-4 rounded font-semibold text-white transition ${
          hayErrores || loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Registrando..." : "Registrar"}
      </button>
    </form>
  );
};

export default RegistroUsuario;
