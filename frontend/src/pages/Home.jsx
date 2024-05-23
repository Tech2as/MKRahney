import React from "react"
import Main from "../components/template/Main"
import Axios from "axios"

export default props =>
<Main icon="home" title="Início">
    <div className="dashboard-main">
        <div className="dashboard-start">
            <div className="dashboard-data">
                <i class="fa fa-usd"></i>
                <p>Vendas: 12</p>
            </div>
        </div>
        
        <div className="dashboard-start-second">
            <div className="dashboard-data-second">
                <i class="fa fa-user-circle"></i>
                <p>Clientes: 12</p>
            </div>
        </div>
    </div>

    <div className="d-flex justify-content-center">
        <div className="dashboard-start-third">
                <div className="dashboard-data-third">
                    <i class="fa fa-bar-chart"></i>
                    <p>Receita: R$1.200.000</p>
                </div>
            </div>
    </div>
</Main>