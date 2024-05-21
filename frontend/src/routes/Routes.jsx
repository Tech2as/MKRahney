import React from "react"
import Login from "../Login"
import Cadastro from "../Cadastro"
import Footer from "../components/template/Footer"
import Header from "../components/template/Header"
import Logo from "../components/template/Logo"
import Main from "../components/template/Main"
import Nav from "../components/template/Nav"
import {BrowserRouter, Routes, Route} from 'react-router-dom'

function RoutesApp() {
  return (
    <Routes>
        {/* <Route path="/" element={<Login/>}></Route> */}
        <Route path="/cadastro" element={<Cadastro/>}></Route>
    </Routes>
  )
}

export default RoutesApp