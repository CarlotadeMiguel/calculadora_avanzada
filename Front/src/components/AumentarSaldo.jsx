import React, { useState } from "react";
import axios from "axios";
import preguntas from "../data/preguntas.json";

const getPreguntaAleatoria = () => {
  const idx = Math.floor(Math.random() * preguntas.length);
  return preguntas[idx];
};

const AumentarSaldo = ({ user, setUser }) => {
  const [mostrarPrueba, setMostrarPrueba] = useState(false);
  const [preguntaActual, setPreguntaActual] = useState(null);
  const [respuesta, setRespuesta] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded shadow">
        Debes iniciar sesión para actualizar tu saldo.
      </div>
    );
  }

  const handleMostrarPrueba = () => {
    setPreguntaActual(getPreguntaAleatoria());
    setMostrarPrueba(true);
    setMensaje("");
    setRespuesta("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (respuesta.trim() !== preguntaActual.respuesta) {
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
      setError("❌ Error al actualizar el saldo. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
      {!mostrarPrueba ? (
        <button
          onClick={handleMostrarPrueba}
          className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition duration-200"
        >
          Aumentar saldo
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              {preguntaActual.pregunta}
            </label>
            <input
              type="text"
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={loading}
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading || !respuesta}
            className={`w-full py-2 px-4 rounded font-semibold text-white transition duration-200 ${loading || !respuesta
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
              }`}
          >
            {loading ? "Verificando..." : "Enviar respuesta"}
          </button>
        </form>
      )}
      {mensaje && (
        <div className="mt-4 text-green-600 font-medium text-center">{mensaje}</div>
      )}
      {error && (
        <div className="mt-4 text-red-600 font-medium text-center">{mensaje}</div>
      )}
    </div>
  );
};

export default AumentarSaldo;
