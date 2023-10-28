import { getRepository } from "typeorm";
import { AppDataSource, getChamadoRepository } from "../config/data-source";
import Chamado from "../entities/chamado.entity";
import Prioridade from "../entities/prioridade.entity";
import Status from "../entities/status.entity";
import { buscarCliente } from "./clienteService";
import Tema from "../entities/tema.entity";

const chamadoRepository = AppDataSource.getRepository(Chamado)
const statusRepository = AppDataSource.getRepository(Status)
const prioridadeRepository = AppDataSource.getRepository(Prioridade)

export async function criarChamado(idCliente: number, tema: Tema, desc: string) {
    const cliente = await buscarCliente(idCliente)
    const prioridade = await definirPrioridade(tema);
    const status = await statusRepository.findOneBy({id: 1})
    return chamadoRepository.save(new Chamado(tema, desc, cliente, status, prioridade))
}

export async function buscarChamado(id: number) {
    return chamadoRepository.findOneBy({id: id})
}

async function buscarTodosChamados() {
    try {
        const chamados = await buscarTodosChamados(); 
        return chamados;
    } catch (error) {
        throw new Error(`Erro ao buscar chamados: ${error.message}`);
    }
}
async function buscarChamadosComInformacoes() {
    const chamados = await getChamadoRepository().find({
        select:{
            "id":true,
            "tema":{
                id: true,
                nome: true
            },
            "inicio":true,
            "final":true,
            "desc":true,
            'status':{
                id: true,
                nome: true
            },
            'prioridade':{
                id: true,
                nome: true
            },
            "cliente":{
                "usuario":{
                    id: true,
                    nome: true,
                    email: true
                }
            }},
        relations:{
            cliente: {usuario: true},
            status: true,
            prioridade: true,
            tema: true
        }
    })
    return chamados;
}

export async function definirPrioridade(tema: Tema): Promise<Prioridade> {
    let prioridade = null;
    
    if (tema.nome === 'Sem acesso a internet') {
        prioridade = await Prioridade.findOne(1); 
    } else if (tema.nome === 'Modem' || tema.nome === 'Outros') {
        prioridade = await Prioridade.findOne(2); 
    } else if (tema.nome === 'Velocidade da internet') {
        prioridade = await Prioridade.findOne(3); 
    }
    
    if (prioridade) {
        return prioridade;
    } else {
        throw new Error('Tema inválido');
    }
}

export async function dropdownChamados() {
    const chamados = await getChamadoRepository().find({
        select:{
            "id":true,
            "desc":true,
            "cliente":{
                "usuario":{
                    id: true,
                    nome: true,
                    email: true
                }
            },
        'mensagens':{
            texto: true
        }},
        relations:{
            cliente: {usuario: true},
            mensagens: {usuario: true},
        }
    })
    return chamados;
}

export default buscarChamadosComInformacoes