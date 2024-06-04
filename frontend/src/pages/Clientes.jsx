import React, { useEffect, useState } from 'react';
import Main from "../components/template/Main"
import { Link } from "react-router-dom"
import Modal from "../components/template/Modal"
import Axios from "axios"
import { Formik, Form, Field, ErrorMessage } from "formik"
import InputMask from 'react-input-mask';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const Clientes = () => {
    // array do map
    const [clientes, setClientes] = useState([]);

    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [total, setTotal] = useState(0);


    const [idCliente, setIdCliente] = useState('');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');

    const [idDelete, setIdDelete] = useState('');

    // Modal do editar
    const [showGModal, setShowGModal] = useState(false);
    const handleOpenGModal = () => setShowGModal(true);
    const handleCloseGModal = () => setShowGModal(false);

    // Modal do delete
    const [showDModal, setshowDModal] = useState(false);
    const handleOpenDModal = () => setshowDModal(true);
    const handleCloseDModal = () => setshowDModal(false);

    const reloadPage = () => {
        window.location.reload();
    };

const [searchTerm, setSearchTerm] = useState('');
useEffect(() => {
    fetchClientes();
}, [page]);


const fetchClientes = async () => {
    try {
        const res = await Axios.get('http://localhost:3002/search-client', { params: { page, limit } });
        setClientes(res.data.data);
        setTotal(res.data.total);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const handlePageChange = (newPage) => {
    setPage(newPage);
};

  const handleInputChange = (event, handleChange) => {
    handleChange(event);
    if (event.target.value === '') {
        fetchClientes();
    }
  };

  const handleSearchSubmit = (values) => {
    if (!values.searchTerm) {
        fetchClientes();
    } else {
      Axios.get('http://localhost:3002/search-client-query', {
        params: { query: values.searchTerm }
      })
      .then(response => {
        setClientes(response.data);
      })
      .catch(error => {
        console.error('Houve um erro ao buscar os dados do cliente:', error);
      });
    }
  }


// pegar os dados via ID para atualizar as vendas
const handleClick = (event) => {
const id = event.currentTarget.value;

Axios.get(`http://localhost:3002/get-client?id=${id}`)
    .then((response) => {
        const sale = response.data[0];  
        setIdCliente(sale.id_clientes)
        setNome(sale.nome)
        setEmail(sale.email)
        setTelefone(sale.telefone)
        handleOpenGModal()
        })
        .catch((error) => {
            console.error('Erro ao fazer a solicitação GET:', error);
        });
};

// salvar as mudanças ao atualizar nos clientes
const handleUpdate = (values) => {
    Axios.post("http://localhost:3002/update-client", {
        idCliente: values.idCliente,
        nome: values.nome,
        email: values.email,
        telefone: values.telefone
    }).then((response) => {
        toast.success("Usuário atualizado!");
        reloadPage()
    }).catch((error) => {
        toast.error("Erro ao atualizar usuário.");
        handleCloseGModal();
    });
}

// pegar os dados para deletar
const handleClickDel = (event) => {
    const id = event.currentTarget.value;

Axios.get(`http://localhost:3002/get-delete-client?id=${id}`)
    .then((response) => {
        const sale = response.data[0];
        setIdDelete(sale.id_clientes)
    
    handleOpenDModal()
    })
    .catch((error) => {
        console.error('Erro ao fazer a solicitação GET:', error);
    });
};

// deletar o cliente
const handleClickDelP = (values) => {
    Axios.post("http://localhost:3002/post-delete-client", {
        idDelete: values.idDelete

    }).then((response) => {
        toast.success("Usuário deletado!");
        reloadPage()
    }).catch((error) => {
        toast.error("Erro ao deletar usuário.");
        handleCloseDModal();
    });
}
    return (
<Main icon="users" title="Clientes">
    <div class="p-3">
    <ToastContainer />
            <div className="d-flex justify-content-between flex-trick">
                <Link to="/novocliente" className="btn btn-success">
                    <i className="fa fa-plus-square px-2 pt-2"></i>
                    Novo cliente
                </Link>

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
                                <button className="btn btn-warning" value={cliente.id_clientes} onClick={handleClick}>
                                    <i className="fa fa-pencil"></i>
                                </button>
                                <button className="btn btn-danger" value={cliente.id_clientes} onClick={handleClickDel}>
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

{/* Modal Editar Clientes */}
<Modal show={showGModal} onClose={handleCloseGModal}>
    <div className="modal-content2">
        <Formik initialValues={{idCliente: idCliente, 
            nome: nome, 
            email: email, 
            telefone: telefone}}
            enableReinitialize={true} onSubmit={handleUpdate}>
            <Form action="">
                <h2>Editar Cliente</h2>
                <div className="modal-inside">
                    <div className="form-group1">
                        <label>Nome:</label>    
                        <Field name="nome"/>
                    </div>

                    <Field name="idCliente" type="hidden"/>

                    <div className="form-group1">
                        <label>Email:</label>                              
                        <Field name="email" type="text" />
                    </div>

                    <div className="form-group1">
                        <label>Telefone:</label>     
                        <Field name="telefone" type="text" >   
                                {({ field }) => (
                            <InputMask
                                {...field}
                                mask="(99) 99999-9999"
                                placeholder="(00) 00000-0000"
                                className="form-control"
                            />
                        )}      
                        </Field>                     
                    </div>
                    <button type="submit" className="btn btn-success">Salvar</button>
                </div>
            </Form>
        </Formik>
    </div>
</Modal>

{/* Modal Delete Clientes */}
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
</div>           
</Main>

    );
};
export default Clientes