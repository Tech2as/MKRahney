import React from "react"
import './App.css'
import 'font-awesome/css/font-awesome.min.css'
import Footer from "../components/template/Footer"
import Logo from "../components/template/Logo"
import Nav from "../components/template/Nav"
import Login from "../Login"
import Home from "../pages/Home"
import Vendas from "../pages/Vendas"
import Clientes from "../pages/Clientes"
import NovoClientes from "../pages/NovoClientes"
import Email from '../pages/Email'
import { useState, useEffect } from "react"
import Cadastro from "../Cadastro"
import PrivateRoute from "../Private"
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleSignup = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      {!isAuthenticated ? (
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/cadastro" element={<Cadastro onSignup={handleSignup} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <div className="app">
          <Logo />
          <Nav onLogout={handleLogout} />
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/novocliente" element={<PrivateRoute element={NovoClientes} />} />
            <Route path="/clientes" element={<PrivateRoute element={Clientes} />} />
            <Route path="/vendas" element={<PrivateRoute element={Vendas} />} />
            <Route path="/email" element={<PrivateRoute element={Email} />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
          <Footer />
        </div>
      )}
    </BrowserRouter>
  );
};

export default App;