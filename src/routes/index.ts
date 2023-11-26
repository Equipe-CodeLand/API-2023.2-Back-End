import { Router, Request, Response, query } from 'express';
import { buscarMensagens, enviarMensagem } from '../services/mensagemService';
import { AppDataSource } from '../config/data-source';
import Usuario from '../entities/usuario.entity';
import { authenticate, authorize, generateAuthToken, getUserRoles } from '../middlewares/authenticate';
import buscarChamadosComInformacoes, { andamentoChamado, atribuirAtendente, atualizarPrioridade, buscarChamadosAtendente, buscarChamadosCliente, criarChamado, definirPrioridade, dropdownChamados, finalizarChamado } from '../services/chamadoService';
import { buscarAtendentes, criarAtendente } from '../services/atendenteService';
import { buscarClientePorUserId, criarCliente } from '../services/clienteService';
import { criarAdministrador } from '../services/administradorService';
import { buscarProblemas, deletarProblemas, enviarProblema, atualizarProblemas, atualizarSolucoes, deletarSolucoes, enviarSolucao, buscarProblema } from '../services/problemaService';
import Chamado from '../entities/chamado.entity';
import Status from '../entities/status.entity';
import Tema from '../entities/tema.entity';
import { buscarUsuario, cadastrarUsuario, checkUsuario } from '../services/usuarioService';
import { criarCliente } from '../services/clienteService';
import { chamadosPorPrioridade, chamadosPorStatus, chamadosPorTema, chamadosPorTurno, tempoMedioTotal } from '../services/relatorioService';

const qs = require('qs');

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

        const chamadosComInformacoes = await buscarChamadosComInformacoes(temaArray,statusArray,prioridadeArray);
        chamadosComInformacoes.forEach(async chamado => {
              await atualizarPrioridade(chamado)
          })

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

