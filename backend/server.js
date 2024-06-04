const express = require("express");
const mysql = require("mysql");
const app = express();
const cors = require('cors')
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "users"
});

app.use(express.json())
app.use(cors())
const SECRET_KEY = 'teste';
// Login e cadastro

// Rota de registro
app.post('/registro', (req, res) => {
    const { nome, email, senha } = req.body;
    const hashedPassword = bcrypt.hashSync(senha, 8);

    db.query(
        'INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)',
        [nome, email, hashedPassword],
        (err, results) => {
            if (err) {
                console.error("Erro no servidor durante o registro:", err);
                return res.status(500).send({ success: false, message: 'Erro no servidor.' });
            }
            res.status(201).send({ success: true, message: 'Usuário registrado com sucesso!' });
        }
    );
});

// Rota de login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    db.query('SELECT * FROM usuario WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error("Erro no servidor:", err);
            return res.status(500).send('Erro no servidor.');
        }
        if (results.length === 0) {
            return res.status(404).send('Usuário não encontrado.');
        }

        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(senha, user.senha);
        if (!passwordIsValid) {
            return res.status(401).send({ auth: false, token: null });
        }

        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: 86400 }); // 24 horas
        res.status(200).send({ auth: true, token: token });
    });
});

const verifyJWT = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).send({ auth: false, message: 'Nenhum token fornecido.' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Falha ao autenticar token.' });
        }
        req.userId = decoded.id;
        next();
    });
};


// Rota protegida de exemplo
app.get('/me', (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).send({ auth: false, message: 'Token não fornecido.' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Falha na autenticação do token.' });
        }

        db.query('SELECT * FROM usuario WHERE id = ?', [decoded.id], (err, results) => {
            if (err) {
                return res.status(500).send('Erro no servidor.');
            }
            if (results.length === 0) {
                return res.status(404).send('Usuário não encontrado.');
            }

            res.status(200).send(results[0]);
        });
    });
});

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

app.get("/search-client-invendas", (req, res) => {
    const sql = 'SELECT * FROM clientes';
    db.query(sql, (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(results);
    });
});

app.get("/search-client", (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    const offset = (page - 1) * limit;

    const sql = 'SELECT * FROM clientes LIMIT ? OFFSET ?';
    db.query(sql, [parseInt(limit), parseInt(offset)], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        const countSql = 'SELECT COUNT(*) AS count FROM clientes';
        db.query(countSql, (countErr, countResults) => {
            if (countErr) {
                return res.status(500).send(countErr);
            }

            res.json({
                data: results,
                total: countResults[0].count,
                page: parseInt(page),
                limit: parseInt(limit)
            });
        });
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

app.get("/search-client-query", (req, res) => {
    const searchTerm = req.query.query;

    let sql;
    let params = [];
  
    if (searchTerm) {
      sql = 'SELECT * FROM `clientes` WHERE nome LIKE ? OR email LIKE ?';
      const searchQuery = `%${searchTerm}%`;
      params = [searchQuery, searchQuery];
    } else {
      sql = 'SELECT * FROM `clientes`';
    }
  
    db.query(sql, params, (err, results) => {
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
    const { page = 1, limit = 5 } = req.query;
    const offset = (page - 1) * limit;

    const sql = `SELECT * FROM vendas JOIN clientes ON vendas.id_clientes = clientes.id_clientes LIMIT ? OFFSET ?`;
    const countSql = 'SELECT COUNT(*) AS total FROM vendas JOIN clientes ON vendas.id_clientes = clientes.id_clientes';

    db.query(sql, [parseInt(limit), parseInt(offset)], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        db.query(countSql, (countErr, countResults) => {
            if (countErr) {
                return res.status(500).send(countErr);
            }

            res.json({
                data: results,
                total: countResults[0].total,
                page: parseInt(page),
                limit: parseInt(limit)
            });
        });
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

app.get("/search-sale-query", (req, res) => {
    const searchTerm = req.query.query;

    let sql;
    let params = [];
  
    if (searchTerm) {
      sql = 'SELECT * FROM vendas JOIN clientes ON vendas.id_clientes = clientes.id_clientes WHERE clientes.nome LIKE ? OR vendas.produto LIKE ?';
      const searchQuery = `%${searchTerm}%`;
      params = [searchQuery, searchQuery];
    } else {
      sql = 'SELECT * FROM vendas JOIN clientes ON vendas.id_clientes = clientes.id_clientes';
    }
  
    db.query(sql, params, (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(results);
    });
  });

// email
app.post("/send-email", (req, res) => {
    const { email, mensagem } = req.body;

    if (!email || !mensagem) {
        return res.status(400).json({ error: 'Email e mensagem são obrigatórios.' });
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'joaoacademicotech@gmail.com',
            pass: 'melm qcxb vgas lslm',
        },
    });

    const mailOptions = {
        from: 'joaoacademicotech@gmail.com',
        to: email,
        subject: "Mensagem da MK Rahney",
        text: mensagem,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ error: 'Erro ao enviar o email.' });
        } else {
            return res.status(200).json({ message: 'Email enviado com sucesso.' });
        }
    });
});

// Rotas do home

app.get("/get-vendas-home", (req, res) => {
    const sql = 'SELECT COUNT(*) AS count FROM vendas';
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro na consulta SQL:', err);
            return res.status(500).send(err);
        }
        res.json(results[0]);  
    });
});

app.get("/get-clientes-home", (req, res) => {
    const sql = 'SELECT COUNT(*) AS count FROM clientes';
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro na consulta SQL:', err);
            return res.status(500).send(err);
        }
        res.json(results[0]); 
    });
});

app.get("/get-receita-home", (req, res) => {
    const sql = 'SELECT SUM(valor) AS valor FROM vendas';
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro na consulta SQL:', err);
            return res.status(500).send(err);
        }
        res.json(results[0]); 
    });
});

app.listen(3002, () =>{
    console.log("Rodando na porta 3002")
}) 
