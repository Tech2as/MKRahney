import React from "react"
import Main from "../components/template/Main"

export default props =>
<Main icon="money" title="Vendas">
<div className="d-flex justify-content-between">
        <button className="btn btn-success">
            <i className="fa fa-plus-square px-2"></i>
                Nova venda
        </button>
        
        <div className="search-cliente">
            <input class="mr-sm-2" type="search" placeholder="Pesquise aqui..." aria-label="Search"/>
            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Pesquisar</button>
        </div>
    </div>

      <table className="table table-bordered mt-4">
        <thead>
            <tr>
                <th>Cliente</th>
                <th>Produto</th>
                <th>Valor</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>João</td>
                <td>Celular</td>
                <td>R$5000</td>
                <td className="td-actions">
                    <button className="btn btn-warning">
                        <i className="fa fa-pencil"></i>
                    </button>

                    <button className="btn btn-danger">
                        <i className="fa fa-trash"></i>
                    </button>
                </td>
            </tr>
        </tbody>

      </table>
</Main>