router.get('/atendenteChamados/:userId/:tema/:status/:prioridade', authenticate, authorize(['Atendente']), (req, res) => {
    const { tema, status, prioridade } = req.params;

    const parseParam = (param: string | undefined) => {
        const paramSemNome = param?.split('=')[1];
        return paramSemNome ? paramSemNome.split(',').map(value => Number(value.trim())) : [];
    };

    const temaArray = parseParam(tema);
    const statusArray = parseParam(status);
    const prioridadeArray = parseParam(prioridade);
    const userId = parseInt(req.params.userId)
    
    buscarChamadosAtendente(userId,temaArray,statusArray,prioridadeArray)
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
    const userId = parseInt(req.params.userId)
    console.log(userId);
    buscarChamadosCliente(userId,temaArray,statusArray,prioridadeArray)
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
router.post('/cadastro/cliente', async (req: Request, res: Response)=>{
    try {                
        // Verifique se o usuário já existe
        const usuarioExistente = await checkUsuario(req.body.cpf, req.body.email);

        if (usuarioExistente) {
            // Se o usuário já existir, retorne um erro
            res.json({ message: 'Usuário já existe' });
        } else {
            // Se o usuário não existir, crie um novo usuário
            const novoUsuario = new Usuario(req.body.nome, req.body.sobrenome, req.body.cpf, req.body.email, req.body.telefone, req.body.senha);
            const clienteCriado = await criarCliente(novoUsuario);
            res.json(clienteCriado);
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar cliente' });
    }
})

  router.post('/cadastro/atendente',async (req,res)=>{
    try{
        const usuarioExistente = await checkUsuario(req.body.cpf, req.body.email);
        if(usuarioExistente){
            res.json({message: 'Usuário já existe'})
        } else{
            const novoUsuario = new Usuario(req.body.nome, req.body.sobrenome, req.body.cpf, req.body.email, req.body.telefone, req.body.senha);
            const atendenteCriado = await criarAtendente(req.body.turno, novoUsuario);
            res.json(atendenteCriado)
        }
    }catch(error){
        res.status(500).json({ message: 'Erro ao criar atendente' });
    }
})


  // Rota para criar administrador
  router.post('/cadastro/administrador', async (req,res)=>{
    try{
        const usuarioExistente = await checkUsuario(req.body.cpf, req.body.email);
        if (usuarioExistente){
            res.json({message:'Administrador já existe'})
        }else{
            const novoUsuario = new Usuario(req.body.nome, req.body.sobrenome, req.body.cpf, req.body.email, req.body.telefone, req.body.senha);
            const adminCriado = await criarAdministrador(novoUsuario);
            res.json(adminCriado)
        }
    }catch(error){
        res.status(500).json({mesaage: 'Erro ao criar o administrador'})
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

  // Rota para criar um chamado
router.post('/alterarPrioridade', authenticate, authorize(['Cliente']), async (req: Request, res: Response) => {
    try {
        const cliente = await buscarClientePorUserId(req.body.userId)
        const idTema = parseInt(req.body.idTema);
        const desc = req.body.desc;
        
        
        const statusRepository = AppDataSource.getRepository(Status);
        const status = await statusRepository.findOneBy({ id: 1 });
        const temaRepository = AppDataSource.getRepository(Tema);
        const tema = await temaRepository.findOneBy({ id: idTema });
        const prioridade = await definirPrioridade(tema);

        const chamadoRepository = AppDataSource.getRepository(Chamado);
        const chamado = await chamadoRepository.save(new Chamado(tema, desc, cliente, status, prioridade));

        // Adicionando a lógica de atualização de status
        await atualizarStatusChamado(chamado);

        enviarMensagem(desc, chamado.id, req.body.userId, 'Cliente');
        
        res.json(chamado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar o chamado' });
    }
});


  // Rota para aterar status para Em Andamento
  router.put('/chamado/andamentoChamado', async (req: Request, res: Response) => {
    try{        
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
        console.log(tema_id)
        res.json(problema);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao enviar problema e solução.' })
    }
})

//Rota para adicionar mais solução
router.post('/criarSolucoes/:id', async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { desc } = req.body;
        const solucao = await enviarSolucao(desc, id);
        res.json(solucao);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao enviar solução.' })
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

//Rota para buscar um problema específico
router.get('/buscarProblema/:id', async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const problemas = await buscarProblema(id);
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

function atualizarStatusChamado(chamado: any) {
    throw new Error('Function not implemented.');
}


/*  Rota para buscar numero de chamados por tema em determinado periodo
    Passar datas no axios. Ex: {params: {diaInicio: 1, mesInicio: 11, anoInicio: 2023, diaFinal: 3, mesFinal: 11, anoFinal: 2023}} */
router.get('/relatorios/chamadosPorTema', (req, res) => {
    const qst = qs.parse(req.query)
    chamadosPorTema(new Date(qst.anoInicio, qst.mesInicio-1, qst.diaInicio), new Date(qst.anoFinal, qst.mesFinal-1, qst.diaFinal, 23, 59, 59, 999))
        .then(dados => res.json(dados))
        .catch(error => res.status(500).send(error))
})

/*  Rota para buscar numero de chamados por prioridade em determinado periodo
    Passar datas no axios. Ex: {params: {diaInicio: 1, mesInicio: 11, anoInicio: 2023, diaFinal: 3, mesFinal: 11, anoFinal: 2023}} */
router.get('/relatorios/chamadosPorStatus', (req, res) => {
    const qst = qs.parse(req.query)
    chamadosPorStatus(new Date(qst.anoInicio, qst.mesInicio-1, qst.diaInicio), new Date(qst.anoFinal, qst.mesFinal-1, qst.diaFinal, 23, 59, 59, 999))
        .then(dados => res.json(dados))
        .catch(error => res.status(500).send(error))
})

/*  Rota para buscar numero de chamados por prioridade em determinado periodo
    Passar datas no axios. Ex: {params: {diaInicio: 1, mesInicio: 11, anoInicio: 2023, diaFinal: 3, mesFinal: 11, anoFinal: 2023}} */
router.get('/relatorios/chamadosPorPrioridade', (req, res) => {
    const qst = qs.parse(req.query)
    chamadosPorPrioridade(new Date(qst.anoInicio, qst.mesInicio-1, qst.diaInicio), new Date(qst.anoFinal, qst.mesFinal-1, qst.diaFinal, 23, 59, 59, 999))
        .then(dados => res.json(dados))
        .catch(error => res.status(500).send(error))
})

/*  Rota para buscar numero de chamados por turnos em determinado periodo
    Passar datas no axios. Ex: {params: {diaInicio: 1, mesInicio: 11, anoInicio: 2023, diaFinal: 3, mesFinal: 11, anoFinal: 2023}} */
router.get('/relatorios/chamadosPorTurno', (req, res) => {
    const qst = qs.parse(req.query)
    chamadosPorTurno(new Date(qst.anoInicio, qst.mesInicio-1, qst.diaInicio), new Date(qst.anoFinal, qst.mesFinal-1, qst.diaFinal, 23, 59, 59, 999))
        .then(dados => res.json(dados))
        .catch(error => res.status(500).send(error))
})

router.get('/relatorios/tempoMedioTotal', (req, res) => {
    const qst = qs.parse(req.query)
    tempoMedioTotal(new Date(qst.anoInicio, qst.mesInicio-1, qst.diaInicio), new Date(qst.anoFinal, qst.mesFinal-1, qst.diaFinal, 23, 59, 59, 999))
        .then(dados => res.json(dados))
        .catch(error => res.status(500).send(error))
})
 
export default router; 