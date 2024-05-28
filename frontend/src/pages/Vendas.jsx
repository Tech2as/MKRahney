import React, { useState, useEffect } from 'react'
import Main from "../components/template/Main"
import Modal from "../components/template/Modal"
import { useNavigate } from 'react-router-dom'
import Axios from "axios"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as yup from "yup"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Vendas = () => {
    const navigate = useNavigate();

    const [showGModal, setShowGModal] = useState(false);
    const handleOpenGModal = () => setShowGModal(true);
    const handleCloseGModal = () => setShowGModal(false);

    const [showModal, setShowModal] = useState(false);
    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const [clientes, setClientes] = useState([]);
    const [vendas, setVendas] = useState([]);
    const [gVendas, setGVendas] = useState({});

    const [cliente, setCliente] = useState('');
    const [produto, setProduto] = useState('');
    const [valor, setValor] = useState('');
    


useEffect(() => {
    Axios.get('http://localhost:3002/search-client')
    .then(response => {
        setClientes(response.data);
    })
    .catch(error => {
    console.error('Houve um erro ao buscar os dados do cliente:', error);
    });
}, []);

    useEffect(() => {
        Axios.get('http://localhost:3002/search-sale')
            .then(response => {
                setVendas(response.data);
            })
            .catch(error => {
                console.error('Houve um erro ao buscar os dados da venda:', error);
            });
    }, []);


    const validationRegister = yup.object().shape({
        produto: yup.string().required(),
        valor: yup.number().required(),
    })

    const handleSubmit = (values) => {
        Axios.post("http://localhost:3002/register-sale", {
            clienteId: values.cliente,
            produto: values.produto,
            valor: values.valor
        }).then((response) => {
            toast.success("Venda registrado!");
            handleCloseModal();
        }).catch((error) => {
            toast.error("Erro ao registrar venda.");
            handleCloseModal();
        });
    }
    const handleClick = (event) => {
        const id = event.currentTarget.value;

        Axios.get(`http://localhost:3002/get-sale?id=${id}`)
            .then((response) => {
                //setGVendas(response.data)
                const sale = response.data[0];
                setCliente(sale.id_clientes)
                setProduto(sale.produto)
                setValor(sale.valor)
                
                handleOpenGModal()
            })
            .catch((error) => {
                console.error('Erro ao fazer a solicitação GET:', error);
            });
    };
    
    return (

        <Main icon="money" title="Vendas">
            <ToastContainer />
            <div className="d-flex justify-content-between">
                <button className="btn btn-success" onClick={handleOpenModal}>
                    <i className="fa fa-plus-square px-2"></i>
                    Nova venda
                </button>

                <div className="search-cliente">
                    <input className="mr-sm-2" type="search" placeholder="Pesquise aqui..." aria-label="Search" />
                    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Pesquisar</button>
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
                    {vendas.map((vendas, index) => (
                        <tr key={index}>
                            <td>{vendas.nome}</td>
                            <td>{vendas.produto}</td>
                            <td>R${vendas.valor}</td>
                            <td className="td-actions">
                                <button className="btn btn-warning" value={vendas.id} onClick={handleClick}>
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

        <Modal show={showGModal} onClose={handleCloseGModal}>
                <div className="modal-content2">
                    <Formik initialValues={{ cliente: cliente, produto: produto, valor: valor }}
                        enableReinitialize={true} onSubmit="">
                        <Form action="">
                            <h2>Editar Venda</h2>
                            <div className="modal-inside">
                                <div className="form-group1">
                                <Field as="select" name="cliente">
                                {clientes.map((cliente, index) => (
                                    <option key={index}>{cliente.nome}</option>
                                ))}                                                                     
                                </Field>
                                </div>

                                <div className="form-group1">
                                    <label>Produto:</label>                              
                                    <Field name="produto" type="text" />
                                </div>

                                <div className="form-group1">
                                    <label>Valor:</label>     
                                    <Field name="valor" type="text" />                              
                                </div>
                                <button type="submit" className="btn btn-success">Salvar</button>
                            </div>
                        </Form>
                    </Formik>
                </div>
            </Modal>

            <Modal show={showModal} onClose={handleCloseModal}>
                <div className="modal-content2">
                    <Formik initialValues={{}} onSubmit={handleSubmit}
                        validationSchema={validationRegister}>
                        <Form action="">
                            <h2>Nova Venda</h2>
                            <div className="modal-inside">
                                <div className="form-group1">
                                    <label>Cliente:</label>
                                    <Field as="select" name="cliente">
                                        {clientes.map((cliente, index) => (
                                            <option key={index} value={cliente.id}>{cliente.nome}</option>
                                        ))}
                                    </Field>
                                </div>


                                <div className="form-group1">
                                    <label>Produto:</label>
                                    <Field name="produto" type="text" />
                                </div>

                                <div className="form-group1">
                                    <label>Valor:</label>
                                    <Field name="valor" type="text" />
                                </div>
                                <button type="submit" className="btn btn-success">Salvar</button>
                            </div>
                        </Form>
                    </Formik>
                </div>
            </Modal>
        </Main>
    );
};
export default Vendas