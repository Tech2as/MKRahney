import React from "react"
import Main from "../components/template/Main"
import { useNavigate } from 'react-router-dom'
import {  ToastContainer, toast  } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Formik, Form, Field, ErrorMessage} from "formik"
import InputMask from 'react-input-mask';
import * as yup from "yup"
import Axios from "axios"

const NovoClientes = () => {
    const navigate = useNavigate();
const handleSubmit = (values) => {
    Axios.post("http://localhost:3002/register-client",{
     nome: values.nome,
     email: values.email,
     telefone: values.telefone
    }).then((response) => {
        toast.success("Cliente registrado!");
        setTimeout(() => {
          navigate('/clientes');
        }, 1000); // Aguarda 1 segundos antes de navegar
     })
 }
 

 const validationRegister = yup.object().shape({
    nome: yup.string().required("Este campo é obrigatório"),
    email: yup.string().email("Não é um email").required("Este campo é obrigatório"),
    telefone: yup.string().required("Este campo é obrigatório"),
})

return (
<Main icon="money" title="Novos clientes">
    <div className="p-3">
    <ToastContainer />
    <div className="container-new">
        <div className="content-new">
            <Formik initialValues={{}} onSubmit={handleSubmit}
             validationSchema={validationRegister}> 
                <Form className="form-profile"action="">
                    <label>Nome cliente:</label>
                        <Field type="text" name="nome"/>
                        <ErrorMessage component="span" className="text-danger" name="nome"/>

                    <label>Email:</label>
                        <Field type="email" name="email"/>
                        <ErrorMessage component="span" className="text-danger" name="email"/>

                    <label>Telefone:</label>
                        <Field type="text" name="telefone">
                                {({ field }) => (
                            <InputMask
                                {...field}
                                mask="(99) 99999-9999"
                                placeholder="(00) 00000-0000"
                                className="form-control"
                            />
                                )}
                        </Field>
                        <ErrorMessage component="span" className="text-danger" name="telefone"/>

                        <button type="submit">Registrar</button>                      
                    </Form>
                </Formik>
            </div>
    </div>
    </div>
</Main>
);
};
export default NovoClientes