import { Router, Request, Response } from 'express';
import { buscarMensagens, enviarMensagem } from '../services/mensagemService';
import { AppDataSource } from '../config/data-source';
import Usuario from '../entities/usuario.entity';
import { authenticate, authorize, generateAuthToken, getUserRoles } from '../middlewares/authenticate';
import buscarChamadosComInformacoes, { andamentoChamado, atribuirAtendente, buscarChamadosAtendente, buscarChamadosCliente, criarChamado, dropdownChamados, finalizarChamado } from '../services/chamadoService';
import { buscarAtendentes, criarAtendente } from '../services/atendenteService';
import { buscarUsuario, cadastrarUsuario } from '../services/usuarioService';
import { criarCliente } from '../services/clienteService';
import { criarAdministrador } from '../services/administradorService';
import { buscarProblemas, deletarProblemas, enviarProblema, atualizarProblemas, atualizarSolucoes, deletarSolucoes } from '../services/problemaService';

const router = Router();

// Rota para verificar se o servidor está rodando
router.get('/', (req, res) => {
    return res.json('Back-End');
});

// Rota para buscar mensagens(passando o id do chamado)
router.get('/chamados/:id/mensagens', (req, res) => {
    let idChamado = parseInt(req.params.id)
    buscarMensagens(idChamado)
        .then(mensagens => res.json(mensagens))
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Erro ao buscar mensagens' });
        })
})

// rota para autenticar usuário
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const userRepository = AppDataSource.getRepository(Usuario);
        const usuario = await userRepository.findOneBy({ email: email })
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
router.post('/atribuirAtendente', async (req: Request, res: Response) => {
    atribuirAtendente(req.body.chamadoId, req.body.atendenteId).then(() => {
        res.send('Atendente atribuido')
    }).catch(() => {
        res.send('erro ao atribuir atendente')
    })
})

// Rota para obter chamados (administrador)
router.get('/chamados/:tema/:status/:prioridade', authenticate, authorize(['Administrador']), async (req: Request, res: Response) => {
    try {
        const { tema, status, prioridade } = req.params;

        const parseParam = (param: string | undefined) => {
            const paramSemNome = param?.split('=')[1];
            return paramSemNome ? paramSemNome.split(',').map(value => Number(value.trim())) : [];
        };

        const temaArray = parseParam(tema);
        const statusArray = parseParam(status);
        const prioridadeArray = parseParam(prioridade);

        const chamadosComInformacoes = await buscarChamadosComInformacoes(temaArray, statusArray, prioridadeArray);
        res.json(chamadosComInformacoes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao obter os chamados' });
    }
});

// Rota para obter chamados (atendente)
router.get('/chamadosAte/:tema/:status/:prioridade', authenticate, authorize(['Atendente']), async (req: Request, res: Response) => {
    try {
        const { tema, status, prioridade } = req.params;

        const parseParam = (param: string | undefined) => {
            const paramSemNome = param?.split('=')[1];
            return paramSemNome ? paramSemNome.split(',').map(value => Number(value.trim())) : [];
        };

        const temaArray = parseParam(tema);
        const statusArray = parseParam(status);
        const prioridadeArray = parseParam(prioridade);

        const chamadosAte = await buscarChamadosComInformacoes(temaArray, statusArray, prioridadeArray);
        res.json(chamadosAte);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao obter os chamados' });
    }
});

router.get('/atendenteChamados/:userId/:tema/:status/:prioridade', (req, res) => {
    const { tema, status, prioridade } = req.params;

    const parseParam = (param: string | undefined) => {
        const paramSemNome = param?.split('=')[1];
        return paramSemNome ? paramSemNome.split(',').map(value => Number(value.trim())) : [];
    };

    const temaArray = parseParam(tema);
    const statusArray = parseParam(status);
    const prioridadeArray = parseParam(prioridade);

    buscarChamadosAtendente(req.body.userId, temaArray, statusArray, prioridadeArray)
        .then(chamados => {
            res.json(chamados)
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ message: 'Erro ao obter os chamados' });
        })
})


router.get('/atendentes', async (req, res) => {
    const atendentes = await buscarAtendentes()
    res.json(atendentes)
})

// Rota para obter chamados (cliente)
router.get('/chamadosCli/:userId/:tema/:status/:prioridade', authenticate, authorize(['Cliente']), (req, res) => {
    const { tema, status, prioridade } = req.params;

    const parseParam = (param: string | undefined) => {
        const paramSemNome = param?.split('=')[1];
        return paramSemNome ? paramSemNome.split(',').map(value => Number(value.trim())) : [];
    };

    const temaArray = parseParam(tema);
    const statusArray = parseParam(status);
    const prioridadeArray = parseParam(prioridade);

    console.log(req.body.userId);
    buscarChamadosCliente(req.body.userId, temaArray, statusArray, prioridadeArray)
        .then(chamados => {
            res.json(chamados)
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ message: 'Erro ao obter os chamados' });
        })
});

