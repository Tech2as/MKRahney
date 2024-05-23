import React from "react"
import './App.css'
import 'font-awesome/css/font-awesome.min.css'

import Routes from "../routes/Routes"
import Footer from "../components/template/Footer"
import Logo from "../components/template/Logo"
import Home from "../pages/Home"
import Nav from "../components/template/Nav"

import {BrowserRouter} from 'react-router-dom'

export default props =>
  <BrowserRouter >
    <div className="app">
      <Logo />
      <Nav />
      <Routes />
      <Footer />
    </div>
  </BrowserRouter >

