import React, { useState } from "react";
import axios from "axios";

const AplicarDescuento = () => {
  const [porcentaje, setPorcentaje] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/usuarios/descuento", {
        porcentaje: Number(porcentaje)
      });
      setMensaje(`Descuento del ${porcentaje}% aplicado a todos los usuarios`);
      setPorcentaje("");
    } catch (err) {
      setError(err.response?.data?.error || "Error al aplicar el descuento");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Aplicar Descuento General</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="number"
          value={porcentaje}
          onChange={(e) => setPorcentaje(e.target.value)}
          className="w-full p-2 border rounded"
          min="0"
          max="100"
          placeholder="Porcentaje de descuento"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Aplicar
        </button>
      </form>
      {mensaje && <p className="text-green-600 mt-2">{mensaje}</p>}
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default AplicarDescuento;
