import React, { useState } from "react";
import axios from "axios";

const AumentarSaldo = ({ user, setUser }) => {
  const [mostrarPrueba, setMostrarPrueba] = useState(false);
  const [respuesta, setRespuesta] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded shadow">
        Debes iniciar sesión para actualizar tu saldo.
      </div>
    );
  }

  const handleMostrarPrueba = () => {
    setMostrarPrueba(true);
    setMensaje("");
    setRespuesta("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (respuesta.trim() !== "8") {
      setMensaje("❌ Respuesta incorrecta. Intenta nuevamente.");
      return;
    }

    setLoading(true);
    try {
      const nuevoSaldo = user.saldo + 10;
      const response = await axios.put(
        `http://localhost:5000/api/usuarios/${user.id}/saldo`,
        { saldo: nuevoSaldo }
      );
      setUser(response.data);
      setMensaje("✅ ¡Saldo actualizado correctamente!");
      setMostrarPrueba(false);
    } catch (error) {
      setMensaje("❌ Error al actualizar el saldo. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">

      {!mostrarPrueba && (
        <button
          className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={handleMostrarPrueba}
        >
          Aumentar saldo
        </button>
      )}

      {mostrarPrueba && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 p-4 bg-gray-50 rounded shadow-inner"
        >
          <p className="mb-4 text-lg">
            <span className="font-semibold text-gray-700">Saldo actual:</span>{" "}
            <span className="text-blue-600 font-mono">{user.saldo}</span>
          </p>
          <label className="block mb-2 text-gray-700 font-medium">
            Responde correctamente para aumentar tu saldo en 10:
          </label>
          <div className="mb-4">
            <span className="font-semibold">¿Cuánto es 3 + 5?</span>
            <input
              type="text"
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              disabled={loading}
              className="ml-3 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            {loading ? "Actualizando..." : "Enviar respuesta"}
          </button>
        </form>
      )}

      {mensaje && (
        <div
          className={`mt-4 p-3 rounded text-center ${mensaje.startsWith("✅")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
            }`}
        >
          {mensaje}
        </div>
      )}
    </div>
  );
};

export default AumentarSaldo;
