// src/App.js
import React from 'react';
import './index.css';
import Calculadora from './components/Calculadora';
import History from './components/History';
import RegistroUsuario from './components/RegistroUsuario';

function App() {
  return (
    <>
      <Calculadora />
      <History />
      <RegistroUsuario />
    </>
  );
}

export default App;
