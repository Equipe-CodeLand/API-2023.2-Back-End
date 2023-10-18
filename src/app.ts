import express, { json } from 'express';
import index from './routes/index';
import "reflect-metadata";
import { AppDataSource } from "./config/data-source";
import { arquivarCadastro } from './controllers/CadastroUser';
import { pegarChamado } from './controllers/chamadosAten';
import { arquivarCadastroCli } from './controllers/cadastroCliente';
import { buscarUsuario, cadastrarUsuario } from './services/usuario.service';
import { criarChamado } from './services/chamado.service';


const db = require("./config/database.ts");
const cors = require('cors')
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

AppDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
        
        // buscarUsuario(1).then(usuario => console.log(usuario))
        
        /* cadastrarUsuario(new Usuario('nome', 'sobrenome', '455.558.687-12', 'teste@email.com', '129845548')).then(usuario => {
            console.log(usuario)
        }) */
        /* cadastrarCliente(1).then(cliente => {
            console.log(cliente)
        }) */
        /* criarCliente(new Usuario('nome 2', 'sobrenome 2', '455.558.687-12', 'teste@email.com', '129845548')).then(usuario => {
            console.log(usuario)
        }) */
        /* criarChamado(6, 'internet lenta', 'minha internet ta lenta').then(chamado => {
            console.log(chamado)
        }) */
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

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


app.post('/cadastro/cliente', (req, res) => {
    console.log(req.body);
    arquivarCadastroCli(req.body.nome,req.body.sobrenome,req.body.cpf,req.body.email,req.body.telefone,req.body.tema,req.body.mensagem,req.body.res);
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
app.listen(PORT, () => {
    console.log(`Express server is listening at http://localhost:${PORT}`);
});