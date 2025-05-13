import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Calculadora from "./components/Calculadora";
import History from "./components/History";
import RegistroUsuario from "./components/RegistroUsuario";
import Login from "./components/Login";
import AumentarSaldo from "./components/AumentarSaldo";
import AplicarDescuento from "./components/AplicarDescuento";

function ProtectedRoute({ user, children }) {
  return user ? children : <Navigate to="/login" />;
}

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/registro" element={<RegistroUsuario setUser={setUser} />} />

        <Route
          path="/app"
          element={
            <ProtectedRoute user={user}>
              <div className="flex flex-col items-end p-4">
                <button
                  onClick={() => setUser(null)}
                  className="mb-4 px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition"
                >
                  Cerrar sesión
                </button>
              </div>
              <div className="max-w-4xl mx-auto p-4 space-y-6">
                <div className="flex gap-4">
                  <AumentarSaldo user={user} setUser={setUser} />
                  <AplicarDescuento />
                </div>
                <Calculadora user={user} setUser={setUser} />
                <History />
              </div>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={user ? "/app" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
