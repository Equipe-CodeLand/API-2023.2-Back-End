import { AppDataSource, getChamadoRepository } from "../config/data-source";
import Chamado from "../entities/chamado.entity";
import Prioridade from "../entities/prioridade.entity";
import Status from "../entities/status.entity";
import { buscarAtendente } from "./atendenteService";
import { buscarCliente } from "./clienteService";

const chamadoRepository = AppDataSource.getRepository(Chamado)
const statusRepository = AppDataSource.getRepository(Status)
const prioridadeRepository = AppDataSource.getRepository(Prioridade)

export async function atribuirAtendente(idChamado: number, idAtendente: number){
    let chamado = await buscarChamado(idChamado);
    let atendente = await buscarAtendente(idAtendente);
    chamado.atendente = atendente
    return chamadoRepository.save(chamado)
    
}



export async function criarChamado(idCliente: number, tema: string, desc: string) {
    const cliente = await buscarCliente(idCliente)
    const status = await statusRepository.findOneBy({id: 1})
    const prioridade = await prioridadeRepository.findOneBy({id: 1})
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
            "tema":true,
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
            prioridade: true
        }
    })
    return chamados;
}

export default buscarChamadosComInformacoes