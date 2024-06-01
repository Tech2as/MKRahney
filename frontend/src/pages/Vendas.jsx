import React, { useState, useEffect } from 'react'
import Main from "../components/template/Main"
import Modal from "../components/template/Modal"
import Axios from "axios"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as yup from "yup"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Vendas = () => {

    const [showGModal, setShowGModal] = useState(false);
    const handleOpenGModal = () => setShowGModal(true);
    const handleCloseGModal = () => setShowGModal(false);

    const [showModal, setShowModal] = useState(false);
    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const [showDModal, setshowDModal] = useState(false);
    const handleOpenDModal = () => setshowDModal(true);
    const handleCloseDModal = () => setshowDModal(false);

    const [clientes, setClientes] = useState([]);
    const [vendas, setVendas] = useState([]);

    const [idVendas, setIdVendas] = useState('');
    const [idDelete, setIdDelete] = useState('');
    const [cliente, setCliente] = useState('');
    const [produto, setProduto] = useState('');
    const [valor, setValor] = useState('');

    // paginação
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [total, setTotal] = useState(0);
    //const totalPages = Math.ceil(totalItems / itemsPerPage);

    const reloadPage = () => {
        window.location.reload();
    };
const [searchTerm, setSearchTerm] = useState('');

useEffect(() => {
    fetchVendas();
}, [page]);

const fetchVendas = async () => {
    try {
        const response = await Axios.get('http://localhost:3002/search-sale', {
            params: { page, limit }
        });
        setVendas(response.data.data);
        setTotal(response.data.total);
    } catch (error) {
        console.error("Erro ao buscar vendas:", error);
    }
};

      const handlePageChange = (newPage) => {
        setPage(newPage);
    };
    
    const handleInputChange = (event, handleChange) => {
        handleChange(event);
        if (event.target.value === '') {
          fetchVendas();
        }
      };
    
      const handleSearchSubmit = (values) => {
        if (!values.searchTerm) {
          fetchVendas();
        } else {
          Axios.get('http://localhost:3002/search-sale-query', {
            params: { query: values.searchTerm }
          })
          .then(response => {
            setVendas(response.data);
          })
          .catch(error => {
            console.error('Houve um erro ao buscar os dados do cliente:', error);
          });
        }
      }


useEffect(() => {
    Axios.get('http://localhost:3002/search-client-invendas')
    .then(response => {
        setClientes(response.data);
    })
    .catch(error => {
    console.error('Houve um erro ao buscar os dados do cliente:', error);
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
            reloadPage()
        }).catch((error) => {
            toast.error("Erro ao registrar venda.");
            handleCloseModal();
        });
    }

    // pegar os dados via ID para atualizar as vendas
    const handleClick = (event) => {
        const id = event.currentTarget.value;

        Axios.get(`http://localhost:3002/get-sale?id=${id}`)
            .then((response) => {
                const sale = response.data[0];
                setIdVendas(sale.id)
                setCliente(sale.id_clientes)
                setProduto(sale.produto)
                setValor(sale.valor)
                
                handleOpenGModal()
            })
            .catch((error) => {
                console.error('Erro ao fazer a solicitação GET:', error);
            });
    };

// salvar as mudanças ao atualizar as vendas
    const handleUpdate = (values) => {
        Axios.post("http://localhost:3002/update-sale", {
            idVendas: values.idVendas,
            clienteId: values.cliente,
            produto: values.produto,
            valor: values.valor
        }).then((response) => {
            toast.success("Venda atualizada!");
            reloadPage()
        }).catch((error) => {
            toast.error("Erro ao atualizar venda.");
            handleCloseGModal();
        });
    }

// pegar os dados para deletar
const handleClickDel = (event) => {
    const id = event.currentTarget.value;

Axios.get(`http://localhost:3002/get-delete?id=${id}`)
    .then((response) => {
    const sale = response.data[0];
    setIdDelete(sale.id)
    
    handleOpenDModal()
    })
    .catch((error) => {
    console.error('Erro ao fazer a solicitação GET:', error);
    });
};

// deletar a venda
const handleClickDelP = (values) => {
    Axios.post("http://localhost:3002/post-delete", {
        idDelete: values.idDelete

    }).then((response) => {
        toast.success("Venda deletada!");
        reloadPage()
    }).catch((error) => {
        toast.error("Erro ao deletar venda.");
        handleCloseDModal();
    });
}
    return (

        <Main icon="money" title="Vendas">
            <div className="p-3">
            <ToastContainer />
            <div className="d-flex justify-content-between">
                <button className="btn btn-success" onClick={handleOpenModal}>
                    <i className="fa fa-plus-square px-2"></i>
                    Nova venda
                </button>

                <div className="search-cliente">
    <Formik
        initialValues={{ searchTerm: '' }}
        onSubmit={handleSearchSubmit}
    >
        {({ values, handleChange }) => (
            <Form className="search-form">
                <Field
                    className="search-input"
                    type="search"
                    placeholder="Pesquise aqui..."
                    aria-label="Search"
                    name="searchTerm"
                    value={values.searchTerm}
                    onChange={(event) => handleInputChange(event, handleChange)}
                />
                <button className="search-button" type="submit">
                    Pesquisar
                </button>
            </Form>
        )}
    </Formik>
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
                    {vendas.map((venda, index) => (
                        <tr key={index}>
                            <td>{venda.nome}</td>
                            <td>{venda.produto}</td>
                            <td>R${venda.valor}</td>
                            <td className="td-actions">
                                <button className="btn btn-warning" value={venda.id} onClick={handleClick}>
                                    <i className="fa fa-pencil"></i>
                                </button>
                                <button className="btn btn-danger" value={venda.id} onClick={handleClickDel}>
                                    <i className="fa fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                {Array.from({ length: Math.ceil(total / limit) }, (_, index) => (
                    <button
                        key={index}
                        className={`page-link ${index + 1 === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

{/* Modal do Editar */}
        <Modal show={showGModal} onClose={handleCloseGModal}>
                <div className="modal-content2">
                    <Formik initialValues={{ idVendas: idVendas, 
                    cliente: cliente, 
                    produto: produto, 
                    valor: valor }}
                    enableReinitialize={true} onSubmit={handleUpdate}>
                        <Form action="">
                            <h2>Editar Venda</h2>
                            <div className="modal-inside">
                                <div className="form-group1">
                                <Field as="select" name="cliente">
                                    {clientes.map((cliente, index) => (
                                    <option key={index} value={cliente.id_clientes}>
                                    {cliente.nome}
                                    </option>
                                    ))}
                                </Field>
                                </div>

                                <Field name="idVendas" type="hidden"/>

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

{/* Modal Delete Vendas */}
            <Modal show={showDModal} onClose={handleCloseDModal}>
                <div className="modal-content2">
                <Formik initialValues={{idDelete: idDelete}}  
                enableReinitialize={true} onSubmit={handleClickDelP}>
                    <Form action="">
                        <h2>Confirmação</h2>

                        <div className="form-group1">
                        <h3>Tem  certeza que deseja excluir o usuário?</h3>                              
                        </div>
                        <Field name="idDelete" type="hidden"/>
                        <button type="submit" className="btn btn-danger">Sim</button>
                    </Form>
                </Formik>
                </div>
            </Modal>

{/* Modal do Nova Venda */}
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
                                    <option value="">Selecione um cliente</option>
                                        {clientes.map((cliente, index) => (
                                            <option key={index} value={cliente.id_clientes}>{cliente.nome}</option>
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


            </div>
        </Main>
    );
};
export default Vendas