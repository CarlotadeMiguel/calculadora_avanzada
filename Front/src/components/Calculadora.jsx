import React, { useState } from 'react';
import axios from 'axios';

const Calculadora = () => {
    const [numero1, setNumero1] = useState('');
    const [numero2, setNumero2] = useState('');
    const [operacion, setOperacion] = useState('sumar');
    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setResultado(null);

        try {
            const response = await axios.post('http://localhost:5000/api/calcular', {
                operacion,
                a: parseFloat(numero1),
                b: parseFloat(numero2),
            });
            setResultado(response.data.resultado);
        } catch (err) {
            if (err.response) {
                setError(err.response.data.error || 'Error al realizar el cálculo.');
            } else {
                setError('Error de red. Intente nuevamente.');
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
            <h1 className="text-2xl font-bold text-center mb-6">Calculadora</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Número 1:</label>
                    <input
                        type="number"
                        value={numero1}
                        onChange={(e) => setNumero1(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Número 2:</label>
                    <input
                        type="number"
                        value={numero2}
                        onChange={(e) => setNumero2(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Operación:</label>
                    <select
                        value={operacion}
                        onChange={(e) => setOperacion(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="sumar">Sumar</option>
                        <option value="restar">Restar</option>
                        <option value="multiplicar">Multiplicar</option>
                        <option value="dividir">Dividir</option>
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={!numero1 || !numero2}
                    className={`w-full px-4 py-2 text-white font-medium rounded-md ${
                        !numero1 || !numero2
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                    Calcular
                </button>
            </form>
            {resultado !== null && (
                <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
                    Resultado: {resultado}
                </div>
            )}
            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
                    {error}
                </div>
            )}
        </div>
    );
};

export default Calculadora;