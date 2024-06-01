import React, { useEffect, useState } from 'react';
import Main from "../components/template/Main"
import Axios from "axios"

const Home = () => {
const [vendas, setVendas] = useState(0);
const [clientes, setClientes] = useState(0);
const [receita, setReceita] = useState(0);
useEffect(() => {
    getVendas();  
    getClientes();
    getReceita();
}, []);

const getVendas = () => {
    Axios.get('http://localhost:3002/get-vendas-home')
        .then((response) => {
            const sale = response.data;  
            setVendas(sale.count); 
        })
        .catch((error) => {
            console.error('Erro ao fazer a solicitação GET:', error);
        });
};

const getClientes = () => {
    Axios.get('http://localhost:3002/get-clientes-home')
        .then((response) => {
            const sale = response.data;  
            setClientes(sale.count);  
        })
        .catch((error) => {
            console.error('Erro ao fazer a solicitação GET:', error);
        });
};

const getReceita = () => {
    Axios.get('http://localhost:3002/get-receita-home')
        .then((response) => {
            const sale = response.data;  
            setReceita(sale.valor);  
        })
        .catch((error) => {
            console.error('Erro ao fazer a solicitação GET:', error);
        });
};

    return (
<Main icon="home" title="Início">

            <div className="dashboard-main">
                <div className="dashboard-start">
                    <div className="dashboard-data">
                        <i className="fa fa-usd"></i>
                        <p>Vendas: {vendas}</p>
                    </div>
                </div>

                <div className="dashboard-start-second">
                    <div className="dashboard-data-second">
                        <i className="fa fa-user-circle"></i>
                        <p>Clientes: {clientes}</p>
                    </div>
                </div>

                <div className="dashboard-start-third">
                    <div className="dashboard-data-third">
                        <i className="fa fa-bar-chart"></i>
                        <p>Receita: R${receita}</p>
                    </div>
                </div>
            </div>
</Main>
    );
};

export default Home