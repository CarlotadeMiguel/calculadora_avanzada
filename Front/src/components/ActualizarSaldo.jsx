import React, { useState } from "react";
import axios from "axios";

const ActualizarSaldo = ({ user, setUser }) => {
  const [nuevoSaldo, setNuevoSaldo] = useState(user?.saldo || "");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:5000/api/usuarios/${user.id}/saldo`,
        { saldo: Number(nuevoSaldo) }
      );
      setUser(res.data);
      setMensaje("¡Saldo actualizado correctamente!");
    } catch (err) {
      setError(err.response?.data?.error || "Error al actualizar el saldo");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Actualizar Saldo</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="number"
          value={nuevoSaldo}
          onChange={(e) => setNuevoSaldo(e.target.value)}
          className="w-full p-2 border rounded"
          min="0"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Actualizar
        </button>
      </form>
      {mensaje && <p className="text-green-600 mt-2">{mensaje}</p>}
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default ActualizarSaldo;
