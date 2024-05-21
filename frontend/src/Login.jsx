import React from 'react'
import { Formik, Form, Field, ErrorMessage} from "formik"
import * as yup from "yup"
import { Link } from 'react-router-dom'
import { useState } from 'react'
import Axios from "axios"

function Login() {

const handleSubmit = (values) => {
   Axios.post("http://localhost:3002/login",{
    email: values.email,
    senha: values.senha
   }).then((response) => {
    console.log(response)
    })
}
    return(
        <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h2 className="d-flex justify-content-center align-items-center">Sistema de Login</h2>
                <Formik initialValues={{}} onSubmit={handleSubmit} >
                    <Form action="">
                        <div className="mb-3">
                            <label htmlFor="email">Email</label>
                            <Field type="email" placeholder="Insira seu email" className="form-control rounded-0" name="email" />
                            <ErrorMessage component="span" className="text-danger" name="email"/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="senha">Senha</label>
                            <Field type="password" placeholder="Insira sua senha" className="form-control rounded-0" name="senha" />
                            <ErrorMessage component="span" className="text-danger" name="senha"/>
                        </div>
                        <div className="m-10">
                            <button type="submit" className="btn btn-success w-100 mb-2">Login</button>
                            <Link to="/cadastro" className="btn btn-default border w-100 text-decoration-none">Cadastre-se</Link>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    )
}

export default Login