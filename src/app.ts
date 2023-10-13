import express, { json } from 'express';
import index from './routes/index';
import { arquivarCadastro } from './controllers/CadastroUser';
import { pegarChamado } from './controllers/chamadosAten';
import { arquivarCadastroCli } from './controllers/cadastroCliente';
const db = require("./config/database.js");
const cors = require('cors')

const app = express();
const port = 5000;

app.use(cors())
app.use(json())

app.get('/',(req,res)=>{
    return res.json('Back-End')
})

app.get('/ChamadosAtendente',(req,res)=>{
    pegarChamado()
    .then(resultado=>{
        res.send(resultado)
    })
});

app.post('/cadastroCli', (req, res) => {
    console.log(req.body);
    arquivarCadastroCli(req.body.nome,req.body.sobrenome,req.body.cpf,req.body.email,req.body.telefone,req.body.tema,req.body.mensagem,
    );
  });

app.post('/cadastroUser', (req, res) => {
    console.log(req.body);
    arquivarCadastro(req.body.nome,req.body.sobrenome,req.body.cpf,req.body.email,req.body.tipo,req.body.telefone,req.body.turno, 
    );
  });

/*app.get('/chamados', (req, res) => {
    const sql = 'SELECT * FROM atendente';

    db.query(sql, (err, data) => {
        if (err) {
            return res.json(err);
        }

        return res.json(data);
    });
});*/
app.listen(port, () => {
    console.log(`Express server is listening at http://localhost:${port}`);
});