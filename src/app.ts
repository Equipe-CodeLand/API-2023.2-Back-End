import "reflect-metadata";
import { AppDataSource } from "./config/data-source";
import { arquivarCadastro } from './controllers/CadastroUser';
//import { arquivarCadastroCli } from './controllers/cadastroCliente';
import { obterChamados } from './controllers/chamadosAdm';
import { Request, Response } from 'express';
import { buscarTodosChamados } from "./services/repositorioService";
import { criarChamado } from "./services/chamadoService";

const express = require('express')

const app = express();

const cors = require('cors');

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
        app.use(bodyParser.json());
        
        app.get('/adm/chamados', async (req: Request, res: any) => {
            try {
                const chamados = await buscarTodosChamados();
                console.log(chamados);
                res.send(chamados); // Envie a lista de chamados como resposta
            } catch (error) {
                console.error(error.message);
                res.status(500).send({ message: 'Erro ao obter os chamados' });
            }
        });                  
        async function testarBuscarTodosChamados() {
            try {
                const chamados = await buscarTodosChamados();
                console.log(chamados); // Isso imprimirá a lista de chamados no console
            } catch (error) {
                console.error(error.message);
            }
        }
        
        // Chame a função de teste
        testarBuscarTodosChamados();
        
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
        criarChamado(6, 'internet lenta', 'minha internet ta lenta').then(chamado => {
            console.log(chamado)
        })
        
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })


const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Rota para verificar se o servidor está rodando
app.get('/', (req, res) => {
    return res.json('Back-End');
});

// Rota para obter chamados (administrador)
/*app.get('/adm/chamados', async (req, res) => {
    try {
        const chamados = await obterChamados();
        res.json(chamados);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter os chamados' });
    }
});

// Rota para pegar chamados (atendente)
/*app.get('/ChamadosAtendente', (req, res) => {
    pegarChamado()
    .then(resultado => {
        res.send(resultado)
    })
});*/

// Rota para cadastrar cliente
/*app.post('/cadastro/cliente', (req, res) => {
    console.log(req.body);
    arquivarCadastroCli(req.body.nome, req.body.sobrenome, req.body.cpf, req.body.email, req.body.telefone, req.body.tema, req.body.mensagem, req.body.res);
});

// Rota para cadastrar usuário
app.post('/cadastroUser', (req, res) => {
    console.log(req.body);
    arquivarCadastro(req.body.nome, req.body.sobrenome, req.body.cpf, req.body.email, req.body.tipo, req.body.telefone, req.body.turno);
});*/

app.listen(PORT, () => {
    console.log(`Express server is listening at http://localhost:${PORT}`);
});
