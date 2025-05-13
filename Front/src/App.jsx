import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Calculadora from "./components/Calculadora";
import History from "./components/History";
import RegistroUsuario from "./components/RegistroUsuario";
import Login from "./components/Login";
import ActualizarSaldo from "./components/ActualizarSaldo";
import AplicarDescuento from "./components/AplicarDescuento";

function ProtectedRoute({ user, children }) {
  return user ? children : <Navigate to="/login" />;
}

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/registro" element={<RegistroUsuario setUser={setUser} />} />
        
        <Route 
          path="/app" 
          element={
            <ProtectedRoute user={user}>
              <div className="max-w-4xl mx-auto p-4 space-y-6">
                <div className="flex gap-4">
                  <ActualizarSaldo user={user} setUser={setUser} />
                  <AplicarDescuento />
                </div>
                <Calculadora user={user} setUser={setUser} />
                <History />
              </div>
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
