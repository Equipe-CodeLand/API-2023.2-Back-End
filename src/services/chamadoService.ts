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
const temaRepository = AppDataSource.getRepository(Tema)

export async function criarChamado(req) {
    const { idCliente, idTema, desc } = req.body;
    const cliente = await buscarCliente(idCliente)
    const status = await statusRepository.findOneBy({id: 1})
    const tema = await temaRepository.findOneBy({id:idTema})
    const prioridade = await definirPrioridade(tema);
    console.log(`idTema recebido: ${idTema}`);
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
    });
    return chamados;
}

export async function definirPrioridade(tema: Tema) {
    switch(tema.nome){
        case 'Sem acesso a internet':
            return await prioridadeRepository.findOneBy({id:1})
        case 'Modem':
            return await prioridadeRepository.findOneBy({id:2})
        case 'Outros':
            return await prioridadeRepository.findOneBy({id:2})
        case 'Velocidade da internet':
            return await prioridadeRepository.findOneBy({id:3})
        default:
            return null
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