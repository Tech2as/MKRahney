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

// Clientes
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
    const sql = 'SELECT * FROM clientes';
    db.query(sql, (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(results);
    });
});

app.get("/get-client", (req, res) => {
   const id = req.query.id;

   const sql = 'SELECT * FROM clientes WHERE id_clientes = ?';
   db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erro na consulta SQL:', err); // Log para erro na consulta
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

app.get("/get-delete-client", (req, res) => {
    const id = req.query.id;
    const sql = 'SELECT id_clientes FROM clientes WHERE id_clientes = ?';
    
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erro na consulta SQL:', err);
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

app.post("/post-delete-client", (req, res) => {
    const idDelete = req.body.idDelete

    const sql = "DELETE FROM clientes WHERE id_clientes = ?";

    db.query(sql, [idDelete], (err, result) => {
        if (err) {
            console.error("Error", err);
            return res.status(500).json({ error: "Falha" });
        }
        res.status(201).json({ message: "Usuário deletado com sucesso!"});
    });
})

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

app.post("/update-client", (req, res) => {
    const idCliente = req.body.idCliente
    const nome = req.body.nome
    const email = req.body.email
    const telefone = req.body.telefone

    const query = "UPDATE clientes SET nome = ?, email = ?, telefone = ? WHERE id_clientes = ?";

    db.query(query, [nome, email, telefone, idCliente], (err, result) => {
        if (err) {
            console.error("Error", err);
            return res.status(500).json({ error: "Falha" });
        }
        res.status(201).json({ message: "Usuário atualizado com sucesso"});
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
    const sql = 'SELECT * FROM vendas JOIN clientes ON vendas.id_clientes = clientes.id_clientes WHERE vendas.id = ?';
    
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erro na consulta SQL:', err); // Log para erro na consulta
            return res.status(500).send(err);
        }

        res.json(results);
    });
});

app.post("/update-sale", (req, res) => {
    const clienteId = req.body.clienteId
    const produto = req.body.produto
    const valor = req.body.valor
    const idVendas = req.body.idVendas

    const query = "UPDATE vendas SET id_clientes = ?, produto = ?, valor = ? WHERE id = ?";

    db.query(query, [clienteId, produto, valor, idVendas], (err, result) => {
        if (err) {
            console.error("Error", err);
            return res.status(500).json({ error: "Falha" });
        }
        res.status(201).json({ message: "Venda registrada com sucesso"});
    });
})

app.get("/get-delete", (req, res) => {
    const id = req.query.id;
    const sql = 'SELECT id FROM vendas WHERE id = ?';
    
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erro na consulta SQL:', err);
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

app.post("/post-delete", (req, res) => {
    const idDelete = req.body.idDelete

    const sql = "DELETE FROM VENDAS WHERE id = ?";

    db.query(sql, [idDelete], (err, result) => {
        if (err) {
            console.error("Error", err);
            return res.status(500).json({ error: "Falha" });
        }
        res.status(201).json({ message: "Usuário deletado com sucesso!"});
    });
})

app.listen(3002, () =>{
    console.log("Rodando na porta 3002")
}) 