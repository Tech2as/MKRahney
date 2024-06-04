import React from "react"
import './Nav.css'
import { Link } from "react-router-dom"
const Nav = ({ onLogout }) => {
    return (
    <aside className="menu-area">
        <nav className="menu">

            <Link to="/home">
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

        <button onClick={onLogout} className="btn btn-link deslogar">
            <i className="fa fa-sign-out" aria-hidden="true"></i> Deslogar
         </button>
            
        </nav>
    </aside>
  );
};

export default Nav;
