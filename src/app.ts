import "reflect-metadata";
import { AppDataSource } from "./config/data-source";
import { Request, Response } from 'express';
import { buscarUsuario, cadastrarUsuario } from "./services/usuarioService";
import Usuario from "./entities/usuario.entity";
import { cadastrarCliente, criarCliente } from "./services/clienteService";
import buscarChamadosComInformacoes, { atribuirAtendente, criarChamado } from "./services/chamadoService";
import buscarChamados from "./services/chamadoService";
import Chamado from "./entities/chamado.entity";
import { buscarMensagens } from "./services/mensagemService";
import Atendente from "./entities/atendente.entity";
import { buscarAtendentes } from "./services/atendenteService";

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

        app.get('/chamados/:id/mensagens', (req, res) => {
            let idChamado = parseInt(req.params.id)
            buscarMensagens(idChamado)
                .then(mensagens => res.json(mensagens))
                .catch(error => {
                    console.error(error);
                    res.status(500).json({ message: 'Erro ao buscar mensagens' });
                })    
        })

        app.get('/atendentes', async (req: Request, res: Response) => {
            try {
                const atendentes = await buscarAtendentes();
                res.json(atendentes);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Erro ao obter os atentendes' });
            }
        });

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

        // atribuir atendente
        app.post('http://localhost:5000/atribuirAtendente/', async (req: Request, res: Response) => {
            atribuirAtendente(req.body.chamadoId, req.body.atendenteId).then(() => {
                res.send('Atendente atribuido')
            }).catch(() => {
                res.send('erro ao atribuir atendente')
            })
        })


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
            const { idCliente, tema, desc } = req.body; // Certifique-se de enviar os dados corretos no corpo da requisição
            try {
                const chamado = await criarChamado(idCliente, tema, desc);
                res.json(chamado);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Erro ao criar o chamado' });
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

    