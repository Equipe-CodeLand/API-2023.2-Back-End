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
async function buscarChamados() {
    const chamados = await getChamadoRepository().createQueryBuilder('chamado')
        .select(['chamado.id', 'chamado.tema', 'chamado.inicio', 'chamado.final', 'chamado.desc'])
        .getMany();

    return chamados;
}
async function buscarChamadosComInformacoes() {
    /*const chamados = await getChamadoRepository().createQueryBuilder()
        .select([
            'vw_chamados_informacoes.id',
            'vw_chamados_informacoes.cliente_nome',
            'vw_chamados_informacoes.tema',
            'vw_chamados_informacoes.status',
            'vw_chamados_informacoes.inicio',
            'vw_chamados_informacoes.final',
            'vw_chamados_informacoes.desc',
            'vw_chamados_informacoes.texto',
            'vw_chamados_informacoes.tipoUsuario',
            'vw_chamados_informacoes.horaEnvio'
        ])
        .from('vw_chamados_informacoes', 'vw_chamados_informacoes')
        .getRawMany();*/
    const chamados = await getChamadoRepository().find({
        select:{
            "id":true,
            "tema":true,
            "inicio":true,
            "final":true,
            "desc":true,
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
        /*.innerJoinAndSelect('chamado.cliente', 'cliente')
        .innerJoinAndSelect('cliente.usuario', 'usuario')
        .innerJoinAndSelect('chamado.status', 'status')
        .select(['chamado.id', 'usuario.nome as cliente_nome', 'chamado.tema', 'status.nome as status', 'chamado.inicio', 'chamado.final', 'chamado.desc'])
        .getMany();*/
        

    return chamados;
}

export default buscarChamadosComInformacoes