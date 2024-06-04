import React from "react"
import Login from "../Login"
import Cadastro from "../Cadastro"
import Home from "../pages/Home"
import Vendas from "../pages/Vendas"
import Clientes from "../pages/Clientes"
import NovoClientes from "../pages/NovoClientes"
import Email from '../pages/Email'
import {BrowserRouter, Routes, Route} from 'react-router-dom'


export default props =>
      <Routes>
        {/* <Route path="/" element={<Login/>}></Route> */}
        <Route path="/home" element={<Home/>}></Route>
        <Route path="/novocliente" element={<NovoClientes/>}></Route>
        {/* <Route path="/cadastro" element={<Cadastro/>}></Route> */}
        <Route path="/clientes" element={<Clientes/>}></Route>
        <Route path="/vendas" element={<Vendas/>}></Route>
        <Route path="/email" element={<Email/>}></Route>
      </Routes>


