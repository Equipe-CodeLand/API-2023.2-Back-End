import "reflect-metadata";
import { AppDataSource } from "./config/data-source";
import { Request, Response } from 'express';
import { buscarUsuario, cadastrarUsuario } from "./services/usuarioService";
import Usuario from "./entities/usuario.entity";
import { cadastrarCliente, criarCliente } from "./services/clienteService";
import buscarChamadosComInformacoes, { buscarChamadosComInformacoesCli, criarChamado, dropdownChamados } from "./services/chamadoService";
import buscarChamados from "./services/chamadoService";
import Chamado from "./entities/chamado.entity";
import { buscarMensagens } from "./services/mensagemService";

const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");

        app.use(cors());
        app.use(bodyParser.json());

        // Rota para verificar se o servidor está rodando
        app.get('/', (req, res) => {
            return res.json('Back-End');
        });

        // Rota para obter chamados (administrador)
        app.get('/chamados', async (req: Request, res: Response) => {
            try {
                const chamadosComInformacoes = await buscarChamadosComInformacoes();
                res.json(chamadosComInformacoes);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Erro ao obter os chamados' });
            }
        });

        app.get('/chamadosCli', async (req: Request, res: Response) => {
            try {
                const chamadosComInformacoesCli = await buscarChamadosComInformacoesCli();
                console.log(chamadosComInformacoesCli)
                res.json(chamadosComInformacoesCli);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Erro ao obter os chamados' });
            }
        });

        app.get('/chamados/:id/mensagens', (req, res) => {
            let idChamado = parseInt(req.params.id)
            buscarMensagens(idChamado)
                .then(mensagens => res.json(mensagens))
                .catch(error => {
                    console.error(error);
                    res.status(500).json({ message: 'Erro ao buscar mensagens' });
                })    
        })

        // Rota para obter informações de um usuário
        app.get('/usuarios/:id', async (req: Request, res: Response) => {
            const usuarioId = parseInt(req.params.id);
            try {
                const usuario = await buscarUsuario(usuarioId);
                res.json(usuario);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Erro ao buscar o usuário' });
            }
        });

        // Rota para cadastrar um usuário
        app.post('/usuarios', async (req: Request, res: Response) => {
            const novoUsuario = req.body; // Certifique-se de enviar os dados corretos no corpo da requisição
            try {
                const usuario = await cadastrarUsuario(new Usuario(novoUsuario.nome, novoUsuario.sobrenome, novoUsuario.cpf, novoUsuario.email, novoUsuario.telefone));
                res.json(usuario);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Erro ao cadastrar o usuário' });
            }
        });

        // Rota para cadastrar um cliente
        app.post('/clientes', async (req: Request, res: Response) => {
            const clienteId = req.body.id; // Certifique-se de enviar o ID do cliente no corpo da requisição
            try {
                const cliente = await cadastrarCliente(clienteId);
                res.json(cliente);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Erro ao cadastrar o cliente' });
            }
        });

        // Rota para criar um chamado
        app.post('/criarChamados', async (req: Request, res: Response) => {
            try {
                const chamado = await criarChamado(req);
                res.json(chamado);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Erro ao criar o chamado' });
            }
        });
        

        app.post('/dropdownChamados', async (req: Request, res: Response) => {
            try {
                const chamados = await dropdownChamados();
                res.json(chamados);
            } catch (error) {
                console.error(error);
                res.status(500).send('Ocorreu um erro ao buscar e despachar os chamados');
            }
        });        

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Express server is listening at http://localhost:${PORT}`);
        });

    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    });
