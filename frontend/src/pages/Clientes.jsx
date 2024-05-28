import React, { useEffect, useState } from 'react';
import Main from "../components/template/Main"
import { Link } from "react-router-dom"
import Axios from 'axios';


const Clientes = () => {
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        Axios.get('http://localhost:3002/search-client')
            .then(response => {
                setClientes(response.data);
            })
            .catch(error => {
                console.error('Houve um erro ao buscar os dados do cliente:', error);
            });
    }, []);


    return (
        <Main icon="users" title="Clientes">
            <div className="d-flex justify-content-between">
                <Link to="/novocliente" className="btn btn-success">
                    <i className="fa fa-plus-square px-2 pt-2"></i>
                    Novo cliente
                </Link>

                <div className="search-cliente">
                    <input class="mr-sm-2" type="search" placeholder="Pesquise aqui..." aria-label="Search" />
                    <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Pesquisar</button>
                </div>
            </div>

            <table className="table table-bordered mt-4">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((cliente, index) => (
                        <tr key={index}>
                            <td>{cliente.nome}</td>
                            <td>{cliente.email}</td>
                            <td>{cliente.telefone}</td>
                            <td className="td-actions">
                                <button className="btn btn-warning">
                                    <i className="fa fa-pencil"></i>
                                </button>

                                <button className="btn btn-danger">
                                    <i className="fa fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </Main>

    );
};
export default Clientes