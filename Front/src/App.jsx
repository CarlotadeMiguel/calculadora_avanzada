import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Calculadora from "./components/Calculadora";
import History from "./components/History";
import RegistroUsuario from "./components/RegistroUsuario";
import Login from "./components/Login";

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
              <Calculadora user={user} />
              <History />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
