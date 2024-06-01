import React from "react"
import Login from "../Login"
import Cadastro from "../Cadastro"
import Footer from "../components/template/Footer"
import Header from "../components/template/Header"
import Home from "../pages/Home"
import Vendas from "../pages/Vendas"
import Logo from "../components/template/Logo"
import Main from "../components/template/Main"
import Nav from "../components/template/Nav"
import Clientes from "../pages/Clientes"
import NovoClientes from "../pages/NovoClientes"
import Email from '../pages/Email'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

export default props =>
      <Routes>
        <Route path="/" element={<Home/>}></Route> 
        <Route path="/novocliente" element={<NovoClientes/>}></Route>
        <Route path="/cadastro" element={<Cadastro/>}></Route>
        <Route path="/clientes" element={<Clientes/>}></Route>
        <Route path="/vendas" element={<Vendas/>}></Route>
        <Route path="/email" element={<Email/>}></Route>
      </Routes>


