import React from "react"
import './Nav.css'
import { Link } from "react-router-dom"
export default props =>
    <aside className="menu-area">
        <nav className="menu">
            <Link  to="/">
                <i className="fa fa-home"></i> Início
            </Link>

            <Link to="/clientes">
                <i className="fa fa-users"></i> Clientes
            </Link>
            
            <Link to="/vendas">
                <i className="fa fa-money"></i> Vendas
            </Link>

            <Link to="/email">
            <i class="fa fa-envelope" aria-hidden="true"></i> Email
            </Link>
        </nav>
    </aside>