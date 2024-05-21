import React from "react"
import './App.css'

import 'font-awesome/css/font-awesome.min.css'

import RoutesApp from "../routes/Routes"
import Footer from "../components/template/Footer"
import Header from "../components/template/Header"
import Logo from "../components/template/Logo"
import Main from "../components/template/Main"
import Nav from "../components/template/Nav"
import {BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {
  return (
    <div className="app">
      <Logo />
      <Nav/>
      <Main icon="home" title="Início">
        <div className="display-4">Bem-vindo</div>
        <hr/>
        <p className="mb-0">Cadastro</p>
      </Main>
      <Footer />
    </div>
  )
}

export default App