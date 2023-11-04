import "reflect-metadata";
import { AppDataSource } from "./config/data-source";
import { Request, Response } from 'express';
import { buscarUsuario, buscarTodosUsuarios, cadastrarUsuario } from "./services/usuarioService";
import Usuario from "./entities/usuario.entity";
import { criarCliente } from "./services/clienteService";
import buscarChamadosComInformacoes, { atribuirAtendente, andamentoChamado, buscarChamadosComInformacoesCli, criarChamado, dropdownChamados, finalizarChamado, buscarChamadosAtendente } from "./services/chamadoService";
import buscarChamados from "./services/chamadoService";
import Chamado from "./entities/chamado.entity";
import { buscarMensagens, enviarMensagem } from "./services/mensagemService";
import Atendente from "./entities/atendente.entity";
import { buscarAtendentes, buscarTodosAtendentes, criarAtendente } from "./services/atendenteService";
import { buscarTodosAdministradores, criarAdministrador } from "./services/administradorService";
import jwt from 'jsonwebtoken';
import { authenticate, authorize, generateAuthToken, getUserRoles } from "./middlewares/authenticate";

const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    }).catch((err) => {
        console.error("Error during Data Source initialization:", err)
    });
  
// Rota para verificar se o servidor está rodando
app.get('/',(req, res) => {
    return res.json('Back-End');
});

// Rota para buscar mensagens(passando o id do chamado)
app.get('/chamados/:id/mensagens', (req, res) => {
    let idChamado = parseInt(req.params.id)
    buscarMensagens(idChamado)
        .then(mensagens => res.json(mensagens))
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Erro ao buscar mensagens' });
        })    
})

// rota para autenticar usuário
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
      const userRepository = AppDataSource.getRepository(Usuario);
      const usuario = await userRepository.findOneBy({email: email})
      const tipoUser = await getUserRoles(usuario)

      if (!usuario || usuario.senha !== senha) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      } else {
        const token = await generateAuthToken(usuario);
        res.json({ token, tipoUser });
      }

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro no servidor" });
    }
  });

// atribuir atendente
app.post('/atribuirAtendente', async (req: Request, res: Response) => {
    atribuirAtendente(req.body.chamadoId, req.body.atendenteId).then(() => {
        res.send('Atendente atribuido')
    }).catch(() => {
        res.send('erro ao atribuir atendente')
    })
})

// Rota para obter chamados (administrador)
app.get('/chamados', authenticate, authorize(['Administrador']), async (req: Request, res: Response) => {
    try {
        const chamadosComInformacoes = await buscarChamadosComInformacoes();
        res.json(chamadosComInformacoes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao obter os chamados' });
    }
});

// Rota para obter chamados (atendente)
app.get('/chamadosAte', authenticate, authorize(['Atendente']), async (req: Request, res: Response) => {
    try {
        const chamadosAte = await buscarChamadosComInformacoes();
        res.json(chamadosAte);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao obter os chamados' });
    }
});

app.get('/atendenteChamados/:userId', (req, res) => {
    buscarChamadosAtendente(req.params.userId)
        .then(chamados => {
            res.json(chamados)
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ message: 'Erro ao obter os chamados' });
        })
})


app.get('/atendentes', async (req, res)=>{
    const atendentes = await buscarAtendentes()
    res.json(atendentes)
})
        
// Rota para obter chamados (cliente)
app.get('/chamadosCli', authenticate, authorize(['Cliente']), async (req: Request, res: Response) => {
    try {
        const chamadosComInformacoesCli = await buscarChamadosComInformacoesCli();
        console.log(chamadosComInformacoesCli)
        res.json(chamadosComInformacoesCli);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao obter os chamados' });
    }
});

// Rota para obter informações de um usuário
app.get('/usuarios/:id',async (req: Request, res: Response) => {
    const usuarioId = parseInt(req.params.id);
    try {
        const usuario = await buscarUsuario(usuarioId);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar o usuário' });
    }
});

