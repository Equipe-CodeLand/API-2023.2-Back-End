import "reflect-metadata";
import { AppDataSource } from "./config/data-source";
import { Request, Response } from 'express';
import { buscarUsuario, buscarTodosUsuarios, cadastrarUsuario } from "./services/usuarioService";
import Usuario from "./entities/usuario.entity";
import { cadastrarCliente, criarCliente, buscarTodosClientes } from "./services/clienteService";
import buscarChamadosComInformacoes, { criarChamado } from "./services/chamadoService";
import buscarChamados from "./services/chamadoService";
import Atendente from "./entities/atendente.entity";
import { buscarTodosAtendentes } from "./services/atendenteService";
import { buscarTodosAdministradores } from "./services/administradorService";
import jwt from 'jsonwebtoken';
import { generateAuthToken, getUserRoles } from "./middlewares/authenticate";
import { getRepository } from "typeorm";

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

        // rota para autenticar usuário
        app.post('/login', async (req, res) => {
            const { email, senha } = req.body;
            console.log(`Estas são as variaveis manipuladas: ${email}, ${senha}`);
            
            try {
              const userRepository = AppDataSource.getRepository(Usuario);
              const usuario = await userRepository.findOneBy({email: email})
              const tipoUser = await getUserRoles(usuario)
              console.log(tipoUser);
              
              if (!usuario || usuario.senha !== senha) {
                return res.status(401).json({ error: "Credenciais inválidas" });
              } else {
                const token = await generateAuthToken(usuario);
                console.log("O token foi criado");
                res.json({ token, tipoUser });
              }
          
            } catch (error) {
              console.error(error);
              res.status(500).json({ error: "Erro no servidor" });
            }
          });

        // Rota para obter chamados (administrador)
        app.get('/adm/chamados', async (req: Request, res: Response) => {
            try {
                const chamadosComInformacoes = await buscarChamadosComInformacoes();
                res.json(chamadosComInformacoes);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Erro ao obter os chamados' });
            }
        });

        // Rota para obter informações de um usuário
        app.get('/usuarios/:id', async (req: Request, res: Response) => {
            const usuarioId = parseInt(req.params.id);
            try {
                const usuario = await buscarUsuario(usuarioId);
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

        // Rota para pegar checar se o usuário existe na tabela do tipo e checar se a senha está correta 
        app.get('/login/:email/:password/:type', async (req: Request, res: Response) => {
            const email = req.params.email;
            const senha = req.params.password;
            const tipo = req.params.type;

            try {
                const usuario = await buscarTodosUsuarios();
                const cliente = await buscarTodosClientes();
                const atendente = await buscarTodosAtendentes();
                const administrador = await buscarTodosAdministradores();

                for (let i = 0; i < usuario.length; i++) {
                    switch (tipo){ // switch case para verificar se o usuário é do tipo que está tentando logar
                        case 'cliente':
                            for (let x = 0; x < cliente.length; x++) {
                                var validType = false
                                if (usuario[i].id == cliente[x].usuario.id) {
                                    validType = true
                                    break
                                }
                            }
                            break
                        case 'atendente':
                            for (let x = 0; x < atendente.length; x++) {
                                var validType = false
                                if (usuario[i].id == atendente[x].usuario.id) {
                                    validType = true
                                    break
                                }
                            }
                            break
                        case 'administrador':
                            for (let x = 0; x < administrador.length; x++) {
                                var validType = false
                                if (usuario[i].id == administrador[x].usuario.id) {
                                    validType = true
                                    break
                                }
                            }
                            break
                    }
                    var validUser = false
                    if (usuario[i].email == email) { // verifica se o usuário existe
                        validUser = true
                        var validPassword = false
                        if (usuario[i].senha == senha) { // verifica se a senha está correta
                            validPassword = true
                        }
                        break
                    }
                }
                res.json({validUser, validPassword, validType}); // ele retorna apenas se o usuário existe, se a senha está correta e se o tipo de usuário está correto
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Erro ao buscar o usuário' });
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
        // Rota para criar um chamado
        app.post('/chamados', async (req: Request, res: Response) => {
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
