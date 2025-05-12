import React, { useState } from "react";
import axios from "axios";

const validarEmail = (email) => {
  const atIdx = email.indexOf("@");
  const dotIdx = email.indexOf(".", atIdx + 1);
  return atIdx > 0 && dotIdx > atIdx + 1;
};

const RegistroUsuario = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [saldo, setSaldo] = useState("");
  const [tocado, setTocado] = useState({ nombre: false, email: false, saldo: false });
  const [mensaje, setMensaje] = useState("");
  const [errorBackend, setErrorBackend] = useState("");
  const [loading, setLoading] = useState(false);

  // Errores de validación
  const errores = {
    nombre: nombre.trim() === "" ? "El nombre es obligatorio." : "",
    email:
      email.trim() === ""
        ? "El email es obligatorio."
        : !validarEmail(email)
        ? "El email no es válido."
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
        saldo: Number(saldo),
      });
      setMensaje("¡Usuario registrado correctamente!");
      setNombre("");
      setEmail("");
      setSaldo("");
      setTocado({ nombre: false, email: false, saldo: false });
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
      {/* ...campos del formulario igual que antes... */}
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
