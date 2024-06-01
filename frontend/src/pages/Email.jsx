import React, { useState, useEffect } from 'react'
import Main from "../components/template/Main"
import Axios from "axios"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as yup from "yup"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'

const Email = () => {
// navigate
const navigate = useNavigate();

// parte do cliente
const [clientes, setClientes] = useState([]);
const [selectedEmail, setSelectedEmail] = useState('');

// mudar o button 
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = (values) => {
    if (!values.email || !values.mensagem) {
        toast.error("Por favor, preencha todos os campos.");
        return;
    }
    setIsSubmitting(true);

    console.log('Preparando para enviar email...');
    Axios.post("http://localhost:3002/send-email", {
        email: values.email,
        mensagem: values.mensagem
    })
    .then((response) => {
        toast.success("Email mandado com sucesso!");
        navigate("/");
    })
    .catch((error) => {
        if (error.response && error.response.data && error.response.data.error) {
            toast.error(`Erro: ${error.response.data.error}`);
        } else {
            toast.error("Erro ao enviar o email.");
        }
    });
};

useEffect(() => {
    Axios.get('http://localhost:3002/search-client-invendas')
    .then(response => {
        setClientes(response.data);
    })
    .catch(error => {
    console.error('Houve um erro ao buscar os dados do cliente:', error);
    });
}, []);

return(
<Main icon="envelope" title="Email">
    <div className="p-3">
<ToastContainer />
    <div className="container-new">
        <div className="content-new">
            <Formik initialValues={{ cliente: '', email: '', mensagem: '' }} onSubmit={handleSubmit}
             validationSchema=""> 
              {({ setFieldValue }) => (
                <Form className="form-profile">

                    <label>Cliente:</label>
                    <Field as="select" name="cliente" onChange={(e) => {
                        const selectedClient = clientes.find(cliente => cliente.id_clientes === parseInt(e.target.value));
                        if (selectedClient) {
                            setFieldValue('email', selectedClient.email);
                        } else {
                            setFieldValue('email', '');
                        }
                        setFieldValue('cliente', e.target.value);
                    }}>
                        <option value="">Selecione um cliente</option>
                        {clientes.map((cliente, index) => (
                        <option key={index} value={cliente.id_clientes}>
                        {cliente.nome}
                        </option>
            
                        ))}
                    </Field>
                    <ErrorMessage component="span" className="text-danger" name="nome"/>

                    <label>Email:</label>
                    <Field type="text" name="email" disabled/>
                    <ErrorMessage component="span" className="text-danger" name="email"/>

                    <label>Mensagem:</label>
                    <Field as="textarea" name="mensagem"/>
                    <ErrorMessage component="span" className="text-danger" name="mensagem"/>

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Enviando...' : 'Enviar'}
                    </button>                     
                    </Form>
                       )}
                </Formik>
            </div>
    </div>

    </div>
</Main>

);
};


export default Email