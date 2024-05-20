import React from "react"
import Login from "./Login"
import Cadastro from "./Cadastro"
import {BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Login/>}></Route>
        <Route path="/cadastro" element={<Cadastro/>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App