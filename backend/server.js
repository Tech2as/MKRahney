const express = require("express");
const mysql = require("mysql");
const app = express();
const cors = require('cors')

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "users"
});

app.use(express.json())
app.use(cors())

app.post('/registro', (req, res) => {
    const nome = req.body.nome
    const email = req.body.email
    const senha = req.body.senha

    db.query("SELECT * FROM usuario WHERE email= ?", [email], 
    (err,result) => {
        if(err) {
            res.send(err)
        }
        if(result.length == 0) {
            db.query("INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)", [nome, email, senha], (err, response) =>{
                if(err) {
                    res.send(err)
                }
                res.send({msg: "Cadastrado com sucesso"})
            })
        }else {
            res.send({msg: "Usuário já cadastrado"})
        }
    });
})

app.post("/login", (req,res) => {
    const email = req.body.email
    const senha = req.body.senha

    db.query("SELECT * FROM usuario WHERE email = ? AND senha = ?", [email, senha], (err, result) => {
        if(err) {
            res.send(err)
        }
       if(result.length > 0) {
            res.send({msg: "Usuário logado com sucesso"})
       } else {
            res.send({msg: "Usuário não encontrado"})
       }
    });
})

app.post("/register-client", (req, res) => {
    const nome = req.body.nome
    const email = req.body.email
    const telefone = req.body.telefone

    const query = "INSERT INTO clientes (nome, email, telefone) VALUES (?, ?, ?)";

    db.query(query, [nome, email, telefone], (err, result) => {
        if (err) {
            console.error("Error", err);
            return res.status(500).json({ error: "Falha" });
        }
        res.status(201).json({ message: "Cliente registrado com sucesso"});
    });
})

app.get("/search-client", (req, res) => {
    const sql = 'SELECT id_clientes,nome, email, telefone FROM clientes';
    db.query(sql, (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(results);
    });
});

// Vendas

app.post("/register-sale", (req, res) => {
    const clienteId = req.body.clienteId
    const produto = req.body.produto
    const valor = req.body.valor

    const query = "INSERT INTO vendas (id_clientes, produto, valor) VALUES (?, ?, ?)";

    db.query(query, [clienteId, produto, valor], (err, result) => {
        if (err) {
            console.error("Error", err);
            return res.status(500).json({ error: "Falha" });
        }
        res.status(201).json({ message: "Venda registrada com sucesso"});
    });
})

app.get("/search-sale", (req, res) => {
    const sql = 'SELECT * FROM vendas JOIN clientes ON vendas.id_clientes = clientes.id_clientes';
    db.query(sql, (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(results);
    });
});

app.get("/get-sale", (req, res) => {
    const id = req.query.id;
    //console.log(`ID recebido: ${id}`); // Log para verificar o ID recebido

    const sql = 'SELECT * FROM vendas JOIN clientes ON vendas.id_clientes = clientes.id_clientes WHERE vendas.id = ?';
    
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erro na consulta SQL:', err); // Log para erro na consulta
            return res.status(500).send(err);
        }
        console.log('Resultados da consulta:', results); // Log para resultados da consulta
        res.json(results);
    });
});
app.listen(3002, () =>{
    console.log("Rodando na porta 3002")
}) 