// Rota para obter informações de um usuário
router.get('/usuarios/:id', async (req: Request, res: Response) => {
    const usuarioId = parseInt(req.params.id);
    try {
        const usuario = await buscarUsuario(usuarioId);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar o usuário' });
    }
});

// Rota para cadastrar um usuário
router.post('/usuarios', authenticate, authorize(['Administrador']), async (req: Request, res: Response) => {
    const novoUsuario = req.body; // Certifique-se de enviar os dados corretos no corpo da requisição
    try {
        const usuario = await cadastrarUsuario(new Usuario(novoUsuario.nome, novoUsuario.sobrenome, novoUsuario.cpf, novoUsuario.email, novoUsuario.telefone, novoUsuario.senha))
        res.json(usuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao cadastrar o usuário' });
    }
});

// Rota para cadastro do cliente (formulário)
router.post('/cadastro/cliente', async (req: Request, res: Response) => {
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

router.post('/cadastro/atendente', async (req, res) => {
    try {
        const novoUsuario = new Usuario(req.body.nome, req.body.sobrenome, req.body.cpf, req.body.email, req.body.telefone, req.body.senha);
        const atendenteCriado = await criarAtendente(req.body.turno, novoUsuario);
        res.json(atendenteCriado)
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar atendente' });
    }
})


// Rota para criar administrador
router.post('/cadastro/administrador', async (req, res) => {
    try {
        const novoUsuario = new Usuario(req.body.nome, req.body.sobrenome, req.body.cpf, req.body.email, req.body.telefone, req.body.senha);
        const adminCriado = await criarAdministrador(novoUsuario);
        res.json(adminCriado)
    } catch (error) {
        res.status(500).json({ mesaage: 'Erro ao criar o administrador' })
    }
})
// Rota para criar um chamado
router.post('/criarChamados', authenticate, authorize(['Cliente']), async (req: Request, res: Response) => {
    try {
        const chamado = await criarChamado(req);
        res.json(chamado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar o chamado' });
    }
});

//
router.post('/dropdownChamados', async (req: Request, res: Response) => {
    try {
        const chamados = await dropdownChamados();
        res.json(chamados);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocorreu um erro ao buscar e despachar os chamados');
    }
});

// Rota para obter informações de um usuário
router.get('/usuarios/:id', authenticate, authorize(['Administrador', 'Atendente']), async (req: Request, res: Response) => {
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
router.post('/chamado/enviarMensagem', async (req: Request, res: Response) => {
    try {
        const { texto, idChamado, idUsuario, tipoUsuario } = req.body;
        const chamado = await enviarMensagem(texto, idChamado, idUsuario, tipoUsuario);
        res.json(chamado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao enviar mensagem no chamado' })
    }
})

// Rota para finalizar (cancelar/concluir) chamado
router.put('/chamado/finalizarChamado', async (req: Request, res: Response) => {
    try {
        const { idChamado, idStatus } = req.body;
        const chamado = await finalizarChamado(idChamado, idStatus);
        res.json(chamado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao finalizar chamado' })
    }
})

// Rota para aterar status para Em Andamento
router.put('/chamado/andamentoChamado', async (req: Request, res: Response) => {
    try {
        const { idChamado } = req.body;
        const chamado = await andamentoChamado(idChamado);
        res.json(chamado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao finalizar chamado' })
    }
})

//Rota para criar problema e solução
router.post('/criarProblemas', async (req: Request, res: Response) => {
    try {
        const { desc, tema_id, solucao } = req.body;
        const problema = await enviarProblema(desc, tema_id, solucao);
        res.json(problema);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao enviar problema e solução.' })
    }
})

//Rota para buscar problema e solução
router.get('/buscarProblemas', async (req: Request, res: Response) => {
    try {
        const problemas = await buscarProblemas();
        res.json(problemas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar problema e solução.' })
    }
})

//Rota para atualizar problema
router.put('/atualizarProblemas/:id', async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const data = req.body;

        const problemas = await atualizarProblemas(id, data);

        res.json(problemas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar o problema e solução.' })
    }
})

//Rota para atualizar solução
router.put('/atualizarSolucoes/:id', async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const data = req.body;

        const problemas = await atualizarSolucoes(id, data);

        res.json(problemas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar a solução.' })
    }
})

//Rota para deletar problema e solução
router.delete('/deletarProblemas/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const problemas = await deletarProblemas(id);
        res.json(problemas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao deletar problema e solução.' })
    }
})

//Rota para deletar problema e solução
router.delete('/deletarSolucoes/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const solucao = await deletarSolucoes(id);
        res.json(solucao);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao deletar problema e solução.' })
    }
})

export default router; 