// Rota para cadastrar um usuário
app.post('/usuarios', authenticate, authorize(['Administrador']), async (req: Request, res: Response) => {
    const novoUsuario = req.body; // Certifique-se de enviar os dados corretos no corpo da requisição
    try {
        const usuario = await cadastrarUsuario(new Usuario(novoUsuario.nome, novoUsuario.sobrenome, novoUsuario.cpf, novoUsuario.email, novoUsuario.telefone, novoUsuario.senha))
        res.json(usuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao cadastrar o usuário' });
    }
});

// Rota para cadastrar um cliente
/*app.post('/clientes', async (req: Request, res: Response) => {
    const clienteId = req.body.id; // Certifique-se de enviar o ID do cliente no corpo da requisição
    try {
        const cliente = await cadastrarCliente(clienteId);
        res.json(cliente);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao cadastrar o cliente' });
    }
});*/

// Rota para cadastro do cliente (formulário)
app.post('/cadastro/cliente', async (req: Request, res: Response)=>{
    try {                
        // Crie um novo objeto de Usuario com os dados do corpo da requisição
        const novoUsuario = new Usuario(req.body.nome, req.body.sobrenome, req.body.cpf, req.body.email, req.body.telefone, req.body.senha);
    
        // Chame a função criarCliente passando o novo usuário
        const clienteCriado = await criarCliente(novoUsuario);
    
        // Retorne a resposta para o cliente
        res.json(clienteCriado);
      } catch (error) {
        res.status(500).json({ message: 'Erro ao criar cliente' });
      }
  })

  app.post('/cadastro/atendente',async (req,res)=>{
    try{
        const novoUsuario = new Usuario(req.body.nome, req.body.sobrenome, req.body.cpf, req.body.email, req.body.telefone, req.body.senha);
        const atendenteCriado = await criarAtendente(req.body.turno, novoUsuario);
        res.json(atendenteCriado)
    }catch(error){
        res.status(500).json({ message: 'Erro ao criar atendente' });
    }
  })


  // Rota para criar administrador
  app.post('/cadastro/administrador', async (req,res)=>{
    try{
        const novoUsuario = new Usuario(req.body.nome, req.body.sobrenome, req.body.cpf, req.body.email, req.body.telefone, req.body.senha);
        const adminCriado = await criarAdministrador(novoUsuario);
        res.json(adminCriado)
    }catch(error){
        res.status(500).json({mesaage: 'Erro ao criar o administrador'})
    }
  })
// Rota para criar um chamado
app.post('/criarChamados', authenticate, authorize(['Cliente']), async (req: Request, res: Response) => {
    try {
        const chamado = await criarChamado(req);
        res.json(chamado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar o chamado' });
    }
});

//
app.post('/dropdownChamados', async (req: Request, res: Response) => {
    try {
        const chamados = await dropdownChamados();
        res.json(chamados);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocorreu um erro ao buscar e despachar os chamados');
    }
});        

// Rota para obter informações de um usuário
app.get('/usuarios/:id', authenticate, authorize(['Administrador', 'Atendente']), async (req: Request, res: Response) => {
    const usuarioId = parseInt(req.params.id);
    try {
        const usuario = await buscarUsuario(usuarioId);
        res.json(usuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar o usuário' });
    }
});

// Rota para enviar mensagens no chamado
app.post('/chamado/enviarMensagem', async (req: Request, res: Response) => {
    try{        
        const { texto, idChamado, idUsuario, tipoUsuario } = req.body;
        const chamado = await enviarMensagem(texto, idChamado, idUsuario, tipoUsuario);
        res.json(chamado);
    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Erro ao enviar mensagem no chamado'})
    }
  })

// Rota para finalizar (cancelar/concluir) chamado
  app.put('/chamado/finalizarChamado', async (req: Request, res: Response) => {
    try{        
        const { idChamado, idStatus } = req.body;
        const chamado = await finalizarChamado(idChamado, idStatus);
        res.json(chamado);
    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Erro ao finalizar chamado'})
    }
  })

  // Rota para aterar status para Em Andamento
  app.put('/chamado/andamentoChamado', async (req: Request, res: Response) => {
    try{        
        const { idChamado } = req.body;
        const chamado = await andamentoChamado(idChamado);
        res.json(chamado);
    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Erro ao finalizar chamado'})
    }
  })

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Express server is listening at http://localhost:${PORT}`);
});
