import { AppDataSource, getChamadoRepository } from "../config/data-source";
import Chamado from "../entities/chamado.entity";
import Status from "../entities/status.entity";
import { buscarCliente } from "./clienteService";

const chamadoRepository = AppDataSource.getRepository(Chamado)
const statusRepository = AppDataSource.getRepository(Status)

export async function criarChamado(idCliente: number, tema: string, desc: string) {
    const cliente = await buscarCliente(idCliente)
    const status = await statusRepository.findOneBy({id: 1})
    return chamadoRepository.save(new Chamado(tema, desc, cliente, status))
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
            "cliente":{
                "usuario":{
                    id: true,
                    nome: true,
                    email: true
                }
            }},
        relations:{
            cliente: {usuario: true},
            status: true
        }
    })
    return chamados;
}

export default buscarChamadosComInformacoes