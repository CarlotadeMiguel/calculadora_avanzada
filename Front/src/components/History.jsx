import React, { useEffect, useState } from "react";
import axios from "axios";

// Opciones de filtro
const OPERACIONES = [
  { label: "Todas", value: "" },
  { label: "Sumar", value: "sumar" },
  { label: "Restar", value: "restar" },
  { label: "Multiplicar", value: "multiplicar" },
  { label: "Dividir", value: "dividir" },
];

const REGISTROS_POR_PAGINA = 10;

const History = () => {
  const [historial, setHistorial] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(false);

  // Cargar historial al montar o al recargar
  const cargarHistorial = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/historial");
      setHistorial(res.data);
    } catch (err) {
      setHistorial([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarHistorial();
  }, []);

  // Filtrar historial según filtro seleccionado
  const historialFiltrado = filtro
    ? historial.filter((item) => item.operation === filtro)
    : historial;

  // Paginación
  const totalPaginas = Math.ceil(historialFiltrado.length / REGISTROS_POR_PAGINA);
  const datosPagina = historialFiltrado.slice(
    (pagina - 1) * REGISTROS_POR_PAGINA,
    pagina * REGISTROS_POR_PAGINA
  );

  // Cambiar página
  const cambiarPagina = (nuevaPagina) => {
    setPagina(nuevaPagina);
  };

  // Cambiar filtro y resetear página
  const handleFiltro = (e) => {
    setFiltro(e.target.value);
    setPagina(1);
  };

  return (
    <div className="p-6 bg-white rounded shadow max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <label className="font-medium">Filtrar por operación:</label>
          <select
            className="border rounded px-2 py-1"
            value={filtro}
            onChange={handleFiltro}
          >
            {OPERACIONES.map((op) => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={cargarHistorial}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Recargar"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Fecha</th>
              <th className="px-4 py-2 border">Operación</th>
              <th className="px-4 py-2 border">Parámetros</th>
              <th className="px-4 py-2 border">Resultado</th>
            </tr>
          </thead>
          <tbody>
            {datosPagina.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  {loading ? "Cargando..." : "No hay registros"}
                </td>
              </tr>
            ) : (
              datosPagina.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{new Date(item.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-2 border capitalize">{item.operation}</td>
                  <td className="px-4 py-2 border">
                    {Object.entries(item.parameters)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(", ")}
                  </td>
                  <td className="px-4 py-2 border">{item.result}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => cambiarPagina(pagina - 1)}
            disabled={pagina === 1}
          >
            Anterior
          </button>
          {[...Array(totalPaginas)].map((_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded ${
                pagina === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => cambiarPagina(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => cambiarPagina(pagina + 1)}
            disabled={pagina === totalPaginas}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default History;
